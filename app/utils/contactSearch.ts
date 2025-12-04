import type { Contact } from "../types/contacts";

export function contactMatchesQuery(contact: Contact, query: string) {
    if (!query) return true;

    const q = query.toLowerCase();
    const name = contact.name.toLowerCase();

    const phones = (Array.isArray(contact.phoneNumbers) ? contact.phoneNumbers : [])
        .map((p: any) => (typeof p === "string" ? p : p.number ?? ""))
        .join(" ")
        .toLowerCase();

    return name.includes(q) || phones.includes(q);
}