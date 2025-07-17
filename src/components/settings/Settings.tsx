import { useState } from 'react'
import { 
  User, 
  Building, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  Database,
  Truck,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

const mockUsers = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@easytruck.com', role: 'manager', status: 'active' },
  { id: '2', name: 'Fatima Al-Zahra', email: 'fatima@easytruck.com', role: 'picker', status: 'active' },
  { id: '3', name: 'Omar Khalil', email: 'omar@easytruck.com', role: 'controller', status: 'active' },
  { id: '4', name: 'Layla Mansour', email: 'layla@easytruck.com', role: 'picker', status: 'inactive' },
]

const mockCarriers = [
  { id: '1', name: 'Aramex', status: 'connected', apiKey: '••••••••••••1234' },
  { id: '2', name: 'Fetchr', status: 'connected', apiKey: '••••••••••••5678' },
  { id: '3', name: 'DHL', status: 'disconnected', apiKey: '' },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isCarrierDialogOpen, setIsCarrierDialogOpen] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      name: 'EasyTruck Warehouse',
      email: 'admin@easytruck.com',
      phone: '+971 50 123 4567',
      address: 'Dubai Logistics City, UAE',
      timezone: 'Asia/Dubai',
      language: 'en'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      lowStockAlerts: true,
      orderAlerts: true,
      systemAlerts: true,
      dailyReports: true
    },
    warehouse: {
      name: 'Main Warehouse',
      zones: 4,
      aisles: 12,
      racks: 48,
      bins: 576,
      workingHours: '08:00-18:00',
      currency: 'AED'
    },
    system: {
      theme: 'light',
      autoBackup: true,
      backupFrequency: 'daily',
      sessionTimeout: 30,
      twoFactorAuth: false
    }
  })

  const handleSaveSettings = () => {
    // In real implementation, save to backend
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      case 'picker':
        return 'bg-blue-100 text-blue-800'
      case 'controller':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' || status === 'connected' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your warehouse system configuration</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Company Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.profile.timezone}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, timezone: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                      <SelectItem value="Africa/Cairo">Africa/Cairo (GMT+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={settings.profile.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, address: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="language">Default Language</Label>
                <Select 
                  value={settings.profile.language}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, language: value }
                  })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouse Tab */}
        <TabsContent value="warehouse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Warehouse Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse-name">Warehouse Name</Label>
                  <Input 
                    id="warehouse-name" 
                    value={settings.warehouse.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.warehouse.currency}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, currency: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zones">Number of Zones</Label>
                  <Input 
                    id="zones" 
                    type="number"
                    value={settings.warehouse.zones}
                    onChange={(e) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, zones: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="aisles">Aisles per Zone</Label>
                  <Input 
                    id="aisles" 
                    type="number"
                    value={settings.warehouse.aisles}
                    onChange={(e) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, aisles: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="racks">Racks per Aisle</Label>
                  <Input 
                    id="racks" 
                    type="number"
                    value={settings.warehouse.racks}
                    onChange={(e) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, racks: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bins">Bins per Rack</Label>
                  <Input 
                    id="bins" 
                    type="number"
                    value={settings.warehouse.bins}
                    onChange={(e) => setSettings({
                      ...settings,
                      warehouse: { ...settings.warehouse, bins: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="working-hours">Working Hours</Label>
                <Input 
                  id="working-hours" 
                  value={settings.warehouse.workingHours}
                  onChange={(e) => setSettings({
                    ...settings,
                    warehouse: { ...settings.warehouse, workingHours: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
                <Button onClick={() => setIsUserDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Carriers</span>
                </CardTitle>
                <Button onClick={() => setIsCarrierDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Carrier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCarriers.map((carrier) => (
                  <div key={carrier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{carrier.name}</h3>
                        <p className="text-sm text-gray-500">
                          API Key: {carrier.apiKey || 'Not configured'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(carrier.status)}>
                        {carrier.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>E-commerce Platforms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Shopify</h3>
                      <p className="text-sm text-gray-500">Connect your Shopify store</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold">M</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Magento</h3>
                      <p className="text-sm text-gray-500">Connect your Magento store</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <Switch 
                    id="email-alerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailAlerts: checked }
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                  </div>
                  <Switch 
                    id="sms-alerts"
                    checked={settings.notifications.smsAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsAlerts: checked }
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-stock">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-500">Alert when inventory is low</p>
                  </div>
                  <Switch 
                    id="low-stock"
                    checked={settings.notifications.lowStockAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, lowStockAlerts: checked }
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-alerts">Order Alerts</Label>
                    <p className="text-sm text-gray-500">Alert for new orders and updates</p>
                  </div>
                  <Switch 
                    id="order-alerts"
                    checked={settings.notifications.orderAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, orderAlerts: checked }
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reports">Daily Reports</Label>
                    <p className="text-sm text-gray-500">Receive daily performance reports</p>
                  </div>
                  <Switch 
                    id="daily-reports"
                    checked={settings.notifications.dailyReports}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, dailyReports: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>System Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={settings.system.theme}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      system: { ...settings.system, theme: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number"
                    value={settings.system.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <p className="text-sm text-gray-500">Enable automatic data backup</p>
                  </div>
                  <Switch 
                    id="auto-backup"
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      system: { ...settings.system, autoBackup: checked }
                    })}
                  />
                </div>
                
                {settings.system.autoBackup && (
                  <div>
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select 
                      value={settings.system.backupFrequency}
                      onValueChange={(value) => setSettings({
                        ...settings,
                        system: { ...settings.system, backupFrequency: value }
                      })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add extra security to your account</p>
                  </div>
                  <Switch 
                    id="two-factor"
                    checked={settings.system.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      system: { ...settings.system, twoFactorAuth: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name">Full Name</Label>
              <Input id="user-name" placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" placeholder="Enter email address" />
            </div>
            <div>
              <Label htmlFor="user-role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="picker">Picker</SelectItem>
                  <SelectItem value="controller">Controller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsUserDialogOpen(false)}>
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Carrier Dialog */}
      <Dialog open={isCarrierDialogOpen} onOpenChange={setIsCarrierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shipping Carrier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="carrier-name">Carrier Name</Label>
              <Input id="carrier-name" placeholder="Enter carrier name" />
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input 
                  id="api-key" 
                  type={showApiKey === 'new' ? 'text' : 'password'}
                  placeholder="Enter API key" 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(showApiKey === 'new' ? null : 'new')}
                >
                  {showApiKey === 'new' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="api-url">API URL</Label>
              <Input id="api-url" placeholder="Enter API endpoint URL" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCarrierDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCarrierDialogOpen(false)}>
                Add Carrier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}