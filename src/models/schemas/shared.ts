import { z } from "zod";

const hexQuantityPattern = /^0x[0-9a-fA-F]+$/;
const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;
const transactionHashPattern = /^0x[a-fA-F0-9]{64}$/;

export const hexQuantitySchema = z
  .string()
  .regex(hexQuantityPattern, "Expected an Ethereum hex quantity.");

export const decimalStringSchema = z.string().regex(/^\d+$/, "Expected a base-10 numeric string.");

export const ethereumAddressSchema = z
  .string()
  .regex(ethereumAddressPattern, "Expected an Ethereum address.");

export const transactionHashSchema = z
  .string()
  .regex(transactionHashPattern, "Expected an Ethereum transaction hash.");

export const blockHashSchema = transactionHashSchema;

export const hexQuantityToNumberSchema = hexQuantitySchema.transform((value) =>
  Number.parseInt(value, 16),
);

export const nullableHexQuantityToNumberSchema = z
  .union([hexQuantitySchema, z.null()])
  .transform((value) => (value === null ? null : Number.parseInt(value, 16)));

export const hexQuantityToDecimalStringSchema = hexQuantitySchema.transform((value) =>
  BigInt(value).toString(),
);

export const nullableHexQuantityToDecimalStringSchema = z
  .union([hexQuantitySchema, z.null()])
  .transform((value) => (value === null ? null : BigInt(value).toString()));

export const decimalStringToNumberSchema = decimalStringSchema.transform((value) =>
  Number.parseInt(value, 10),
);

export const nullableEthereumAddressSchema = z.union([ethereumAddressSchema, z.null()]);

export const emptyStringToNullAddressSchema = z
  .union([ethereumAddressSchema, z.literal("")])
  .transform((value) => (value === "" ? null : value));

export const emptyStringToNullContractAddressSchema = z
  .union([ethereumAddressSchema, z.literal("")])
  .transform((value) => (value === "" ? null : value));
