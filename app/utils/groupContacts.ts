import type { Contact } from "../types/contacts";

export function groupContacts(contacts: Contact[]) {
    const sorted = [...contacts].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const groups: Record<string, Contact[]> = {};

    for (const contact of sorted) {
        const firstChar = contact.name.charAt(0).toUpperCase();
        const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";

        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(contact);
    }

    return Object.keys(groups)
        .sort()
        .map((letter) => ({
            title: letter,
            data: groups[letter],
        }));
}