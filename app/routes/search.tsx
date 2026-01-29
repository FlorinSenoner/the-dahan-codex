import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Heading, Text } from "@/components/ui/typography";
import { useSearch } from "@/hooks";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

/**
 * Global search page - searches cached TanStack Query data (works offline)
 *
 * Uses Fuse.js for fuzzy client-side search across spirits and openings.
 * Results are grouped by type with counts.
 */
function SearchPage() {
  const { data: spirits } = useQuery(
    convexQuery(api.spirits.listAllSpirits, {}),
  );
  const { data: openings } = useQuery(convexQuery(api.openings.listAll, {}));

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useSearch(spirits, openings, debouncedQuery);

  const hasResults = results.spirits.length > 0 || results.openings.length > 0;
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Search" />

      <main className="p-4 space-y-6">
        {/* Search input */}
        <div className="sticky top-[57px] bg-background/95 backdrop-blur z-10 pb-4 -mt-4 pt-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search spirits and openings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>
        </div>

        {/* Results */}
        {hasQuery && hasResults && (
          <div className="space-y-6">
            {/* Spirits section */}
            {results.spirits.length > 0 && (
              <section className="space-y-3">
                <Heading variant="h3">
                  Spirits ({results.spirits.length})
                </Heading>
                {results.spirits.map((spirit) => (
                  <Link
                    key={spirit._id}
                    to="/spirits/$slug"
                    params={{ slug: spirit.slug }}
                    className="block border border-border rounded-lg p-3 hover:bg-muted/30"
                  >
                    <Text className="font-medium">
                      {spirit.name}
                      {spirit.aspectName && ` (${spirit.aspectName})`}
                    </Text>
                    <Text variant="muted" className="text-sm truncate">
                      {spirit.summary}
                    </Text>
                  </Link>
                ))}
              </section>
            )}

            {/* Openings section */}
            {results.openings.length > 0 && (
              <section className="space-y-3">
                <Heading variant="h3">
                  Openings ({results.openings.length})
                </Heading>
                {results.openings.map((opening) => (
                  <Link
                    key={opening._id}
                    to="/spirits/$slug"
                    params={{ slug: opening.spiritSlug || "" }}
                    className="block border border-border rounded-lg p-3 hover:bg-muted/30"
                  >
                    <Text className="font-medium">{opening.name}</Text>
                    <Text variant="muted" className="text-sm">
                      {opening.spiritName}
                    </Text>
                    {opening.difficulty && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {opening.difficulty}
                      </Badge>
                    )}
                  </Link>
                ))}
              </section>
            )}
          </div>
        )}

        {/* Empty state - no results */}
        {hasQuery && !hasResults && (
          <div className="text-center py-8">
            <Text variant="muted">No results found for "{query}"</Text>
          </div>
        )}

        {/* Initial state - no query */}
        {!hasQuery && (
          <div className="text-center py-8">
            <Text variant="muted">
              Enter a search term to find spirits and openings.
            </Text>
          </div>
        )}
      </main>
    </div>
  );
}
