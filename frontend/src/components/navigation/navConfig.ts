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
 * 3. PARTNER WITH US (/partner-with-us) - Outlined CTA Button
 * 4. REGISTER NOW (/register) - Outlined CTA Button
 * 5. APPLY TO SPEAK (/apply/anonymous-voices) - Filled Primary CTA Button in right-side corner
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'SPEAKERS', href: '/speakers' },
  { label: 'PARTNER WITH US', href: '/partner-with-us', isButton: true },
  { label: 'REGISTER NOW', href: '/register', isButton: true },
  { label: 'APPLY TO SPEAK', href: '/apply/anonymous-voices', isButton: true, isPrimary: true },
] as const;
