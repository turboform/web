import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

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
