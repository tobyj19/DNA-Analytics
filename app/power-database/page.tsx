"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Download } from "lucide-react";

interface CorePowerData {
  hid: number;
  name?: string;
  element?: string;
  type?: string;
  gender?: string;
  bike_pwr?: number;
  bike_var?: number;
  bike_adj?: number;
  car_pwr?: number;
  car_var?: number;
  car_adj?: number;
  horse_pwr?: number;
  horse_var?: number;
  horse_adj?: number;
}

export default function PowerDatabase() {
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [loading, setLoading] = useState(false);
  const [cores, setCores] = useState<CorePowerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [minPower, setMinPower] = useState(0);
  const [minVar, setMinVar] = useState(0);
  const [minAdj, setMinAdj] = useState(0);
  const [elementFilter, setElementFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const searchCores = async () => {
    setLoading(true);
    setError(null);
    
    const start = parseInt(startId);
    const end = parseInt(endId);
    
    if (isNaN(start) || isNaN(end) || start > end) {
      setError("Please enter valid start and end IDs");
      setLoading(false);
      return;
    }
    
    if (end - start > 500) {
      setError("Please limit search to 500 cores at a time");
      setLoading(false);
      return;
    }

    const hids = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    try {
      // Fetch core info
      const infoResponse = await fetch("https://api.dnaracing.run/fbike/cores/mini_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids }),
      });
      const infoResult = await infoResponse.json();
      
      // Fetch power stats
      const powerResponse = await fetch("https://api.dnaracing.run/fbike/cores/power_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids }),
      });
      const powerResult = await powerResponse.json();
      
      if (infoResult.status === "success" && powerResult.status === "success") {
        const coreInfo = infoResult.result;
        const corePower = powerResult.result;
        
        // Merge data
        const merged = coreInfo.map((core: any) => {
          const power = corePower.find((p: any) => p.hid === core.hid);
          return {
            hid: core.hid,
            name: core.name,
            element: core.element,
            type: core.type,
            gender: core.gender,
            bike_pwr: power?.power?.bike?.power?.fill?.per || 0,
            bike_var: power?.power?.bike?.variance?.fill?.per || 0,
            bike_adj: power?.power?.bike?.adjodds?.fill?.per || 0,
            car_pwr: power?.power?.car?.power?.fill?.per || 0,
            car_var: power?.power?.car?.variance?.fill?.per || 0,
            car_adj: power?.power?.car?.adjodds?.fill?.per || 0,
            horse_pwr: power?.power?.horse?.power?.fill?.per || 0,
            horse_var: power?.power?.horse?.variance?.fill?.per || 0,
            horse_adj: power?.power?.horse?.adjodds?.fill?.per || 0,
          };
        });
        
        setCores(merged);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("API error - please try again");
    } finally {
      setLoading(false);
    }
  };

  const filteredCores = cores.filter(core => {
    if (core.bike_pwr < minPower) return false;
    if (core.bike_var < minVar) return false;
    if (core.bike_adj < minAdj) return false;
    if (elementFilter && core.element !== elementFilter) return false;
    if (typeFilter && core.type !== typeFilter) return false;
    return true;
  });

  const downloadCSV = () => {
    const headers = ["HID", "Name", "Element", "Type", "Gender", "Bike PWR", "Bike VAR", "Bike ADJ"];
    const rows = filteredCores.map(c => [
      c.hid, c.name, c.element, c.type, c.gender,
      c.bike_pwr?.toFixed(1), c.bike_var?.toFixed(1), c.bike_adj?.toFixed(1)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `power-database-${filteredCores.length}-cores.csv`;
    a.click();
  };

  const uniqueElements = Array.from(new Set(cores.map(c => c.element).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(cores.map(c => c.type).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Power Database</h1>
          <p className="text-muted-foreground">
            Search and filter power stats across all cores
          </p>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Core Range</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Start Core ID</label>
              <input
                type="number"
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-2">End Core ID</label>
              <input
                type="number"
                value={endId}
                onChange={(e) => setEndId(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={searchCores}
                disabled={loading}
                className="w-full px-6 py-3 gradient-purple text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Searching..." : <><Search className="w-4 h-4 inline mr-2" />Search</>}
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            💡 Limit: 500 cores per search. Only cores with race history will have power stats.
          </p>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Filters */}
        {cores.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Min Bike PWR %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minPower}
                  onChange={(e) => setMinPower(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-center mt-1">{minPower}%</div>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Min Bike VAR %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minVar}
                  onChange={(e) => setMinVar(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-center mt-1">{minVar}%</div>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Min Bike ADJ %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minAdj}
                  onChange={(e) => setMinAdj(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-center mt-1">{minAdj}%</div>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Element</label>
                <select
                  value={elementFilter}
                  onChange={(e) => setElementFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="">All</option>
                  {uniqueElements.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="">All</option>
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCores.length} of {cores.length} cores
              </p>
              
              {filteredCores.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Table */}
        {filteredCores.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">HID</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Element</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-center py-3 px-4 font-medium">🚲 PWR</th>
                    <th className="text-center py-3 px-4 font-medium">🚲 VAR</th>
                    <th className="text-center py-3 px-4 font-medium">🚲 ADJ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCores.slice(0, 100).map(core => (
                    <tr key={core.hid} className="border-t border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4">{core.hid}</td>
                      <td className="py-3 px-4">{core.name || "Unnamed"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                          {core.element}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{core.type}</td>
                      <td className="py-3 px-4 text-center">{core.bike_pwr?.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-center">{core.bike_var?.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-center">{core.bike_adj?.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCores.length > 100 && (
              <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
                Showing first 100 cores. Use filters to narrow results or download CSV for full data.
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {cores.length === 0 && !error && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter a core ID range above to search the power database</p>
          </div>
        )}
      </div>
    </div>
  );
}
