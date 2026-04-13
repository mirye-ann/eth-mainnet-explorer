import { describe, expect, it, vi } from "vitest";

import { EtherscanClient } from "./etherscan-client";

const blockHash = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const transactionHash = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const senderAddress = "0x1111111111111111111111111111111111111111";
const receiverAddress = "0x2222222222222222222222222222222222222222";
const minerAddress = "0x3333333333333333333333333333333333333333";

function createJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

describe("EtherscanClient", () => {
  it("parses block data from the proxy API", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        result: {
          baseFeePerGas: "0x3b9aca00",
          gasLimit: "0x1c9c380",
          gasUsed: "0x5208",
          hash: blockHash,
          miner: minerAddress,
          number: "0x12d687",
          parentHash: "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
          timestamp: "0x661ab800",
          transactions: [
            {
              blockHash,
              blockNumber: "0x12d687",
              from: senderAddress,
              gas: "0x5208",
              gasPrice: "0x3b9aca00",
              hash: transactionHash,
              input: "0x",
              nonce: "0x1",
              to: receiverAddress,
              transactionIndex: "0x0",
              value: "0xde0b6b3a7640000",
            },
          ],
        },
      }),
    ) as typeof fetch;

    const client = new EtherscanClient({
      apiKey: "test-key",
      apiUrl: "https://api.etherscan.io/api",
      fetchFn,
    });

    const block = await client.getBlockByNumber(1234567);

    expect(block.blockNumber).toBe(1234567);
    expect(block.transactionCount).toBe(1);
    expect(block.transactions[0]?.value).toBe("1000000000000000000");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("combines transaction details with receipt status", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(
        createJsonResponse({
          result: {
            blockHash,
            blockNumber: "0x12d687",
            from: senderAddress,
            gas: "0x5208",
            gasPrice: "0x3b9aca00",
            hash: transactionHash,
            input: "0x",
            nonce: "0x2",
            to: receiverAddress,
            transactionIndex: "0x0",
            value: "0x0",
          },
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          result: {
            gasUsed: "0x5208",
            status: "0x1",
          },
        }),
      ) as typeof fetch;

    const client = new EtherscanClient({
      apiKey: "test-key",
      apiUrl: "https://api.etherscan.io/api",
      fetchFn,
    });

    const transaction = await client.getTransactionByHash(transactionHash);

    expect(transaction.status).toBe("success");
    expect(transaction.gasUsed).toBe("21000");
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("parses address transactions from the account API", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        message: "OK",
        result: [
          {
            blockHash,
            blockNumber: "1234567",
            confirmations: "12",
            contractAddress: "",
            from: senderAddress,
            functionName: "",
            gas: "21000",
            gasPrice: "1000000000",
            gasUsed: "21000",
            hash: transactionHash,
            input: "0x",
            isError: "0",
            methodId: "0x",
            nonce: "5",
            timeStamp: "1713024000",
            to: receiverAddress,
            transactionIndex: "0",
            txreceipt_status: "1",
            value: "1000000000000000000",
          },
        ],
        status: "1",
      }),
    ) as typeof fetch;

    const client = new EtherscanClient({
      apiKey: "test-key",
      apiUrl: "https://api.etherscan.io/api",
      fetchFn,
    });

    const transactions = await client.getAddressTransactions(senderAddress, { offset: 1 });

    expect(transactions).toHaveLength(1);
    expect(transactions[0]?.status).toBe("success");
    expect(transactions[0]?.contractAddress).toBeNull();
  });
});
