import type { Contact } from "../types/contacts";

const ICELANDIC_ALPHABET = [
    "A", "Á", "B", "D", "Ð", "E", "É", "F", "G", "H",
    "I", "Í", "J", "K", "L", "M", "N", "O", "Ó", "P",
    "R", "S", "T", "U", "Ú", "V", "X", "Y", "Ý", "Þ",
    "Æ", "Ö",
];

export function groupContacts(contacts: Contact[]) {
    const sorted = [...contacts].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const groups: Record<string, Contact[]> = {};

    for (const contact of sorted) {
        const firstChar = contact.name.charAt(0).toUpperCase();
        const letter = ICELANDIC_ALPHABET.includes(firstChar) ? firstChar : "#";

        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(contact);
    }

    return Object.keys(groups)
        .sort((a, b) => {
            const indexA = ICELANDIC_ALPHABET.indexOf(a);
            const indexB = ICELANDIC_ALPHABET.indexOf(b);

            // If either letter isn't in alphabet (e.g. "#"), push it to bottom
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        })
        .map((letter) => ({
            title: letter,
            data: groups[letter],
        }));
}