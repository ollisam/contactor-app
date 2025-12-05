import * as Contacts from 'expo-contacts';
import type {
    Contact as AppContact,
    ContactsPermissionStatus
} from '../types/contacts';

type NativePermissionStatus = 'undetermined' | 'granted' | 'denied';

function mapNativeToAppPermissionStatus(
    status: NativePermissionStatus,
    canAskAgain: boolean | undefined
): ContactsPermissionStatus {
    if (status === 'granted') {
        return 'granted';
    }

    if (status === 'undetermined') {
        return 'undetermined';
    }

    // status === 'denied'
    // If we can't ask again, treat as "blocked"
    if (!canAskAgain) {
        return 'blocked';
    }

    return 'denied';
}

/**
 * Get current contacts permission status without prompting the user.
 */
export async function getContactsPermissionStatus(): Promise<ContactsPermissionStatus> {
    try {
        const response = await Contacts.getPermissionsAsync();
        const nativeStatus = response.status as NativePermissionStatus;
        return mapNativeToAppPermissionStatus(nativeStatus, response.canAskAgain);
    } catch (error) {
        // If something goes very wrong, treat it as denied.
        return 'denied';
    }
}

/**
 * Ask the user for contacts permission.
 */
export async function requestContactsPermission(): Promise<ContactsPermissionStatus> {
    try {
        const response = await Contacts.requestPermissionsAsync();
        const nativeStatus = response.status as NativePermissionStatus;
        return mapNativeToAppPermissionStatus(nativeStatus, response.canAskAgain);
    } catch (error) {
        // If request fails, treat as denied.
        return 'denied';
    }
}

/**
 * Transform the OS-level contact (expo-contacts) into our clean Contact type.
 */
export function transformOsContactToContact(
    osContact: Contacts.ExistingContact
): AppContact {
    const fullName =
        osContact.name ||
        [osContact.firstName, osContact.lastName].filter(Boolean).join(' ') ||
        'Unnamed';

    const phoneNumbers =
        osContact.phoneNumbers?.find((p) => p?.number)?.number ?? "";

    return {
        id: osContact.id,
        uuid: osContact.id,
        name: fullName,
        phoneNumbers: phoneNumbers,
        avatar: osContact.image?.uri ?? null,
        isCustom: false
    };
}

/**
 * Fetch contacts from the OS and map them into our Contact type.
 */
export async function fetchContactsFromOS(): Promise<AppContact[]> {
    try {
        const { data } = await Contacts.getContactsAsync({
            fields: [
                Contacts.Fields.Name,
                Contacts.Fields.FirstName,
                Contacts.Fields.LastName,
                Contacts.Fields.PhoneNumbers,
                Contacts.Fields.Emails,
                Contacts.Fields.Image,
            ],
            sort: Contacts.SortTypes.FirstName,
        });

        if (!data || data.length === 0) {
            return [];
        }

        return data.map(transformOsContactToContact);
    } catch (error) {
        // Re-throw so the caller can handle nicely.
        throw new Error('Failed to fetch contacts from OS');
    }
}