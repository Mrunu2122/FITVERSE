"use client";

import { SECTION_ORDER, cn } from "@/lib/constants";
import { useViewportStore } from "@/store/viewport-context";

/**
 * Fixed right-edge vertical pagination dots (01 through 05) matching the storyboard reference.
 */
export function SectionPagination() {
  const { activeSection } = useViewportStore();

  return (
    <aside
      aria-label="Section Pagination"
      className="pointer-events-auto fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3.5 sm:flex lg:right-8"
    >
      {SECTION_ORDER.map((sec) => {
        const isActive = sec.id === activeSection;
        return (
          <a
            key={sec.id}
            href={sec.href}
            aria-label={`Jump to Section ${sec.number}: ${sec.label}`}
            aria-current={isActive ? "step" : undefined}
            title={`${sec.number} — ${sec.label}`}
            className="group flex h-4 w-4 items-center justify-center focus:outline-none"
          >
            <span
              className={cn(
                " rounded-full transition-all duration-300",
                isActive
                  ? "h-2.5 w-2.5 bg-silver-bright shadow-[0_0_12px_#FFFFFF,0_0_20px_#818CF8]"
                  : "h-2 w-2 border border-silver/45 bg-transparent group-hover:border-silver-bright group-hover:bg-silver/30"
              )}
            />
          </a>
        );
      })}
    </aside>
  );
}

export default SectionPagination;
