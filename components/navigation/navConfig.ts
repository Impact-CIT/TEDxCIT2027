/**
 * Navigation item configuration interface
 */
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isButton?: boolean;
}

/**
 * Centralized Navigation Configuration for TEDx Chennai Institute of Technology.
 * 
 * Order strictly maintained as per event specification:
 * 1. HOME (/)
 * 2. SPEAKERS (/speakers)
 * 3. MEET OUR TEAM (/team)
 * 4. APPLY TO SPEAK (/apply-to-speak) - Outlined CTA Button
 * 5. PARTNER WITH US (/partner-with-us) - Outlined CTA Button
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'SPEAKERS', href: '/speakers' },
  { label: 'MEET OUR TEAM', href: '/team' },
  { label: 'APPLY TO SPEAK', href: '/apply-to-speak', isButton: true },
  { label: 'PARTNER WITH US', href: '/partner-with-us', isButton: true },
] as const;
