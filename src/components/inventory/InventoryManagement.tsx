import { useState, useEffect } from 'react'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  BarChart3,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { AddProductDialog } from './AddProductDialog'
import { AddLocationDialog } from './AddLocationDialog'
import { InventoryAdjustmentDialog } from './InventoryAdjustmentDialog'

// Mock data for demonstration
const mockProducts = [
  {
    id: 'prod-001',
    sku: 'SKU-12345',
    name: 'Samsung Galaxy S24',
    barcode: '1234567890123',
    category: 'Electronics',
    supplier: 'Samsung Electronics',
    totalStock: 45,
    availableStock: 38,
    reservedStock: 7,
    locations: ['A-01-01-01', 'A-01-01-02'],
    lastCounted: '2025-01-15',
    value: 899.99
  },
  {
    id: 'prod-002',
    sku: 'SKU-67890',
    name: 'iPhone 15 Pro',
    barcode: '9876543210987',
    category: 'Electronics',
    supplier: 'Apple Inc.',
    totalStock: 23,
    availableStock: 20,
    reservedStock: 3,
    locations: ['A-01-02-01'],
    lastCounted: '2025-01-14',
    value: 1199.99
  },
  {
    id: 'prod-003',
    sku: 'SKU-11111',
    name: 'Dell XPS 13 Laptop',
    barcode: '1111111111111',
    category: 'Computers',
    supplier: 'Dell Technologies',
    totalStock: 12,
    availableStock: 8,
    reservedStock: 4,
    locations: ['B-02-01-01'],
    lastCounted: '2025-01-13',
    value: 1299.99
  }
]

const mockLocations = [
  {
    id: 'loc-001',
    zone: 'A',
    aisle: '01',
    rack: '01',
    bin: '01',
    capacity: 100,
    occupied: 45,
    product: 'Samsung Galaxy S24'
  },
  {
    id: 'loc-002',
    zone: 'A',
    aisle: '01',
    rack: '01',
    bin: '02',
    capacity: 100,
    occupied: 23,
    product: 'iPhone 15 Pro'
  },
  {
    id: 'loc-003',
    zone: 'B',
    aisle: '02',
    rack: '01',
    bin: '01',
    capacity: 50,
    occupied: 12,
    product: 'Dell XPS 13 Laptop'
  }
]

const mockLowStockAlerts = [
  { id: 1, sku: 'SKU-11111', name: 'Dell XPS 13 Laptop', currentStock: 12, minStock: 15 },
  { id: 2, sku: 'SKU-22222', name: 'MacBook Air M2', currentStock: 3, minStock: 10 },
  { id: 3, sku: 'SKU-33333', name: 'HP Printer Ink', currentStock: 5, minStock: 20 }
]

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState(mockProducts)
  const [locations, setLocations] = useState(mockLocations)
  const [loading, setLoading] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category))]
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.totalStock * product.value), 0)
  const totalProducts = products.length
  const lowStockCount = mockLowStockAlerts.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your products, locations, and stock levels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddProductDialog onProductAdded={(product) => setProducts([...products, product])} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalInventoryValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Storage locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.totalStock}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600 font-medium">{product.availableStock}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-yellow-600 font-medium">{product.reservedStock}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.locations.slice(0, 2).map(location => (
                            <Badge key={location} variant="secondary" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                          {product.locations.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.locations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${product.value.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <InventoryAdjustmentDialog productId={product.id} productName={product.name} />
                          <Button variant="ghost" size="sm" className="text-red-600">
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

        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Storage Locations</h3>
            <AddLocationDialog onLocationAdded={(location) => setLocations([...locations, location])} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {location.zone}-{location.aisle}-{location.rack}-{location.bin}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span>{Math.round((location.occupied / location.capacity) * 100)}%</span>
                  </div>
                  <Progress value={(location.occupied / location.capacity) * 100} className="h-2" />
                  <div className="text-sm text-gray-600">
                    {location.occupied} / {location.capacity} units
                  </div>
                  {location.product && (
                    <div className="text-sm">
                      <span className="text-gray-500">Product: </span>
                      <span className="font-medium">{location.product}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Stock movements tracking will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLowStockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-red-900">{alert.name}</div>
                      <div className="text-sm text-red-700">SKU: {alert.sku}</div>
                      <div className="text-sm text-red-600">
                        Current: {alert.currentStock} | Minimum: {alert.minStock}
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Reorder
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}