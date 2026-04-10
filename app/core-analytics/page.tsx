"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Trophy, TrendingUp } from "lucide-react";

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

interface Race {
  rid: string;
  race_name: string;
  rvmode: string;
  class: number;
  pos: number;
  time: number;
  gate: number;
  rgate: number;
  start_time: string;
  prize_eth: number;
  prize_usd: number;
  fee: number;
  paytoken: string;
}

export default function CoreAnalytics() {
  const [coreId, setCoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [core, setCore] = useState<CoreDetails | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
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
      // Fetch core info
      const infoResponse = await fetch("https://api.dnaracing.run/fbike/cores/mini_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids: [id] }),
      });
      const infoResult = await infoResponse.json();
      
      // Fetch power stats
      const powerResponse = await fetch("https://api.dnaracing.run/fbike/cores/power_bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hids: [id] }),
      });
      const powerResult = await powerResponse.json();
      
      // Fetch race history
      const racesResponse = await fetch("https://api.dnaracing.run/fbike/i/hraces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hid: id, limit: 50 }),
      });
      const racesResult = await racesResponse.json();
      
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
        
        if (racesResult.status === "success") {
          setRaces(racesResult.result || []);
        }
      } else {
        setError("Core not found");
      }
    } catch (err) {
      setError("API error - please try again");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from race history
  const wins = races.filter(r => r.pos === 1).length;
  const totalRaces = races.length;
  const winRate = totalRaces > 0 ? ((wins / totalRaces) * 100).toFixed(1) : "0.0";
  const totalEarnings = races.reduce((sum, r) => sum + (r.prize_eth || 0), 0);
  const avgPosition = totalRaces > 0 ? (races.reduce((sum, r) => sum + r.pos, 0) / totalRaces).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Core Analytics</h1>
          <p className="text-muted-foreground">Deep dive into core performance and race history</p>
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
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-sm text-muted-foreground mb-1">Core #{core.hid}</div>
              <h2 className="text-3xl font-bold mb-3">{core.name || "Unnamed"}</h2>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">{core.element}</span>
                <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">{core.type}</span>
                <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">{core.gender}</span>
              </div>
            </div>

            {/* Racing Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                </div>
                <div className="text-3xl font-bold">{winRate}%</div>
                <div className="text-xs text-muted-foreground">{wins} / {totalRaces} races</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Avg Position</span>
                </div>
                <div className="text-3xl font-bold">{avgPosition}</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Total Races</span>
                <div className="text-3xl font-bold">{totalRaces}</div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <span className="text-sm text-muted-foreground">Earnings</span>
                <div className="text-3xl font-bold">{totalEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total prize pool</div>
              </div>
            </div>

            {/* Power Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🚲 Bike</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{(core.bike_pwr || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{(core.bike_var || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{(core.bike_adj || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Races</span><span>{core.bike_races}</span></div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🚗 Car</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{(core.car_pwr || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{(core.car_var || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{(core.car_adj || 0).toFixed(1)}%</span></div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-2xl mb-3">🐴 Horse</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">PWR</span><span>{(core.horse_pwr || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAR</span><span>{(core.horse_var || 0).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ADJ</span><span>{(core.horse_adj || 0).toFixed(1)}%</span></div>
                </div>
              </div>
            </div>

            {/* Race History */}
            {races.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold">Race History</h2>
                  <p className="text-sm text-muted-foreground">Last {races.length} races</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Race</th>
                        <th className="text-center py-3 px-4 font-medium">Mode</th>
                        <th className="text-center py-3 px-4 font-medium">Class</th>
                        <th className="text-center py-3 px-4 font-medium">Position</th>
                        <th className="text-center py-3 px-4 font-medium">Time</th>
                        <th className="text-center py-3 px-4 font-medium">Prize</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {races.slice(0, 20).map((race, idx) => (
                        <tr key={idx} className="border-t border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 text-sm">{race.race_name}</td>
                          <td className="py-3 px-4 text-center text-sm">{race.rvmode}</td>
                          <td className="py-3 px-4 text-center text-sm">{race.class}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-sm ${
                              race.pos === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                              race.pos <= 3 ? 'bg-primary/20 text-primary' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {race.pos}/{race.rgate}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-sm">{race.time.toFixed(2)}s</td>
                          <td className="py-3 px-4 text-center text-sm">
                            {race.prize_eth > 0 ? `${race.prize_eth} ${race.paytoken}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(race.start_time).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {races.length > 20 && (
                  <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
                    Showing first 20 of {races.length} races
                  </div>
                )}
              </div>
            )}

            {core.bike_races === 0 && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">💡 This core has no race history yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
