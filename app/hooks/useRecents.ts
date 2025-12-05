import { useCallback, useEffect, useState } from "react";
import type { RecentCall } from "../types/recents";
import { appendRecentCall, getRecentCalls, clearRecentCalls } from "../services/recentCallsService";

type UseRecentsResult = {
    recentCalls: RecentCall[];
    isLoading: boolean;
    error: string | null;
    reloadRecents: () => Promise<void>;
    logCall: (call: RecentCall) => Promise<void>;
    clearAllRecents: () => Promise<void>;
};

export function useRecents(): UseRecentsResult {
    const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reloadRecents = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const loaded = await getRecentCalls();
            setRecentCalls(loaded);
        } catch (e) {
            setError('Failed to load recent calls.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logCall = useCallback(
        async (call: RecentCall) => {
            try {
                await appendRecentCall(call);
                // optionally keep state in sync:
                setRecentCalls((prev) => [...prev, call]);
            } catch (e) {
                console.warn('Failed to log call', e);
            }
        },
        []
    );

    const clearAllRecents = useCallback(async () => {
        try {
            await clearRecentCalls();
            setRecentCalls([]);
        } catch (e) {
            console.warn("Failed to clear recent calls", e);
        }
    }, []);

    useEffect(() => {
        void reloadRecents();
    }, [reloadRecents]);

    return {
        recentCalls,
        isLoading,
        error,
        reloadRecents,
        logCall,
        clearAllRecents,
    };
}