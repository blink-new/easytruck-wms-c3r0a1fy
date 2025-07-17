import { useState, useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { InventoryManagement } from './components/inventory/InventoryManagement'
import { MobileScannerInterface } from './components/mobile/MobileScannerInterface'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">ET</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">EasyTruck WMS</h2>
          <p className="text-gray-600">Loading your warehouse...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">ET</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EasyTruck WMS</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your warehouse management system</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'inventory':
        return <InventoryManagement />
      case 'inbound':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Inbound Operations</h1>
            <p className="text-gray-600">Inbound operations features coming soon...</p>
          </div>
        )
      case 'outbound':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Outbound Operations</h1>
            <p className="text-gray-600">Outbound operations features coming soon...</p>
          </div>
        )
      case 'mobile':
        return <MobileScannerInterface />
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
            <p className="text-gray-600">Reports and analytics features coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-gray-600">Settings features coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          user={user}
          onLanguageToggle={handleLanguageToggle}
          language={language}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}

export default App