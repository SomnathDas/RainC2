'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


type Task = {
  task_id: string
  task_type: 'ping' | 'execute'
  task_options: string
}

export default function ActiveTasks({isLoading, setIsLoading} : any) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
        if(!isLoading) {
            setIsLoading(true)
        }
        const response = await fetch("http://127.0.0.1:5000/tasks")
        const data : Task[] = await response.json()
        setTasks(data)
        setIsLoading(false)
    }

    fetchTasks()
    const interval = setInterval(fetchTasks, 2000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task ID</TableHead>
          <TableHead>Task Type</TableHead>
          <TableHead>Task Options</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.task_id}>
            <TableCell>{task.task_id}</TableCell>
            <TableCell>{task.task_type}</TableCell>
            <TableCell>{JSON.stringify(task.task_options)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

