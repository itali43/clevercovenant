import type { AbiInput } from "./schemas";
import { parseAbiParameter } from "viem";

export const formatInput = (input: AbiInput, value: string) => {
  if (!value) return undefined;

  try {
    // Handle common Ethereum types
    if (input.type === "address") return value;
    if (input.type === "uint256" || input.type === "int256")
      return BigInt(value);
    if (input.type === "bool") return value.toLowerCase() === "true";
    if (input.type.startsWith("bytes")) return value as `0x${string}`;
    if (input.type === "string") return value;
    if (input.type.includes("[]")) return JSON.parse(value); // Array inputs

    // For other types, try to parse as ABI parameter
    return parseAbiParameter(input.type);
  } catch (err) {
    console.error(`Error formatting input for ${input.type}:`, err);
    return value;
  }
};
