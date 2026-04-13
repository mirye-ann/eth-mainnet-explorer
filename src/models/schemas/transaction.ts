import { z } from "zod";

import {
  blockHashSchema,
  ethereumAddressSchema,
  hexQuantitySchema,
  hexQuantityToDecimalStringSchema,
  hexQuantityToNumberSchema,
  nullableEthereumAddressSchema,
  nullableHexQuantityToNumberSchema,
  transactionHashSchema,
} from "./shared";

const proxyTransactionBaseSchema = z.object({
  blockHash: z.union([blockHashSchema, z.null()]),
  blockNumber: nullableHexQuantityToNumberSchema,
  from: ethereumAddressSchema,
  gas: hexQuantityToDecimalStringSchema,
  gasPrice: hexQuantityToDecimalStringSchema,
  hash: transactionHashSchema,
  input: z.string(),
  nonce: hexQuantityToNumberSchema,
  to: nullableEthereumAddressSchema,
  transactionIndex: nullableHexQuantityToNumberSchema,
  value: hexQuantityToDecimalStringSchema,
});

export const blockTransactionSchema = proxyTransactionBaseSchema
  .extend({
    blockHash: blockHashSchema,
    blockNumber: hexQuantityToNumberSchema,
    transactionIndex: hexQuantityToNumberSchema,
  })
  .transform((transaction) => ({
    blockHash: transaction.blockHash,
    blockNumber: transaction.blockNumber,
    from: transaction.from,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice,
    hash: transaction.hash,
    input: transaction.input,
    nonce: transaction.nonce,
    to: transaction.to,
    transactionIndex: transaction.transactionIndex,
    value: transaction.value,
  }));

const proxyTransactionReceiptSchema = z.object({
  gasUsed: hexQuantityToDecimalStringSchema,
  status: z.union([hexQuantitySchema, z.null()]).transform((value) => {
    if (value === null) {
      return null;
    }

    return BigInt(value) === BigInt(1) ? "success" : "failed";
  }),
});

export const transactionSchema = z
  .object({
    receipt: proxyTransactionReceiptSchema.nullable(),
    transaction: proxyTransactionBaseSchema,
  })
  .transform(({ receipt, transaction }) => ({
    blockHash: transaction.blockHash,
    blockNumber: transaction.blockNumber,
    from: transaction.from,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice,
    gasUsed: receipt?.gasUsed ?? null,
    hash: transaction.hash,
    input: transaction.input,
    nonce: transaction.nonce,
    status: receipt?.status ?? "pending",
    to: transaction.to,
    transactionIndex: transaction.transactionIndex,
    value: transaction.value,
  }));

export type BlockTransaction = z.infer<typeof blockTransactionSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
