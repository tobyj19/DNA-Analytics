"use client";

import Link from "next/link";
import { Search } from "lucide-react";

const tools = [
  {
    title: "Core Analytics",
    description: "Search and analyze individual core performance, stats, and race history",
    icon: "📊",
    href: "/core-analytics",
  },
  {
    title: "Core Comparison",
    description: "Compare multiple cores side-by-side across all metrics",
    icon: "⚖️",
    href: "/core-comparison",
  },
  {
    title: "Race Finder",
    description: "Find upcoming races and optimal racing opportunities",
    icon: "🏁",
    href: "/race-finder",
  },
  {
    title: "Vault Portfolio",
    description: "Analyze entire vaults with filters, stats, and performance tracking",
    icon: "💼",
    href: "/vault-portfolio",
  },
  {
    title: "Breeding Analyzer",
    description: "Find optimal breeding pairs with distance categorization",
    icon: "🧬",
    href: "/breeding-analyzer",
  },
  {
    title: "Power Database",
    description: "Search and filter power stats across all cores",
    icon: "🗄️",
    href: "/power-database",
  },
  {
    title: "Speed Rankings",
    description: "Top 30 fastest cores per distance vs global averages",
    icon: "⚡",
    href: "/speed-rankings",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="gradient-purple rounded-2xl p-12 text-center mb-12 shadow-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          DNA Racing Analytics
        </h1>
        <p className="text-lg text-white/90">
          Comprehensive tools for analyzing cores, breeding, and performance
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search cores by name or HID..."
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Search by name or HID number
        </p>
      </div>

      {/* Tools Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Tools & Features
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group"
          >
            <div className="bg-gradient-to-br from-card/50 to-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 min-h-[220px] flex flex-col">
              <div className="text-5xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {tool.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {tool.description}
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-primary text-sm font-medium group-hover:text-primary/80 transition-colors">
                  Launch Tool →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Coming Soon Cards */}
        <div className="bg-card/30 border border-border/50 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center">
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-muted-foreground/60">
            More analytics tools in development
          </p>
        </div>

        <div className="bg-card/30 border border-border/50 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center">
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-muted-foreground/60">
            More analytics tools in development
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 pt-8 text-center">
        <p className="text-foreground mb-2">
          DNA Racing Analytics Dashboard v2.0
        </p>
        <p className="text-sm text-muted-foreground">
          Select a tool above to get started
        </p>
      </div>
    </div>
  );
}
