import { z } from "zod"

export const AbiInputSchema = z.object({
  name: z.string(),
  type: z.string(),
  indexed: z.boolean().optional(),
  components: z.array(z.lazy(() => AbiInputSchema)).optional(),
})

export const AbiOutputSchema = z.object({
  name: z.string().optional(),
  type: z.string(),
  components: z.array(z.lazy(() => AbiOutputSchema)).optional(),
})

export const AbiFunctionSchema = z.object({
  type: z.enum(["function", "constructor", "event", "error", "fallback", "receive"]),
  name: z.string().optional(),
  inputs: z.array(AbiInputSchema).default([]),
  outputs: z.array(AbiOutputSchema).default([]),
  stateMutability: z.enum(["pure", "view", "nonpayable", "payable"]).optional(),
  anonymous: z.boolean().optional(),
})

export const AbiSchema = z.array(AbiFunctionSchema)

export type AbiInput = z.infer<typeof AbiInputSchema>
export type AbiOutput = z.infer<typeof AbiOutputSchema>
export type AbiFunction = z.infer<typeof AbiFunctionSchema>
export type Abi = z.infer<typeof AbiSchema>
