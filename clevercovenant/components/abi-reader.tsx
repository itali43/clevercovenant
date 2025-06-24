"use client"

import { useState } from "react"
import { AbiInput } from "./abi-input"
import { FunctionDisplay } from "./function-display"
import { groupFunctionsByType } from "@/lib/abi-utils"
import type { Abi } from "@/lib/schemas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export function AbiReader() {
  const [parsedAbi, setParsedAbi] = useState<Abi | null>(null)

  const handleAbiParsed = (abi: Abi) => {
    setParsedAbi(abi)
  }

  const groupedFunctions = parsedAbi ? groupFunctionsByType(parsedAbi) : {}
  const functionTypes = Object.keys(groupedFunctions)

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="border-b border-navy-700 bg-navy-800" role="banner">
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center">
            {/* Left navigation */}
            <nav role="navigation" aria-label="Main navigation">
              <ul className="flex items-center gap-8 list-none">
                <li>
                  <button className="text-white hover:text-cyan-400 cursor-pointer font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800 rounded px-2 py-1">
                    Parse
                  </button>
                </li>
                <li>
                  <button className="text-white hover:text-cyan-400 cursor-pointer font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800 rounded px-2 py-1">
                    Interact
                  </button>
                </li>
                <li>
                  <button className="text-white hover:text-cyan-400 cursor-pointer font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800 rounded px-2 py-1">
                    Share
                  </button>
                </li>
              </ul>
            </nav>

            {/* Centered title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-mono text-white">Smart Contract ABI Reader</h1>
            </div>

            {/* Right side - Connect Wallet button */}
            <div className="ml-auto">
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-navy-900 font-mono font-semibold border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-800"
                aria-label="Connect cryptocurrency wallet"
              >
                🔗 Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main role="main" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section aria-labelledby="intro-heading">
            <div className="text-center mb-8">
              <p id="intro-heading" className="text-2xl font-mono text-white leading-relaxed">
                Paste or Upload your Smart Contract ABI to parse and explore!
              </p>
            </div>
          </section>

          <section aria-labelledby="abi-input-section">
            <h2 id="abi-input-section" className="sr-only">
              ABI Input Section
            </h2>
            <AbiInput onAbiParsed={handleAbiParsed} />
          </section>

          {parsedAbi && (
            <section aria-labelledby="parsed-functions-heading">
              <Card className="bg-navy-800 border-navy-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle id="parsed-functions-heading" className="text-white font-mono">
                      Parsed Functions ({parsedAbi.length})
                    </CardTitle>
                    <div className="flex gap-2" role="group" aria-label="Function type summary">
                      {functionTypes.map((type) => (
                        <Badge
                          key={type}
                          className="bg-navy-700 text-cyan-400 border-cyan-400 font-mono"
                          aria-label={`${groupedFunctions[type].length} ${type} functions`}
                        >
                          {type} ({groupedFunctions[type].length})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {functionTypes.length > 0 ? (
                    <Tabs defaultValue={functionTypes[0]} className="w-full">
                      <TabsList
                        className="grid w-full grid-cols-4 bg-navy-700 border-navy-600"
                        aria-label="Function type tabs"
                      >
                        {functionTypes.map((type) => (
                          <TabsTrigger
                            key={type}
                            value={type}
                            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-navy-900 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-navy-700"
                            aria-label={`View ${type} functions`}
                          >
                            {type}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {functionTypes.map((type) => (
                        <TabsContent key={type} value={type} className="mt-6">
                          <div className="grid gap-4" role="list" aria-label={`${type} functions`}>
                            {groupedFunctions[type].map((func, index) => (
                              <div key={index} role="listitem">
                                <FunctionDisplay func={func} />
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="text-center py-8 text-white font-mono" role="status">
                      No functions found in the ABI
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
