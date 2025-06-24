import type { AbiFunction } from "@/lib/schemas"
import { formatType, getStateMutabilityColor, getFunctionTypeColor } from "@/lib/abi-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FunctionDisplayProps {
  func: AbiFunction
}

const getStateMutabilityLabel = (stateMutability?: string): string => {
  switch (stateMutability) {
    case "pure":
      return "Pure function - does not read or modify state"
    case "view":
      return "View function - reads state but does not modify"
    case "nonpayable":
      return "Non-payable function - modifies state but cannot receive Ether"
    case "payable":
      return "Payable function - can receive Ether"
    default:
      return "Unknown state mutability"
  }
}

const getFunctionTypeLabel = (type: string): string => {
  switch (type) {
    case "function":
      return "Contract function"
    case "constructor":
      return "Contract constructor"
    case "event":
      return "Contract event"
    case "error":
      return "Contract error"
    default:
      return `Contract ${type}`
  }
}

export function FunctionDisplay({ func }: FunctionDisplayProps) {
  const functionId = `function-${func.name || func.type}-${Math.random().toString(36).substr(2, 9)}`

  return (
    <Card
      className="bg-navy-800 border-navy-600 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-navy-900"
      role="article"
      aria-labelledby={`${functionId}-title`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle id={`${functionId}-title`} className="text-lg font-mono text-white">
            {func.name || func.type}
          </CardTitle>
          <div className="flex gap-2" role="group" aria-label="Function metadata">
            <Badge
              className={`${getFunctionTypeColor(func.type)} bg-navy-700 border-current font-mono`}
              aria-label={getFunctionTypeLabel(func.type)}
            >
              {func.type}
            </Badge>
            {func.stateMutability && (
              <Badge
                className={`${getStateMutabilityColor(func.stateMutability)} bg-navy-700 border-current font-mono`}
                aria-label={getStateMutabilityLabel(func.stateMutability)}
              >
                {func.stateMutability}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {func.inputs.length > 0 && (
          <section aria-labelledby={`${functionId}-inputs`}>
            <h4 id={`${functionId}-inputs`} className="text-sm font-semibold text-cyan-400 mb-2 font-mono">
              Inputs ({func.inputs.length})
            </h4>
            <ul className="space-y-1 list-none" role="list">
              {func.inputs.map((input, index) => (
                <li key={index} className="flex items-center gap-2 text-sm font-mono" role="listitem">
                  <span className="text-cyan-300" aria-label={`Parameter type: ${formatType(input)}`}>
                    {formatType(input)}
                  </span>
                  {input.name && (
                    <span className="text-white" aria-label={`Parameter name: ${input.name}`}>
                      {input.name}
                    </span>
                  )}
                  {input.indexed && (
                    <Badge
                      className="text-xs bg-navy-700 text-cyan-400 border-cyan-400"
                      aria-label="This parameter is indexed for event filtering"
                    >
                      indexed
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {func.outputs.length > 0 && (
          <section aria-labelledby={`${functionId}-outputs`}>
            <h4 id={`${functionId}-outputs`} className="text-sm font-semibold text-cyan-400 mb-2 font-mono">
              Outputs ({func.outputs.length})
            </h4>
            <ul className="space-y-1 list-none" role="list">
              {func.outputs.map((output, index) => (
                <li key={index} className="flex items-center gap-2 text-sm font-mono" role="listitem">
                  <span className="text-cyan-300" aria-label={`Return type: ${formatType(output)}`}>
                    {formatType(output)}
                  </span>
                  {output.name && (
                    <span className="text-white" aria-label={`Return value name: ${output.name}`}>
                      {output.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {func.inputs.length === 0 && func.outputs.length === 0 && (
          <p className="text-white font-mono text-sm" role="status">
            No parameters or return values
          </p>
        )}
      </CardContent>
    </Card>
  )
}
