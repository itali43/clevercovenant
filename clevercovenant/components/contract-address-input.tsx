"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ContractAddressInputProps {
  onAddressSubmitted: (address: string) => void;
}

export function ContractAddressInput({
  onAddressSubmitted,
}: ContractAddressInputProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setError(null);

    // Basic Ethereum address validation
    if (value && !/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setError("Invalid Ethereum address format");
    } else {
      onAddressSubmitted(value);
    }
  };

  return (
    <Card className="bg-navy-800 border-navy-600">
      <CardHeader>
        <CardTitle className="text-white font-mono">Contract Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="Enter contract address (0x...)"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAddressChange(e.target.value)
            }
            className="bg-navy-900 border-navy-600 text-white font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            aria-describedby={error ? "address-error" : undefined}
          />
        </div>

        {error && (
          <Alert className="bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription
              id="address-error"
              className="text-red-300 font-mono"
            >
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
