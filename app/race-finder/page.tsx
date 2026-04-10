"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Trophy } from "lucide-react";

export default function RaceFinder() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Race Finder</h1>
          <p className="text-muted-foreground">Find upcoming races and optimal racing opportunities</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground mb-8">
              The Race Finder feature is currently in development. This will help you discover upcoming races,
              optimal racing times, and track scheduling for your cores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-muted/50 rounded-lg">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Upcoming Races</h3>
                <p className="text-sm text-muted-foreground">View scheduled races and events</p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Optimal Timing</h3>
                <p className="text-sm text-muted-foreground">Find the best times to race your cores</p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Race Analytics</h3>
                <p className="text-sm text-muted-foreground">Track performance and win rates</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-primary">
                💡 <strong>Note:</strong> This feature requires race scheduling API access. Check back soon for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

