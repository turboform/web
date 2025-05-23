'use server'

import { cache } from 'react'
import axios from 'axios'

export type FormData = {
  id: string
  short_id: string
  title: string
  description: string
  schema: any[]
  created_at: string
  user_id: string
  expires_at?: string
  is_public?: boolean
  is_draft?: boolean
  primaryColor?: string
  secondaryColor?: string
  logoUrl?: string
}

// Use cache to prevent redundant fetches during server rendering cycle
export const getFormById = cache(async (formId: string): Promise<FormData | null> => {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/form/by-id/${formId}`)

    if (!response.data || !response.data.form) {
      console.error('Error fetching form: No data returned')
      return null
    }

    return response.data.form as FormData
  } catch (error) {
    console.error('Error in getFormById:', error)
    return null
  }
})

// Get form by short ID
export const getFormByShortId = cache(async (shortId: string): Promise<FormData | null> => {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/form/by-short-id/${shortId}`)

    if (!response.data || !response.data.form) {
      console.error('Error fetching form by short ID: No data returned')
      return null
    }

    return response.data.form as FormData
  } catch (error) {
    console.error('Error in getFormByShortId:', error)
    return null
  }
})
