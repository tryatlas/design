/**
 * Initials for an avatar fallback.
 *
 * First letter of the first and last word, so "Adib Mohsin" is AM and
 * "Azraf Al Monzim" is AM too — not AZ, which is what slicing the first two
 * characters gives you. An invited member has no name yet, so the email's
 * local part stands in.
 */
export declare function initialsOf(name: string, email?: string): string;
//# sourceMappingURL=initials.d.ts.map