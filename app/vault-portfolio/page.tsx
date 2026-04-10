"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Download } from "lucide-react";

interface VaultCore {
  hid: number;
  name: string;
  element: string;
  type: string;
  gender: string;
  is_trainer: boolean;
  bike_pwr?: number;
  bike_var?: number;
  bike_adj?: number;
}

export default function VaultPortfolio() {
  const [vaultAddress, setVaultAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [cores, setCores] = useState<VaultCore[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeVault = async () => {
    setLoading(true);
    setError(null);
    
    if (!vaultAddress.trim()) {
      setError("Please enter a vault address");
      setLoading(false);
      return;
    }

    try {
      // Fetch vault cores with info
      const vaultResponse = await fetch("https://api.dnaracing.run/fbike/vault/bikes_inf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault: vaultAddress.toLowerCase() }),
      });
      const vaultResult = await vaultResponse.json();
      
      if (vaultResult.status === "success" && vaultResult.result.length > 0) {
        const coreIds = vaultResult.result.map((c: any) => c.hid);
        
        // Fetch power stats for all cores
        const powerResponse = await fetch("https://api.dnaracing.run/fbike/cores/power_bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hids: coreIds }),
        });
        const powerResult = await powerResponse.json();
        
        // Merge data
        const enrichedCores = vaultResult.result.map((core: any) => {
          const power = powerResult.result?.find((p: any) => p.hid === core.hid);
          return {
            ...core,
            bike_pwr: power?.power?.bike?.power?.fill?.per || 0,
            bike_var: power?.power?.bike?.variance?.fill?.per || 0,
            bike_adj: power?.power?.bike?.adjodds?.fill?.per || 0,
          };
        });
        
        setCores(enrichedCores);
      } else {
        setError("No cores found in this vault");
      }
    } catch (err) {
      setError("API error - please try again");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalCores = cores.length;
  const trainers = cores.filter(c => c.is_trainer).length;
  const regularCores = totalCores - trainers;
  
  // Element distribution
  const elementCounts = cores.reduce((acc, core) => {
    acc[core.element] = (acc[core.element] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Type distribution
  const typeCounts = cores.reduce((acc, core) => {
    acc[core.type] = (acc[core.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Average stats
  const avgPower = cores.length > 0 ? 
    cores.reduce((sum, c) => sum + (c.bike_pwr || 0), 0) / cores.length : 0;
  const avgVar = cores.length > 0 ?
    cores.reduce((sum, c) => sum + (c.bike_var || 0), 0) / cores.length : 0;
  const avgAdj = cores.length > 0 ?
    cores.reduce((sum, c) => sum + (c.bike_adj || 0), 0) / cores.length : 0;
  
  // Top performers
  const topByPower = [...cores].sort((a, b) => (b.bike_pwr || 0) - (a.bike_pwr || 0)).slice(0, 5);

  const downloadCSV = () => {
    const headers = ["HID", "Name", "Element", "Type", "Gender", "Trainer", "Bike PWR", "Bike VAR", "Bike ADJ"];
    const rows = cores.map(c => [
      c.hid,
      c.name || "",
      c.element || "",
      c.type || "",
      c.gender || "",
      c.is_trainer ? "Yes" : "No",
      (c.bike_pwr || 0).toFixed(1),
      (c.bike_var || 0).toFixed(1),
      (c.bike_adj || 0).toFixed(1),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vault-${vaultAddress.slice(0, 8)}-${cores.length}-cores.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Vault Portfolio</h1>
          <p className="text-muted-foreground">Analyze your entire vault performance and distribution</p>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Vault Address</h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={vaultAddress}
              onChange={(e) => setVaultAddress(e.target.value)}
              placeholder="0x... or email address"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <button
              onClick={analyzeVault}
              disabled={loading}
              className="px-8 py-3 gradient-purple text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading..." : <><Search className="w-4 h-4 inline mr-2" />Analyze</>}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {cores.length > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Total Cores</span>
                <div className="text-3xl font-bold">{totalCores}</div>
                <div className="text-xs text-muted-foreground">{regularCores} regular, {trainers} trainers</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Avg Bike PWR</span>
                <div className="text-3xl font-bold">{avgPower.toFixed(1)}%</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Avg Bike VAR</span>
                <div className="text-3xl font-bold">{avgVar.toFixed(1)}%</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Avg Bike ADJ</span>
                <div className="text-3xl font-bold">{avgAdj.toFixed(1)}%</div>
              </div>
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Element Distribution */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Element Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(elementCounts).map(([element, count]) => (
                    <div key={element} className="flex items-center justify-between">
                      <span className="capitalize">{element}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(count / totalCores) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Distribution */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Type Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(typeCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary" 
                            style={{ width: `${(count / totalCores) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top 5 Performers (by Bike PWR)</h3>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Download Full List
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">HID</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Element</th>
                      <th className="text-center py-3 px-4 font-medium">PWR</th>
                      <th className="text-center py-3 px-4 font-medium">VAR</th>
                      <th className="text-center py-3 px-4 font-medium">ADJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topByPower.map((core, idx) => (
                      <tr key={core.hid} className="border-t border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4">#{idx + 1}</td>
                        <td className="py-3 px-4">{core.hid}</td>
                        <td className="py-3 px-4">{core.name || "Unnamed"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm capitalize">
                            {core.element}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{(core.bike_pwr || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">{(core.bike_var || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">{(core.bike_adj || 0).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">All Cores ({totalCores})</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">HID</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Element</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-center py-3 px-4 font-medium">PWR</th>
                      <th className="text-center py-3 px-4 font-medium">VAR</th>
                      <th className="text-center py-3 px-4 font-medium">ADJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cores.map(core => (
                      <tr key={core.hid} className="border-t border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          {core.hid}
                          {core.is_trainer && <span className="ml-2 text-xs text-primary">(T)</span>}
                        </td>
                        <td className="py-3 px-4">{core.name || "Unnamed"}</td>
                        <td className="py-3 px-4 capitalize">{core.element}</td>
                        <td className="py-3 px-4 capitalize text-sm text-muted-foreground">{core.type}</td>
                        <td className="py-3 px-4 text-center">{(core.bike_pwr || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">{(core.bike_var || 0).toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">{(core.bike_adj || 0).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {cores.length === 0 && !error && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter a vault address above to analyze your portfolio</p>
          </div>
        )}
      </div>
    </div>
  );
}
