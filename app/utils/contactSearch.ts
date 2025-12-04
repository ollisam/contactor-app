import type { Contact } from "../types/contacts";

export function contactMatchesQuery(contact: Contact, query: string) {
    if (!query) return true;

    const q = query.toLowerCase();
    const name = contact.name.toLowerCase();

    const phones = contact.phoneNumbers.join(" ").toLowerCase();

    return name.includes(q) || phones.includes(q);
}