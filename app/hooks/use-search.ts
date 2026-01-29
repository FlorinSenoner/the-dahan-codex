import type { Doc } from "convex/_generated/dataModel";
import Fuse from "fuse.js";
import { useMemo } from "react";

type Spirit = Doc<"spirits">;
type Opening = Doc<"openings"> & { spiritName?: string; spiritSlug?: string };

interface SearchResults {
  spirits: Spirit[];
  openings: Opening[];
}

export function useSearch(
  spirits: Spirit[] | undefined,
  openings: Opening[] | undefined,
  query: string,
): SearchResults {
  return useMemo(() => {
    // Return empty if no query or no data
    if (!query.trim() || !spirits || !openings) {
      return { spirits: [], openings: [] };
    }

    // Create Fuse instances with weighted keys
    const spiritFuse = new Fuse(spirits, {
      keys: [
        { name: "name", weight: 2 },
        { name: "aspectName", weight: 1.5 },
        { name: "summary", weight: 1 },
      ],
      threshold: 0.3,
      includeScore: true,
    });

    const openingFuse = new Fuse(openings, {
      keys: [
        { name: "name", weight: 2 },
        { name: "description", weight: 1 },
        { name: "spiritName", weight: 1.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });

    // Search and return top 10 results per type
    const spiritResults = spiritFuse
      .search(query)
      .slice(0, 10)
      .map((r) => r.item);
    const openingResults = openingFuse
      .search(query)
      .slice(0, 10)
      .map((r) => r.item);

    return { spirits: spiritResults, openings: openingResults };
  }, [spirits, openings, query]);
}
