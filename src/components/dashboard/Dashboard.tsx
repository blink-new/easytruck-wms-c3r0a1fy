import { useState, useEffect } from 'react'
import { 
  Package, 
  Truck, 
  ArrowDownToLine, 
  DollarSign, 
  Target, 
  Clock,
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react'
import { MetricCard } from './MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data for demonstration
const mockMetrics = {
  orders_to_pick: 24,
  orders_to_ship: 12,
  receiving_volume: 156,
  inventory_value: 245000,
  picker_accuracy: 98.5,
  fulfillment_time: 2.3
}

const mockChartData = [
  { name: 'Mon', orders: 45, accuracy: 97 },
  { name: 'Tue', orders: 52, accuracy: 98 },
  { name: 'Wed', orders: 38, accuracy: 96 },
  { name: 'Thu', orders: 61, accuracy: 99 },
  { name: 'Fri', orders: 55, accuracy: 98 },
  { name: 'Sat', orders: 42, accuracy: 97 },
  { name: 'Sun', orders: 28, accuracy: 99 },
]

const mockRecentOrders = [
  { id: 'ORD-001', customer: 'Ahmed Electronics', status: 'picking', priority: 'high', items: 5 },
  { id: 'ORD-002', customer: 'Fatima Trading', status: 'packing', priority: 'medium', items: 3 },
  { id: 'ORD-003', customer: 'Omar Supplies', status: 'pending', priority: 'low', items: 8 },
  { id: 'ORD-004', customer: 'Layla Store', status: 'shipped', priority: 'high', items: 2 },
]

const mockAlerts = [
  { id: 1, type: 'warning', message: 'Low stock alert: Product SKU-12345', time: '5 min ago' },
  { id: 2, type: 'info', message: 'New shipment received from Supplier ABC', time: '15 min ago' },
  { id: 3, type: 'error', message: 'Picking error reported for Order ORD-001', time: '1 hour ago' },
]

export function Dashboard() {
  const [metrics, setMetrics] = useState(mockMetrics)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your warehouse today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            System Online
          </Badge>
          <Button variant="outline" size="sm">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard
          title="Orders to Pick"
          value={metrics.orders_to_pick}
          icon={Package}
          color="blue"
          change={{ value: 12, type: 'increase' }}
          subtitle="vs yesterday"
        />
        <MetricCard
          title="Orders to Ship"
          value={metrics.orders_to_ship}
          icon={Truck}
          color="green"
          change={{ value: 8, type: 'decrease' }}
          subtitle="ready for dispatch"
        />
        <MetricCard
          title="Receiving Volume"
          value={metrics.receiving_volume}
          icon={ArrowDownToLine}
          color="yellow"
          subtitle="items today"
        />
        <MetricCard
          title="Inventory Value"
          value={`$${(metrics.inventory_value / 1000).toFixed(0)}K`}
          icon={DollarSign}
          color="purple"
          change={{ value: 5, type: 'increase' }}
          subtitle="total value"
        />
        <MetricCard
          title="Picker Accuracy"
          value={`${metrics.picker_accuracy}%`}
          icon={Target}
          color="green"
          change={{ value: 2, type: 'increase' }}
          subtitle="this week"
        />
        <MetricCard
          title="Avg Fulfillment"
          value={`${metrics.fulfillment_time}h`}
          icon={Clock}
          color="blue"
          change={{ value: 15, type: 'decrease' }}
          subtitle="order to ship"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Order Volume Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={{ fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Picker Accuracy Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Picker Accuracy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={order.status === 'shipped' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                    <Badge 
                      variant={order.priority === 'high' ? 'destructive' : order.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{order.items} items</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' : 
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Warehouse Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Utilization</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Staff Productivity</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Order Accuracy</span>
                <span>98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}