import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

/**
 * Determines if a given hex color is "dark" (for contrast purposes)
 * Supports 3 or 6 digit hex strings, with or without leading '#'
 * Returns true if color is dark, false otherwise
 */
export function isDarkColor(hex: string): boolean {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  }
  if (c.length !== 6) return false // fallback: treat as not dark
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a monetary value with the specified currency
 * @param amount The amount in the smallest currency unit (e.g., cents)
 * @param currency The ISO currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | null, currency: string = 'USD'): string {
  if (amount === null) return 'N/A'

  // Convert from smallest currency unit (e.g., cents) to standard unit (e.g., dollars)
  const value = amount / 100

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export const fetcher = <T>(url: string, token: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data as T)
