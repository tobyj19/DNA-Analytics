"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function VaultPortfolio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">Vault Portfolio</h1>
          <p className="text-muted-foreground">Analyze entire vault performance and value</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vault Portfolio will analyze your entire collection, providing insights on total value,
            power distribution, breeding opportunities, and performance metrics across all your cores.
          </p>
        </div>
      </div>
    </div>
  );
}
