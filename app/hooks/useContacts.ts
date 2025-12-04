import { useCallback, useEffect, useState } from 'react';
import type { Contact, ContactsPermissionStatus } from '../types/contacts';
import {
    fetchContactsFromOS,
    getContactsPermissionStatus,
    requestContactsPermission,
} from '../services/contactsService';
import { File, Paths } from "expo-file-system/next";

const contactsFile = new File(Paths.document, "contacts.json");

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
            // 1) OS contacts (what you already had)
            const osContacts = await fetchContactsFromOS();

            // 2) Custom contacts from contacts.json (created in addContact)
            let fileContacts: Contact[] = [];

            if (contactsFile.exists) {
                try {
                    const raw = contactsFile.text(); // sync read, small file
                    if (raw) {
                        const parsed = JSON.parse(await raw) as {
                            firstName: string;
                            lastName: string;
                            phone: string;
                        }[];

                        fileContacts = parsed.map((c, index): Contact => ({
                            // 🔁 adjust to your Contact type fields:
                            id: `custom-${index}`,
                            name: `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Unnamed',
                            phoneNumbers: c.phone ?? '',
                        }));
                    }
                } catch (e) {
                    console.warn('Failed to read contacts.json', e);
                }
            }

            // 3) Merge OS + file contacts
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