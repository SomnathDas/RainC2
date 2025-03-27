'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, LeafyGreen } from 'lucide-react'

type FormData = {
  task_type: 'ping' | 'execute' | ''
  task_options: string
}

export default function AdministerTask() {
  const [formData, setFormData] = useState<FormData>({
    task_type: '',
    task_options: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFailedSubmit, setIsFailedSubmit] = useState(false)
  const [failedSubmitReason, setFailedSubmitReason] = useState("")

  const validateForm = (): boolean => {
    const newErrors: Partial<any> = {}

    if (!formData.task_type) {
      newErrors.task_type = 'Task type is required'
    }

    if(formData.task_type != "ping" ) {
        if (!formData.task_options) {
        newErrors.task_options = 'Task options are required'
        } else {
        try {
            JSON.parse(formData.task_options)
        } catch {
            newErrors.task_options = 'Invalid JSON'
        }
        }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    let finalFormData = ""
    if (formData.task_type == "ping") { 
        finalFormData = JSON.stringify({"task_type": "ping"}) 
    } else { 
        finalFormData = JSON.stringify(formData) 
    }
    const response = await fetch("http://127.0.0.1:5000/tasks", {method: "POST", body: finalFormData, headers: {"Content-Type": "application/json; charset=UTF-8"}})
    const resData = await response.json()

    console.log(formData)

    if(response.status != 201) {
        setFailedSubmitReason(resData["message"])
        setIsFailedSubmit(true)
    } else {
        setIsFailedSubmit(false)
    }
    setIsSubmitting(false)

    setFormData({ task_type: '', task_options: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {isFailedSubmit ?  <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {failedSubmitReason}
      </AlertDescription>
    </Alert> : <Alert>
      <LeafyGreen className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Assigned task to the implant.
      </AlertDescription>
    </Alert>}
      <div>
        <Label htmlFor="task_type">Task Type</Label>
        <Select
          value={formData.task_type}
          onValueChange={(value) => setFormData({ ...formData, task_type: value as 'ping' | 'execute' })}
        >
          <SelectTrigger id="task_type">
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ping">Ping</SelectItem>
            <SelectItem value="execute">Execute</SelectItem>
          </SelectContent>
        </Select>
        {errors.task_type && <p className="text-red-500 text-sm mt-1">{errors.task_type}</p>}
      </div>

      <div>
        <Label htmlFor="task_options">Task Options (JSON)</Label>
        <Textarea
          id="task_options"
          value={formData.task_options}
          onChange={(e) => setFormData({ ...formData, task_options: e.target.value })}
          placeholder="Enter JSON task options"
        />
        {errors.task_options && <p className="text-red-500 text-sm mt-1">{errors.task_options}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit New Task'}
      </Button>
    </form>
  )
}

