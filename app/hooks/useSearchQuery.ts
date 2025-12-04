import { useState, useMemo } from "react";

export function useSearchQuery(initialValue = "") {
    const [query, setQuery] = useState(initialValue);

    const normalizedQuery = useMemo(
        () => query.trim().toLowerCase(),
        [query]
    );

    return {
        query,
        setQuery,
        normalizedQuery,
    };
}