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
  Edit,
  QrCode
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { blink } from '@/blink/client'
import { PurchaseOrder, POItem } from '@/types'

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    po_number: 'PO-2024-001',
    supplier: 'Tech Supplies Co.',
    status: 'pending',
    expected_date: '2024-01-20',
    created_at: '2024-01-15',
    items: [
      { id: 'poi-001', po_id: 'po-001', product_id: 'prod-001', expected_quantity: 100, received_quantity: 0 },
      { id: 'poi-002', po_id: 'po-001', product_id: 'prod-002', expected_quantity: 50, received_quantity: 0 }
    ]
  },
  {
    id: 'po-002',
    po_number: 'PO-2024-002',
    supplier: 'Office Equipment Ltd.',
    status: 'receiving',
    expected_date: '2024-01-18',
    created_at: '2024-01-12',
    items: [
      { id: 'poi-003', po_id: 'po-002', product_id: 'prod-003', expected_quantity: 25, received_quantity: 15 },
      { id: 'poi-004', po_id: 'po-002', product_id: 'prod-004', expected_quantity: 75, received_quantity: 75 }
    ]
  }
]

export function InboundOperations() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isReceivingDialogOpen, setIsReceivingDialogOpen] = useState(false)

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'receiving':
        return <Package className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'receiving':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateProgress = (items: POItem[]) => {
    const totalExpected = items.reduce((sum, item) => sum + item.expected_quantity, 0)
    const totalReceived = items.reduce((sum, item) => sum + item.received_quantity, 0)
    return totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbound Operations</h1>
          <p className="text-gray-600">Manage purchase orders, receiving, and put-away operations</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchaseOrders.filter(po => po.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Receiving</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchaseOrders.filter(po => po.status === 'receiving').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchaseOrders.filter(po => po.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Items Expected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchaseOrders.reduce((sum, po) => 
                    sum + po.items.reduce((itemSum, item) => itemSum + item.expected_quantity, 0), 0
                  )}
                </p>
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
                  placeholder="Search by PO number or supplier..."
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
                <SelectItem value="receiving">Receiving</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.po_number}</TableCell>
                  <TableCell>{po.supplier}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>
                      {getStatusIcon(po.status)}
                      <span className="ml-1 capitalize">{po.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(po.expected_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={calculateProgress(po.items)} className="w-16 h-2" />
                      <span className="text-sm text-gray-600">
                        {Math.round(calculateProgress(po.items))}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{po.items.length} items</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPO(po)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {po.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPO(po)
                            setIsReceivingDialogOpen(true)
                          }}
                        >
                          <QrCode className="h-4 w-4" />
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

      {/* Create Purchase Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="po-number">PO Number</Label>
                <Input id="po-number" placeholder="PO-2024-003" />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
            </div>
            <div>
              <Label htmlFor="expected-date">Expected Date</Label>
              <Input id="expected-date" type="date" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receiving Dialog */}
      <Dialog open={isReceivingDialogOpen} onOpenChange={setIsReceivingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Receive Items - {selectedPO?.po_number}</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Barcode Scan</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scan" className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">Ready to Scan</p>
                  <p className="text-gray-600">Scan product barcodes to receive items</p>
                  <Button className="mt-4">
                    Start Scanning
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Expected</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>Product {item.product_id}</TableCell>
                        <TableCell>{item.expected_quantity}</TableCell>
                        <TableCell>{item.received_quantity}</TableCell>
                        <TableCell>{item.expected_quantity - item.received_quantity}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            placeholder="Qty" 
                            className="w-20"
                            min="0"
                            max={item.expected_quantity - item.received_quantity}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsReceivingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsReceivingDialogOpen(false)}>
              Complete Receiving
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PO Details Dialog */}
      {selectedPO && !isReceivingDialogOpen && (
        <Dialog open={!!selectedPO} onOpenChange={() => setSelectedPO(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Purchase Order Details - {selectedPO.po_number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Supplier</Label>
                  <p className="text-sm text-gray-900">{selectedPO.supplier}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPO.status)}>
                    {getStatusIcon(selectedPO.status)}
                    <span className="ml-1 capitalize">{selectedPO.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label>Expected Date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedPO.expected_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Created Date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedPO.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <Label>Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Expected Qty</TableHead>
                      <TableHead>Received Qty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_id}</TableCell>
                        <TableCell>{item.expected_quantity}</TableCell>
                        <TableCell>{item.received_quantity}</TableCell>
                        <TableCell>
                          <Badge variant={
                            item.received_quantity === item.expected_quantity ? 'default' : 
                            item.received_quantity > 0 ? 'secondary' : 'outline'
                          }>
                            {item.received_quantity === item.expected_quantity ? 'Complete' :
                             item.received_quantity > 0 ? 'Partial' : 'Pending'}
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