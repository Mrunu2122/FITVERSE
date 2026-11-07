import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { BRAND_CONFIG } from "@/lib/constants";

export function FoundationHeader() {
  return (
    <header className="border-b border-charcoal-border/80 bg-obsidian/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-ice/40 bg-ice/10 text-ice">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-sm font-semibold tracking-[0.28em] text-silver-bright">
              {BRAND_CONFIG.name}
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-silver-muted sm:inline-block">
              // {BRAND_CONFIG.tagline}
            </span>
          </div>
        </div>

        <StatusBadge variant="ice" pulse>
          Architecture Ready
        </StatusBadge>
      </Container>
    </header>
  );
}
