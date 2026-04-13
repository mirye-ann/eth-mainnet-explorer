import { z } from "zod";

import { getEtherscanEnv } from "@/config/env";
import {
  addressOverviewSchema,
  addressTransactionsSchema,
  type AddressOverview,
  type AddressTransaction,
} from "@/models/schemas/address";
import { blockSchema, type Block } from "@/models/schemas/block";
import { ethereumAddressSchema, transactionHashSchema } from "@/models/schemas/shared";
import { transactionSchema, type Transaction } from "@/models/schemas/transaction";

type FetchLike = typeof fetch;
type AddressTransactionOptions = {
  offset?: number;
  page?: number;
  sort?: "asc" | "desc";
};
type EtherscanClientOptions = {
  apiKey?: string;
  apiUrl?: string;
  fetchFn?: FetchLike;
};
type ErrorCode = "api_error" | "http_error" | "invalid_response" | "not_found";

const proxyEnvelopeSchema = z.object({
  error: z
    .object({
      code: z.number(),
      message: z.string(),
    })
    .optional(),
  result: z.unknown(),
});

const accountEnvelopeSchema = z.object({
  message: z.string(),
  result: z.unknown(),
  status: z.string(),
});

export class EtherscanApiError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "EtherscanApiError";
  }
}

export class EtherscanClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly fetchFn: FetchLike;

  constructor(options: EtherscanClientOptions = {}) {
    const envConfig =
      options.apiKey || options.apiUrl
        ? {
            apiKey: options.apiKey ?? getEtherscanEnv().apiKey,
            apiUrl: options.apiUrl ?? getEtherscanEnv().apiUrl,
          }
        : getEtherscanEnv();

    if (!options.fetchFn && typeof fetch !== "function") {
      throw new Error("A fetch implementation is required in this runtime.");
    }

    this.apiKey = envConfig.apiKey;
    this.apiUrl = envConfig.apiUrl;
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async getLatestBlockNumber() {
    return this.requestProxy(
      {
        action: "eth_blockNumber",
        module: "proxy",
      },
      z
        .string()
        .regex(/^0x[0-9a-fA-F]+$/)
        .transform((value) => Number.parseInt(value, 16)),
      "latest block number",
    );
  }

  async getBlockByNumber(blockNumber: number): Promise<Block> {
    assertNonNegativeInteger(blockNumber, "blockNumber");

    return this.requestProxy(
      {
        action: "eth_getBlockByNumber",
        boolean: "true",
        module: "proxy",
        tag: toBlockTag(blockNumber),
      },
      blockSchema,
      `block ${blockNumber}`,
    );
  }

  async getLatestBlocks(count: number): Promise<Block[]> {
    assertPositiveInteger(count, "count");

    const latestBlockNumber = await this.getLatestBlockNumber();

    return Promise.all(
      Array.from({ length: count }, (_, index) => this.getBlockByNumber(latestBlockNumber - index)),
    );
  }

  async getTransactionByHash(hash: string): Promise<Transaction> {
    const validatedHash = transactionHashSchema.parse(hash);

    const transaction = await this.requestNullableProxy(
      {
        action: "eth_getTransactionByHash",
        module: "proxy",
        txhash: validatedHash,
      },
      z.unknown(),
      `transaction ${validatedHash}`,
    );

    if (transaction === null) {
      throw new EtherscanApiError(`Transaction ${validatedHash} was not found.`, "not_found");
    }

    const receipt = await this.requestNullableProxy(
      {
        action: "eth_getTransactionReceipt",
        module: "proxy",
        txhash: validatedHash,
      },
      z.unknown(),
      `receipt for transaction ${validatedHash}`,
    );

    return this.parseSchema(
      transactionSchema,
      { receipt, transaction },
      `transaction ${validatedHash}`,
    );
  }

  async getAddressOverview(address: string): Promise<AddressOverview> {
    const validatedAddress = ethereumAddressSchema.parse(address);

    const [balance, transactionCount] = await Promise.all([
      this.requestProxy(
        {
          action: "eth_getBalance",
          address: validatedAddress,
          module: "proxy",
          tag: "latest",
        },
        z
          .string()
          .regex(/^0x[0-9a-fA-F]+$/)
          .transform((value) => BigInt(value).toString()),
        `balance for ${validatedAddress}`,
      ),
      this.requestProxy(
        {
          action: "eth_getTransactionCount",
          address: validatedAddress,
          module: "proxy",
          tag: "latest",
        },
        z
          .string()
          .regex(/^0x[0-9a-fA-F]+$/)
          .transform((value) => Number.parseInt(value, 16)),
        `transaction count for ${validatedAddress}`,
      ),
    ]);

    return this.parseSchema(
      addressOverviewSchema,
      {
        address: validatedAddress,
        balance,
        transactionCount,
      },
      `address overview for ${validatedAddress}`,
    );
  }

  async getAddressTransactions(
    address: string,
    options: AddressTransactionOptions = {},
  ): Promise<AddressTransaction[]> {
    const validatedAddress = ethereumAddressSchema.parse(address);
    const page = options.page ?? 1;
    const offset = options.offset ?? 10;
    const sort = options.sort ?? "desc";

    assertPositiveInteger(page, "page");
    assertPositiveInteger(offset, "offset");

    return this.requestAccount(
      {
        action: "txlist",
        address: validatedAddress,
        endblock: "99999999",
        module: "account",
        offset: String(offset),
        page: String(page),
        sort,
        startblock: "0",
      },
      addressTransactionsSchema,
      `transactions for ${validatedAddress}`,
      true,
    );
  }

  // Rate limiting is intentionally basic for now; callers receive explicit API errors until a stricter
  // retry or queue strategy is needed in a later issue.
  private async requestProxy<T>(
    params: Record<string, string>,
    schema: z.ZodType<T>,
    context: string,
  ) {
    const payload = this.parseSchema(
      proxyEnvelopeSchema,
      await this.fetchJson(params),
      `${context} envelope`,
    );

    if (payload.error) {
      throw new EtherscanApiError(payload.error.message, "api_error", payload.error);
    }

    return this.parseSchema(schema, payload.result, context);
  }

  private async requestNullableProxy<T>(
    params: Record<string, string>,
    schema: z.ZodType<T>,
    context: string,
  ) {
    const payload = this.parseSchema(
      proxyEnvelopeSchema,
      await this.fetchJson(params),
      `${context} envelope`,
    );

    if (payload.error) {
      throw new EtherscanApiError(payload.error.message, "api_error", payload.error);
    }

    if (payload.result === null) {
      return null;
    }

    return this.parseSchema(schema, payload.result, context);
  }

  private async requestAccount<T>(
    params: Record<string, string>,
    schema: z.ZodType<T>,
    context: string,
    allowEmptyArray: boolean,
  ) {
    const payload = this.parseSchema(
      accountEnvelopeSchema,
      await this.fetchJson(params),
      `${context} envelope`,
    );

    if (payload.status !== "1") {
      const isAllowedEmptyArray =
        allowEmptyArray && Array.isArray(payload.result) && payload.result.length === 0;

      if (!isAllowedEmptyArray) {
        throw new EtherscanApiError(
          `Etherscan returned an API error for ${context}: ${payload.message}`,
          "api_error",
          payload,
        );
      }
    }

    return this.parseSchema(schema, payload.result, context);
  }

  private parseSchema<T>(schema: z.ZodType<T>, value: unknown, context: string) {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      throw new EtherscanApiError(
        `Etherscan returned an invalid payload for ${context}.`,
        "invalid_response",
        parsed.error.flatten(),
      );
    }

    return parsed.data;
  }

  private async fetchJson(params: Record<string, string>) {
    const url = new URL(this.apiUrl);

    url.search = new URLSearchParams({
      ...params,
      apikey: this.apiKey,
    }).toString();

    const response = await this.fetchFn(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new EtherscanApiError(
        `Etherscan request failed with HTTP ${response.status}.`,
        "http_error",
        { status: response.status, url: url.toString() },
      );
    }

    return response.json();
  }
}

function assertPositiveInteger(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }
}

function assertNonNegativeInteger(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
}

function toBlockTag(blockNumber: number) {
  return `0x${blockNumber.toString(16)}`;
}

export function createEtherscanClient(options?: EtherscanClientOptions) {
  return new EtherscanClient(options);
}
