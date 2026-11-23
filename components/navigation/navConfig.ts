/**
 * Navigation item configuration interface
 */
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isButton?: boolean;
  readonly isPrimary?: boolean;
}

/**
 * Centralized Navigation Configuration for TEDx Chennai Institute of Technology.
 * 
 * Order strictly maintained as per event specification:
 * 1. HOME (/)
 * 2. SPEAKERS (/speakers)
 * 3. APPLY TO SPEAK (/apply-to-speak) - Outlined CTA Button
 * 4. PARTNER WITH US (/partner-with-us) - Outlined CTA Button
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'SPEAKERS', href: '/speakers' },
  { label: 'APPLY TO SPEAK', href: '/apply/anonymous-voices', isButton: true },
  { label: 'PARTNER WITH US', href: '/partner-with-us', isButton: true },
] as const;
