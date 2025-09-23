import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Placeholder: wire to your backend when available
      await new Promise(r => setTimeout(r, 600))
      toast.success('Settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 md:pr-20 md:ml-[320px] pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage site-wide configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Site Title</Label>
            <Input name="siteTitle" value={settings.siteTitle} onChange={handleChange} placeholder="TechBlog" />
          </div>
          <div>
            <Label>Site Description</Label>
            <Input name="siteDescription" value={settings.siteDescription} onChange={handleChange} placeholder="A modern tech blog" />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} placeholder="admin@techblog.com" />
          </div>
          <div>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminSettings


