import { useState, useEffect } from 'react'
import { 
  Scan, 
  Package, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Camera,
  Flashlight,
  RotateCcw,
  ArrowRight,
  User,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

// Mock data for demonstration
const mockTasks = [
  {
    id: 'task-001',
    type: 'pick',
    orderId: 'ORD-001',
    customer: 'Ahmed Electronics',
    items: [
      { sku: 'SKU-12345', name: 'Samsung Galaxy S24', location: 'A-01-01-01', quantity: 2, picked: 0 },
      { sku: 'SKU-67890', name: 'iPhone 15 Pro', location: 'A-01-02-01', quantity: 1, picked: 0 }
    ],
    priority: 'high',
    estimatedTime: '15 min'
  },
  {
    id: 'task-002',
    type: 'putaway',
    poId: 'PO-001',
    supplier: 'Samsung Electronics',
    items: [
      { sku: 'SKU-11111', name: 'Dell XPS 13 Laptop', suggestedLocation: 'B-02-01-01', quantity: 5, processed: 0 }
    ],
    priority: 'medium',
    estimatedTime: '10 min'
  }
]

const mockUser = {
  name: 'Fatima Al-Zahra',
  role: 'Picker',
  shift: 'Morning',
  tasksCompleted: 12,
  accuracy: 98.5
}

export function MobileScannerInterface() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [currentTask, setCurrentTask] = useState(null)
  const [scanInput, setScanInput] = useState('')
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)
  const { toast } = useToast()

  const handleScan = (scannedValue: string) => {
    if (!scannedValue.trim()) return

    // Simulate barcode scanning logic
    if (currentTask) {
      const currentItem = currentTask.items.find(item => 
        item.sku === scannedValue || item.name.toLowerCase().includes(scannedValue.toLowerCase())
      )
      
      if (currentItem) {
        toast({
          title: "Item Scanned",
          description: `${currentItem.name} verified successfully`,
        })
        
        // Update task progress
        if (currentTask.type === 'pick') {
          currentItem.picked = Math.min(currentItem.picked + 1, currentItem.quantity)
        } else if (currentTask.type === 'putaway') {
          currentItem.processed = Math.min(currentItem.processed + 1, currentItem.quantity)
        }
        
        setCurrentTask({...currentTask})
      } else {
        toast({
          title: "Item Not Found",
          description: "This item is not in your current task",
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "No Active Task",
        description: "Please select a task first",
        variant: "destructive"
      })
    }
    
    setScanInput('')
  }

  const startTask = (task: any) => {
    setCurrentTask(task)
    setActiveTab('scanner')
    toast({
      title: "Task Started",
      description: `Started ${task.type} task for ${task.type === 'pick' ? task.customer : task.supplier}`,
    })
  }

  const completeTask = () => {
    if (!currentTask) return
    
    const allItemsCompleted = currentTask.items.every(item => 
      currentTask.type === 'pick' ? item.picked >= item.quantity : item.processed >= item.quantity
    )
    
    if (allItemsCompleted) {
      toast({
        title: "Task Completed",
        description: `${currentTask.type} task completed successfully`,
      })
      
      // Remove completed task
      setTasks(tasks.filter(t => t.id !== currentTask.id))
      setCurrentTask(null)
      setActiveTab('tasks')
    } else {
      toast({
        title: "Task Incomplete",
        description: "Please complete all items before finishing the task",
        variant: "destructive"
      })
    }
  }

  const getTaskProgress = (task: any) => {
    const totalItems = task.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const completedItems = task.items.reduce((sum: number, item: any) => 
      sum + (task.type === 'pick' ? item.picked : item.processed), 0
    )
    return (completedItems / totalItems) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <div>
              <h1 className="font-semibold">EasyTruck WMS</h1>
              <p className="text-xs text-blue-100">Mobile Scanner</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{mockUser.name}</p>
            <p className="text-xs text-blue-100">{mockUser.role}</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="p-4 bg-white border-b">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{mockUser.tasksCompleted}</div>
            <div className="text-xs text-gray-500">Tasks Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{mockUser.accuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{mockUser.shift}</div>
            <div className="text-xs text-gray-500">Shift</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <Badge variant="outline">{tasks.length} pending</Badge>
          </div>

          {tasks.map((task) => (
            <Card key={task.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">
                    {task.type} Task
                  </CardTitle>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {task.type === 'pick' ? task.customer : task.supplier}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{task.items.length} items</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.estimatedTime}</span>
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{Math.round(getTaskProgress(task))}%</span>
                  </div>
                  <Progress value={getTaskProgress(task)} className="h-2" />
                </div>

                <Button 
                  onClick={() => startTask(task)} 
                  className="w-full"
                  size="sm"
                >
                  Start Task
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks assigned</p>
              <p className="text-sm">Check back later for new tasks</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scanner" className="p-4 space-y-4">
          {currentTask ? (
            <>
              {/* Current Task Info */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base capitalize">
                    Active: {currentTask.type} Task
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {currentTask.type === 'pick' ? currentTask.customer : currentTask.supplier}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{Math.round(getTaskProgress(currentTask))}%</span>
                    </div>
                    <Progress value={getTaskProgress(currentTask)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Scanner Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Scan className="h-5 w-5" />
                    <span>Barcode Scanner</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      placeholder="Scan or enter barcode/SKU"
                      onKeyPress={(e) => e.key === 'Enter' && handleScan(scanInput)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleScan(scanInput)}
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setFlashlightOn(!flashlightOn)}
                      className={flashlightOn ? 'bg-yellow-100' : ''}
                    >
                      <Flashlight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Task Items */}
              <div className="space-y-3">
                <h3 className="font-medium">Items to {currentTask.type}</h3>
                {currentTask.items.map((item: any, index: number) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {currentTask.type === 'pick' ? item.picked : item.processed} / {item.quantity}
                          </div>
                          {(currentTask.type === 'pick' ? item.picked : item.processed) >= item.quantity ? (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 ml-auto" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {currentTask.type === 'pick' ? item.location : item.suggestedLocation}
                          </span>
                        </span>
                        <Progress 
                          value={((currentTask.type === 'pick' ? item.picked : item.processed) / item.quantity) * 100} 
                          className="w-16 h-1" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Complete Task Button */}
              <Button 
                onClick={completeTask}
                className="w-full"
                size="lg"
                disabled={getTaskProgress(currentTask) < 100}
              >
                Complete Task
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Scan className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active task</p>
              <p className="text-sm">Select a task from the Tasks tab to start scanning</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="p-4">
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Task history</p>
            <p className="text-sm">Completed tasks will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}