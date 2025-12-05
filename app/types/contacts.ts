export type Contact = {
    id: string;
    uuid: string;
    name: string;
    phoneNumbers: string;
    avatar?: string | null;
    isCustom?: boolean;
};

export type ContactsPermissionStatus =
    | 'undetermined'
    | 'granted'
    | 'denied'
    | 'blocked';