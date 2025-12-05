import { File, Paths } from "expo-file-system/next";
import type { RecentCall } from "../types/recents";

const recentCallsFile = new File(Paths.document, "recentCalls.json");

async function readRecentCallsFile(): Promise<RecentCall[]> {
    try {
        if (!recentCallsFile.exists) {
            return [];
        }

        const raw = recentCallsFile.text();
        const text = await raw;

        if (!text) return [];

        const parsed = JSON.parse(text) as RecentCall[];
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch (e) {
        console.warn("Failed to read recentCalls.json", e);
        return [];
    }
}

async function writeRecentCallsFile(calls: RecentCall[]): Promise<void> {
    try {
        await recentCallsFile.write(JSON.stringify(calls));
    } catch (e) {
        console.warn("Failed to write recentCalls.json", e);
    }
}

/**
 * Load all recent calls from storage.
 */
export async function getRecentCalls(): Promise<RecentCall[]> {
    return readRecentCallsFile();
}

/**
 * Append a new recent call to the log.
 * Optionally cap the list length (e.g., keep last 100 entries).
 */
export async function appendRecentCall(call: RecentCall): Promise<void> {
    const existing = await readRecentCallsFile();

    const updated = [
        {
            ...call,
        },
        ...existing, // newest first
    ].slice(0, 100); // keep last 100 calls

    await writeRecentCallsFile(updated);
}

/**
 * Clear all recents (optional, for a "Clear" button)
 */
export async function clearRecentCalls(): Promise<void> {
    await writeRecentCallsFile([]);
}