import { useState } from 'react'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface InventoryAdjustmentDialogProps {
  productId: string
  productName: string
}

export function InventoryAdjustmentDialog({ productId, productName }: InventoryAdjustmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    adjustmentType: '',
    quantity: '',
    reason: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically make an API call to adjust inventory
      console.log('Inventory adjustment:', {
        productId,
        ...formData,
        quantity: parseInt(formData.quantity)
      })
      
      toast({
        title: "Inventory Adjusted",
        description: `Stock levels for ${productName} have been updated.`,
      })

      // Reset form
      setFormData({
        adjustmentType: '',
        quantity: '',
        reason: '',
        notes: ''
      })
      
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust inventory. Please try again.",
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
        <Button variant="ghost" size="sm" title="Adjust Inventory">
          <Package className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Inventory</DialogTitle>
          <p className="text-sm text-gray-600">{productName}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adjustmentType">Adjustment Type *</Label>
            <Select value={formData.adjustmentType} onValueChange={(value) => handleInputChange('adjustmentType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select adjustment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Increase Stock</SelectItem>
                <SelectItem value="decrease">Decrease Stock</SelectItem>
                <SelectItem value="set">Set Exact Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {formData.adjustmentType === 'set' ? 'New Quantity' : 'Quantity'} *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={formData.reason} onValueChange={(value) => handleInputChange('reason', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cycle_count">Cycle Count</SelectItem>
                <SelectItem value="damaged">Damaged Goods</SelectItem>
                <SelectItem value="lost">Lost/Missing</SelectItem>
                <SelectItem value="found">Found Items</SelectItem>
                <SelectItem value="return">Customer Return</SelectItem>
                <SelectItem value="correction">Data Correction</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.adjustmentType || !formData.quantity || !formData.reason}>
              {loading ? 'Adjusting...' : 'Adjust Inventory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}