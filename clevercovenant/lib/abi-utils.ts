import type { AbiFunction, AbiInput, AbiOutput } from "./schemas"

export const formatType = (input: AbiInput | AbiOutput): string => {
  if (input.components && input.components.length > 0) {
    const componentTypes = input.components.map(formatType).join(", ")
    return `${input.type}(${componentTypes})`
  }
  return input.type
}

export const getStateMutabilityColor = (stateMutability?: string): string => {
  switch (stateMutability) {
    case "pure":
      return "text-green-400"
    case "view":
      return "text-blue-400"
    case "nonpayable":
      return "text-yellow-400"
    case "payable":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export const getFunctionTypeColor = (type: string): string => {
  switch (type) {
    case "function":
      return "text-blue-400"
    case "constructor":
      return "text-purple-400"
    case "event":
      return "text-green-400"
    case "error":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export const groupFunctionsByType = (functions: AbiFunction[]) => {
  return functions.reduce(
    (acc, func) => {
      const type = func.type
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(func)
      return acc
    },
    {} as Record<string, AbiFunction[]>,
  )
}
