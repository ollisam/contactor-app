import { useCallback, useEffect, useState } from 'react';
import type { Contact, ContactsPermissionStatus } from '../types/contacts';
import {
    fetchContactsFromOS,
    getContactsPermissionStatus,
    requestContactsPermission,
} from '../services/contactsService';

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
            const result = await fetchContactsFromOS();
            setContacts(result);
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