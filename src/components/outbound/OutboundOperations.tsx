import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Printer,
  Route
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Order, OrderItem } from '@/types'

const mockOrders: Order[] = [
  {
    id: 'ord-001',
    order_number: 'ORD-2024-001',
    customer_name: 'Ahmed Electronics',
    status: 'pending',
    priority: 'high',
    created_at: '2024-01-17T10:00:00Z',
    items: [
      { id: 'oi-001', order_id: 'ord-001', product_id: 'prod-001', quantity: 2, picked_quantity: 0 },
      { id: 'oi-002', order_id: 'ord-001', product_id: 'prod-002', quantity: 1, picked_quantity: 0 }
    ]
  },
  {
    id: 'ord-002',
    order_number: 'ORD-2024-002',
    customer_name: 'Fatima Trading',
    status: 'picking',
    priority: 'medium',
    created_at: '2024-01-17T09:30:00Z',
    items: [
      { id: 'oi-003', order_id: 'ord-002', product_id: 'prod-003', quantity: 5, picked_quantity: 3 },
      { id: 'oi-004', order_id: 'ord-002', product_id: 'prod-004', quantity: 2, picked_quantity: 2 }
    ]
  },
  {
    id: 'ord-003',
    order_number: 'ORD-2024-003',
    customer_name: 'Omar Supplies',
    status: 'packing',
    priority: 'low',
    created_at: '2024-01-17T08:15:00Z',
    items: [
      { id: 'oi-005', order_id: 'ord-003', product_id: 'prod-005', quantity: 3, picked_quantity: 3 }
    ]
  },
  {
    id: 'ord-004',
    order_number: 'ORD-2024-004',
    customer_name: 'Layla Store',
    status: 'shipped',
    priority: 'high',
    created_at: '2024-01-16T16:45:00Z',
    items: [
      { id: 'oi-006', order_id: 'ord-004', product_id: 'prod-006', quantity: 1, picked_quantity: 1 }
    ]
  }
]

const mockPickingRoutes = [
  { zone: 'A', aisle: '01', rack: '02', bin: '03', product: 'Laptop Stand', quantity: 2 },
  { zone: 'A', aisle: '03', rack: '01', bin: '05', product: 'USB Cable', quantity: 1 },
  { zone: 'B', aisle: '02', rack: '04', bin: '01', product: 'Keyboard', quantity: 1 }
]

export function OutboundOperations() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPickingDialogOpen, setIsPickingDialogOpen] = useState(false)
  const [isPackingDialogOpen, setIsPackingDialogOpen] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'picking':
        return <Package className="h-4 w-4" />
      case 'packing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'picking':
        return 'bg-blue-100 text-blue-800'
      case 'packing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateOrderProgress = (items: OrderItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const pickedQuantity = items.reduce((sum, item) => sum + item.picked_quantity, 0)
    return totalQuantity > 0 ? (pickedQuantity / totalQuantity) * 100 : 0
  }

  const getOrderStats = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      picking: orders.filter(o => o.status === 'picking').length,
      packing: orders.filter(o => o.status === 'packing').length,
      shipped: orders.filter(o => o.status === 'shipped').length
    }
  }

  const stats = getOrderStats()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outbound Operations</h1>
          <p className="text-gray-600">Manage order fulfillment, picking, packing, and shipping</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Route className="h-4 w-4 mr-2" />
            Optimize Routes
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Wave
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Being Picked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.picking}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Pack</p>
                <p className="text-2xl font-bold text-gray-900">{stats.packing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="picking">Picking</SelectItem>
                <SelectItem value="packing">Packing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={calculateOrderProgress(order.items)} className="w-16 h-2" />
                      <span className="text-sm text-gray-600">
                        {Math.round(calculateOrderProgress(order.items))}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsPickingDialogOpen(true)
                          }}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'packing' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsPackingDialogOpen(true)
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Picking Dialog */}
      <Dialog open={isPickingDialogOpen} onOpenChange={setIsPickingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Pick Order - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(selectedOrder.priority)}>
                    {selectedOrder.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              </div>

              {/* Optimized Pick Route */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Optimized Pick Route</h3>
                <div className="space-y-3">
                  {mockPickingRoutes.map((route, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            Zone {route.zone} - Aisle {route.aisle} - Rack {route.rack} - Bin {route.bin}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {route.product} × {route.quantity}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pick List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Items to Pick</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>Product {item.product_id}</TableCell>
                        <TableCell>
                          Zone {mockPickingRoutes[index]?.zone} - Aisle {mockPickingRoutes[index]?.aisle}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={item.picked_quantity === item.quantity ? 'default' : 'secondary'}>
                            {item.picked_quantity === item.quantity ? 'Picked' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPickingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsPickingDialogOpen(false)}>
                  Start Picking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Packing Dialog */}
      <Dialog open={isPackingDialogOpen} onOpenChange={setIsPackingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pack Order - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="verify" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="verify">Verify Items</TabsTrigger>
                <TabsTrigger value="pack">Pack & Label</TabsTrigger>
                <TabsTrigger value="ship">Ship</TabsTrigger>
              </TabsList>
              
              <TabsContent value="verify" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Verify Picked Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Picked</TableHead>
                        <TableHead>Verified</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>Product {item.product_id}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.picked_quantity}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Scan to Verify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pack" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Packaging Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Box Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select box size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (20x15x10 cm)</SelectItem>
                          <SelectItem value="medium">Medium (30x25x15 cm)</SelectItem>
                          <SelectItem value="large">Large (40x35x20 cm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input type="number" placeholder="0.0" step="0.1" />
                    </div>
                  </div>
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Printer className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Ready to Print Label</p>
                    <p className="text-gray-600">Click to generate shipping label</p>
                    <Button className="mt-4">
                      Generate Label
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ship" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Carrier</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aramex">Aramex</SelectItem>
                          <SelectItem value="fetchr">Fetchr</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Service Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="overnight">Overnight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Ready to Ship</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      All items verified and packaged. Tracking number will be generated upon dispatch.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPackingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPackingDialogOpen(false)}>
              Complete Packing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && !isPickingDialogOpen && !isPackingDialogOpen && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.order_number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm text-gray-900">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedOrder.priority)}>
                    {selectedOrder.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Created Date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Order Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Picked</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_id}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.picked_quantity}</TableCell>
                        <TableCell>
                          <Badge variant={
                            item.picked_quantity === item.quantity ? 'default' : 
                            item.picked_quantity > 0 ? 'secondary' : 'outline'
                          }>
                            {item.picked_quantity === item.quantity ? 'Complete' :
                             item.picked_quantity > 0 ? 'Partial' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}