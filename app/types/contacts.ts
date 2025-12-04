export type Contact = {
    id: string;
    name: string;
    phoneNumbers: string;
    avatar?: string | null;
    isCustom?: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
};

export type ContactsPermissionStatus =
    | 'undetermined'
    | 'granted'
    | 'denied'
    | 'blocked';