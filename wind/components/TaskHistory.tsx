'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type TaskResult = {
  task_id: string
  contents: string
  task_options: string
  task_type: 'ping' | 'execute'
}

export default function TaskHistory({isLoading, setIsLoading} : any) {
  const [results, setResults] = useState<TaskResult[]>([])

  useEffect(() => {
    const fetchResults = async () => {
        if(!isLoading) {
            setIsLoading(true)
        }
      const response = await fetch("http://127.0.0.1:5000/taskhistory")
      const data : TaskResult[] = await response.json()
      setResults(data)
      setIsLoading(false)
    }

    fetchResults()
    const interval = setInterval(fetchResults, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task ID</TableHead>
          <TableHead>Contents</TableHead>
          <TableHead>Task Options</TableHead>
          <TableHead>Task Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.task_id}>
            <TableCell>{result.task_id}</TableCell>
            <TableCell>{result.contents}</TableCell>
            <TableCell>{result.task_options}</TableCell>
            <TableCell>{result.task_type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

