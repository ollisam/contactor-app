export type Contact = {
    id: string;
    name: string;
    phoneNumbers: string[];
    emails: string[];
};

export type ContactsPermissionStatus =
    | 'undetermined'
    | 'granted'
    | 'denied'
    | 'blocked';