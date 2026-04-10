"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

interface CoreDetails {
  hid: number;
  name: string;
  element: string;
  type: string;
  gender: string;
  bike_pwr?: number;
  bike_var?: number;
  bike_adj?: number;
  bike_races?: number;
  car_pwr?: number;
  car_var?: number;
  car_adj?: number;
  horse_pwr?: number;
  horse_var?: number;
  horse_adj?: number;
}

export default function CoreAnalytics() {
  const [coreId, setCoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [core, setCore] = useState<CoreDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCore = async () => {
    setLoading(true);
    setError(null);
    
    const id = parseInt(coreId);
    if (isNaN(id)) {
      setError("Please enter a valid core ID");
      setLoading(false);
      return;
    }

    try {
      const infoResponse = await fetch("https://api.dnaracing.run/fbike/cores/mini_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids: [id] }),
      });
      const infoResult = await infoResponse.json();
      
      const powerResponse = await fetch("https://api.dnaracing.run/fbike/cores/power_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids: [id] }),
      });
      const powerResult = await powerResponse.json();
      
      if (infoResult.status === "success" && powerResult.status === "success" && infoResult.result.length > 0) {
        const coreInfo = infoResult.result[0];
        const power = powerResult.result[0];
        
        setCore({
          hid: coreInfo.hid,
          name: coreInfo.name,
          element: coreInfo.element,
          type: coreInfo.type,
          gender: coreInfo.gender,
          bike_pwr: power?.power?.bike?.power?.fill?.per || 0,
          bike_var: power?.power?.bike?.variance?.fill?.per || 0,
          bike_adj: power?.power?.bike?.adjodds?.fill?.per || 0,
          bike_races: power?.power?.bike?.races_n || 0,
          car_pwr: power?.power?.car?.power?.fill?.per || 0,
          car_var: power?.power?.car?.variance?.fill?.per || 0,
          car_adj: power?.power?.car?.adjodds?.fill?.per || 0,
          horse_pwr: power?.power?.horse?.power?.fill?.per || 0,
          horse_var: power?.power?.horse?.variance?.fill?.per || 0,
          horse_adj: power?.power?.horse?.adjodds?.fill?.per || 0,
        });
      } else {
        setError("Core not found");
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
          
          <h1 className="text-4xl font-bold mb-2">Core Analytics</h1>
          <p className="text-muted-foreground">Deep dive into individual core performance and stats</p>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Core</h2>
          
          <div className="flex gap-4">
            <input
              type="number"
              value={coreId}
              onChange={(e) => setCoreId(e.target.value)}
              placeholder="Enter Core ID (e.g., 588)"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <button
              onClick={analyzeCore}
              disabled={loading}
              className="px-8 py-3 gradient-purple text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : <><Search className="w-4 h-4 inline mr-2" />Analyze</>}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {core && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-sm text-muted-foreground mb-1">Core #{core.hid}</div>
              <h2 className="text-3xl font-bold mb-3">{core.name || "Unnamed"}</h2>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">{core.element}</span>
                <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">{core.type}</span>
                <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">{core.gender}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bike */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🚲 Bike</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{core.bike_pwr?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{core.bike_var?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{core.bike_adj?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Races</span><span>{core.bike_races}</span></div>
                </div>
              </div>

              {/* Car */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🚗 Car</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{core.car_pwr?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{core.car_var?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{core.car_adj?.toFixed(1)}%</span></div>
                </div>
              </div>

              {/* Horse */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🐴 Horse</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{core.horse_pwr?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{core.horse_var?.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{core.horse_adj?.toFixed(1)}%</span></div>
                </div>
              </div>
            </div>

            {core.bike_races === 0 && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">💡 This core has no race history. Power stats require racing data.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
