"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface CoreData {
  hid: number;
  name: string;
  element: string;
  type: string;
  gender: string;
}

export default function CoreComparison() {
  const [coreIds, setCoreIds] = useState<string[]>(["", ""]);
  const [coresData, setCoresData] = useState<CoreData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCoreSlot = () => {
    if (coreIds.length < 5) {
      setCoreIds([...coreIds, ""]);
    }
  };

  const removeCoreSlot = (index: number) => {
    if (coreIds.length > 2) {
      const newCoreIds = coreIds.filter((_, i) => i !== index);
      setCoreIds(newCoreIds);
    }
  };

  const updateCoreId = (index: number, value: string) => {
    const newCoreIds = [...coreIds];
    newCoreIds[index] = value;
    setCoreIds(newCoreIds);
  };

  const compareCores = async () => {
    setLoading(true);
    setError(null);
    
    const validIds = coreIds
      .filter(id => id.trim() !== "")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (validIds.length < 2) {
      setError("Please enter at least 2 core IDs");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.dnaracing.run/fbike/cores/mini_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids: validIds }),
      });

      const result = await response.json();
      
      if (result.status === "success") {
        setCoresData(result.result);
      } else {
        setError("Failed to fetch core data");
      }
    } catch (err) {
      setError("API error - please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Core Comparison</h1>
          <p className="text-muted-foreground">Compare multiple cores side-by-side across all metrics</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Core IDs</h2>
          
          <div className="space-y-3">
            {coreIds.map((id, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-muted-foreground w-8">#{index + 1}</span>
                <input
                  type="text"
                  placeholder="Enter Core ID (e.g., 588)"
                  value={id}
                  onChange={(e) => updateCoreId(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {coreIds.length > 2 && (
                  <button
                    onClick={() => removeCoreSlot(index)}
                    className="p-3 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4">
            {coreIds.length < 5 && (
              <button
                onClick={addCoreSlot}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Core (max 5)
              </button>
            )}
          </div>

          <button
            onClick={compareCores}
            disabled={loading}
            className="w-full mt-6 px-6 py-3 gradient-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : "Compare Cores"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {coresData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Comparison Results</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Attribute</th>
                    {coresData.map((core) => (
                      <th key={core.hid} className="text-center py-3 px-4">
                        <div className="font-semibold">Core #{core.hid}</div>
                        <div className="text-sm text-muted-foreground font-normal">{core.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Element</td>
                    {coresData.map((core) => (
                      <td key={core.hid} className="py-3 px-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                          {core.element}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Type</td>
                    {coresData.map((core) => (
                      <td key={core.hid} className="py-3 px-4 text-center">{core.type}</td>
                    ))}
                  </tr>
                  
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Gender</td>
                    {coresData.map((core) => (
                      <td key={core.hid} className="py-3 px-4 text-center">{core.gender}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Note:</strong> Power stats and detailed analytics coming soon!
              </p>
            </div>
          </div>
        )}

        {coresData.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter core IDs above and click "Compare Cores" to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
