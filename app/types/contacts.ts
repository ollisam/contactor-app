export type Contact = {
    id: string;
    name: string;
    phoneNumbers: string[];
    emails: string[];
    avatar?: string | null;
};

export type ContactsPermissionStatus =
    | 'undetermined'
    | 'granted'
    | 'denied'
    | 'blocked';