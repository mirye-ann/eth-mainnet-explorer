import { z } from "zod";

import {
  blockHashSchema,
  ethereumAddressSchema,
  hexQuantityToDecimalStringSchema,
  hexQuantityToNumberSchema,
  nullableHexQuantityToDecimalStringSchema,
} from "./shared";
import { blockTransactionSchema } from "./transaction";

export const blockSchema = z
  .object({
    baseFeePerGas: nullableHexQuantityToDecimalStringSchema.optional().default(null),
    gasLimit: hexQuantityToDecimalStringSchema,
    gasUsed: hexQuantityToDecimalStringSchema,
    hash: blockHashSchema,
    miner: ethereumAddressSchema,
    number: hexQuantityToNumberSchema,
    parentHash: blockHashSchema,
    timestamp: hexQuantityToNumberSchema,
    transactions: z.array(blockTransactionSchema),
  })
  .transform((block) => ({
    baseFeePerGas: block.baseFeePerGas,
    blockNumber: block.number,
    gasLimit: block.gasLimit,
    gasUsed: block.gasUsed,
    hash: block.hash,
    miner: block.miner,
    parentHash: block.parentHash,
    timestamp: block.timestamp,
    transactionCount: block.transactions.length,
    transactions: block.transactions,
  }));

export type Block = z.infer<typeof blockSchema>;
