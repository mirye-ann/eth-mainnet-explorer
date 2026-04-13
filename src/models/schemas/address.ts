import { z } from "zod";

import {
  decimalStringSchema,
  decimalStringToNumberSchema,
  emptyStringToNullAddressSchema,
  emptyStringToNullContractAddressSchema,
  ethereumAddressSchema,
  transactionHashSchema,
} from "./shared";

export const addressOverviewSchema = z.object({
  address: ethereumAddressSchema,
  balance: decimalStringSchema,
  transactionCount: z.number().int().nonnegative(),
});

export const addressTransactionSchema = z
  .object({
    blockHash: transactionHashSchema,
    blockNumber: decimalStringToNumberSchema,
    confirmations: decimalStringToNumberSchema,
    contractAddress: emptyStringToNullContractAddressSchema,
    from: ethereumAddressSchema,
    functionName: z.string().optional().default(""),
    gas: decimalStringSchema,
    gasPrice: decimalStringSchema,
    gasUsed: decimalStringSchema,
    hash: transactionHashSchema,
    input: z.string(),
    isError: z.enum(["0", "1"]),
    methodId: z.string().optional().default(""),
    nonce: decimalStringToNumberSchema,
    timeStamp: decimalStringToNumberSchema,
    to: emptyStringToNullAddressSchema,
    transactionIndex: decimalStringToNumberSchema,
    txreceipt_status: z.enum(["", "0", "1"]).optional().default(""),
    value: decimalStringSchema,
  })
  .transform((transaction) => {
    const status =
      transaction.txreceipt_status === "1"
        ? "success"
        : transaction.txreceipt_status === "0" || transaction.isError === "1"
          ? "failed"
          : "success";

    return {
      blockHash: transaction.blockHash,
      blockNumber: transaction.blockNumber,
      confirmations: transaction.confirmations,
      contractAddress: transaction.contractAddress,
      from: transaction.from,
      functionName: transaction.functionName,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      gasUsed: transaction.gasUsed,
      hash: transaction.hash,
      input: transaction.input,
      methodId: transaction.methodId,
      nonce: transaction.nonce,
      status,
      timestamp: transaction.timeStamp,
      to: transaction.to,
      transactionIndex: transaction.transactionIndex,
      value: transaction.value,
    };
  });

export const addressTransactionsSchema = z.array(addressTransactionSchema);

export type AddressOverview = z.infer<typeof addressOverviewSchema>;
export type AddressTransaction = z.infer<typeof addressTransactionSchema>;
