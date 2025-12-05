import { useCallback, useEffect, useState } from 'react';
import type { Contact, ContactsPermissionStatus } from '../types/contacts';
import {
    fetchContactsFromOS,
    getContactsPermissionStatus,
    requestContactsPermission,
} from '../services/contactsService';
import { File, Paths, Directory } from "expo-file-system/next";

type UseContactsResult = {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    permissionStatus: ContactsPermissionStatus;
    requestPermission: () => Promise<void>;
    reloadContacts: () => Promise<void>;
};

export function useContacts(): UseContactsResult {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [permissionStatus, setPermissionStatus] =
        useState<ContactsPermissionStatus>('undetermined');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize permission status on mount
    useEffect(() => {
        const initPermissionStatus = async () => {
            try {
                const status = await getContactsPermissionStatus();
                setPermissionStatus(status);
            } catch (err) {
                setError('Failed to read contacts permission status.');
            }
        };

        void initPermissionStatus();
    }, []);

    const requestPermission = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const status = await requestContactsPermission();
            setPermissionStatus(status);

            if (status === 'denied' || status === 'blocked') {
                setError(
                    'Contacts permission was denied. You can enable it from system settings.'
                );
            }
        } catch (err) {
            setError('Failed to request contacts permission.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reloadContacts = useCallback(async () => {
        setError(null);

        // Always double-check status with the OS
        let status = permissionStatus;
        if (status !== 'granted') {
            try {
                status = await getContactsPermissionStatus();
                setPermissionStatus(status);
            } catch {
                setError('Failed to read contacts permission status.');
                return;
            }
        }

        if (status !== 'granted') {
            setContacts([]);
            setError('Contacts permission is not granted.');
            return;
        }

        setIsLoading(true);

        try {
            // OS contacts
            const osContacts = await fetchContactsFromOS();
            // Custom contacts from per-contact JSON files:
            // Each file is saved as <name-of-contact>-<uuid>.json
            // with content: { name, phoneNumber, photo }
            let fileContacts: Contact[] = [];

            try {
                const docsDir = new Directory(Paths.document);
                const entries = await docsDir.list();

                for (const entry of entries) {
                    // We only care about JSON files that follow the <name>-<uuid>.json pattern.
                    if (!entry.name.endsWith('.json')) continue;
                    if (!entry.name.includes('-')) continue;

                    const file = new File(Paths.document, entry.name);
                    const raw = file.text();
                    if (!raw) continue;

                    try {
                        const parsed = JSON.parse(await raw) as {
                            name?: string;
                            phoneNumber?: string;
                            photo?: string | null;
                        };

                        const name =
                            (parsed.name ?? '').trim() !== ''
                                ? (parsed.name as string)
                                : 'Unnamed';

                        const withoutExt = entry.name.replace(/\.json$/i, '');
                        const lastDashIndex = withoutExt.lastIndexOf('-');
                        const uuid =
                            lastDashIndex !== -1
                                ? withoutExt.slice(lastDashIndex + 1)
                                : withoutExt;

                        fileContacts.push({
                            id: entry.name,
                            uuid,
                            name,
                            phoneNumbers: parsed.phoneNumber ?? '',
                            avatar: parsed.photo ?? null,
                            isCustom: true,
                        });
                    } catch (e) {
                        console.warn('Failed to parse contact file', entry.name, e);
                    }
                }
            } catch (e) {
                console.warn('Failed to read custom contacts from file system', e);
            }

            // Merge OS + file contacts
            setContacts([...osContacts, ...fileContacts]);

        } catch (err) {
            setError('Failed to load contacts.');
        } finally {
            setIsLoading(false);
        }
    }, [permissionStatus]);

    return {
        contacts,
        isLoading,
        error,
        permissionStatus,
        requestPermission,
        reloadContacts,
    };
}