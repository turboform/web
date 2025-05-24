'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Palette, Upload, Trash2, Loader2 } from 'lucide-react'
import { uploadLogo } from '@/lib/supabase/storage'
import { Form } from '@/lib/types/form'
import Image from 'next/image'
import { toast } from 'sonner'

interface FormCustomizationProps {
  form: Form
  userId: string
  onFormChange: (updatedForm: Form) => void
}

export function FormCustomization({ form, userId, onFormChange }: FormCustomizationProps) {
  const [uploading, setUploading] = useState(false)

  const handlePrimaryColorChange = (color: string) => {
    onFormChange({ ...form, primary_color: color })
  }

  const handleSecondaryColorChange = (color: string) => {
    onFormChange({ ...form, secondary_color: color })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }

      const logoUrl = await uploadLogo(file, userId, form.id)

      onFormChange({ ...form, logo_url: logoUrl })
      toast.success('Logo uploaded successfully')
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Failed to upload logo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    onFormChange({ ...form, logo_url: undefined })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Palette className="mr-2 h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Form Customization</CardTitle>
        </div>
        <CardDescription>Customize your form with colors and a logo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: form.primary_color || '#000000' }}
                />
                <Input
                  id="primaryColor"
                  type="color"
                  value={form.primary_color || '#000000'}
                  onChange={(e) => handlePrimaryColorChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded-md border"
                  style={{ backgroundColor: form.secondary_color || '#000000' }}
                />
                <Input
                  id="secondaryColor"
                  type="color"
                  value={form.secondary_color || '#000000'}
                  onChange={(e) => handleSecondaryColorChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            {form.logo_url ? (
              <div className="flex flex-col gap-4">
                <div className="relative h-40 w-full border rounded-md overflow-hidden">
                  <Image src={form.logo_url} alt="Company Logo" fill style={{ objectFit: 'contain' }} />
                </div>
                <Button variant="destructive" size="sm" onClick={handleRemoveLogo} className="w-fit">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Logo
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="logo-upload"
                  className="h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload a logo'}</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max 2MB)</span>
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            )}
            {uploading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
