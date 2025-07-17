import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface AddLocationDialogProps {
  onLocationAdded: (location: any) => void
}

export function AddLocationDialog({ onLocationAdded }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    zone: '',
    aisle: '',
    rack: '',
    bin: '',
    capacity: '100'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newLocation = {
        id: `loc-${Date.now()}`,
        ...formData,
        capacity: parseInt(formData.capacity),
        occupied: 0,
        product: null
      }

      onLocationAdded(newLocation)
      
      toast({
        title: "Location Added",
        description: `Location ${formData.zone}-${formData.aisle}-${formData.rack}-${formData.bin} has been created.`,
      })

      // Reset form
      setFormData({
        zone: '',
        aisle: '',
        rack: '',
        bin: '',
        capacity: '100'
      })
      
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add location. Please try again.",
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
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Storage Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone *</Label>
              <Input
                id="zone"
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value.toUpperCase())}
                placeholder="A"
                maxLength={2}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aisle">Aisle *</Label>
              <Input
                id="aisle"
                value={formData.aisle}
                onChange={(e) => handleInputChange('aisle', e.target.value)}
                placeholder="01"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rack">Rack *</Label>
              <Input
                id="rack"
                value={formData.rack}
                onChange={(e) => handleInputChange('rack', e.target.value)}
                placeholder="01"
                maxLength={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bin">Bin *</Label>
              <Input
                id="bin"
                value={formData.bin}
                onChange={(e) => handleInputChange('bin', e.target.value)}
                placeholder="01"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (units)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              placeholder="100"
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> {formData.zone || 'A'}-{formData.aisle || '01'}-{formData.rack || '01'}-{formData.bin || '01'}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}