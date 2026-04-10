"use client";

import Link from "next/link";
import { ArrowLeft, Dna } from "lucide-react";

export default function BreedingAnalyzer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Breeding Analyzer</h1>
          <p className="text-muted-foreground">Find optimal breeding pairs and check compatibility</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Dna className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            The Breeding Analyzer will help you find the best breeding pairs, check for half-sibling conflicts,
            and predict offspring attributes based on parent stats.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Compatibility Check</h3>
              <p className="text-sm text-muted-foreground">
                Verify breeding pairs aren't half-siblings
              </p>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Optimal Pairing</h3>
              <p className="text-sm text-muted-foreground">
                Find best matches based on power stats
              </p>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Lineage Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track parent and offspring relationships
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
