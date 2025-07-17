import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface AddProductDialogProps {
  onProductAdded: (product: any) => void
}

export function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    supplier: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate a unique ID for the product
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...formData,
        totalStock: 0,
        availableStock: 0,
        reservedStock: 0,
        locations: [],
        lastCounted: new Date().toISOString().split('T')[0],
        value: 0
      }

      onProductAdded(newProduct)
      
      toast({
        title: "Product Added",
        description: `${formData.name} has been added to inventory.`,
      })

      // Reset form
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        supplier: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        description: ''
      })
      
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  placeholder="Enter barcode"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Computers">Computers</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
          </div>

          {/* Physical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Physical Properties</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description (optional)"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}