'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Device = {
  id: string
  name: string
  status: 'online' | 'offline'
}

export default function ActiveDevices({isLoading, setIsLoading} : any) {
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    const fetchDevices = async () => {
      //setIsLoading(true)
      // TODO: Implement API call to fetch active implants
      // await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
      setDevices([
        { id: '1', name: 'Implant-872b-4338', status: 'offline' },
      ])
      //setIsLoading(false)
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Implant ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device.id}>
            <TableCell>{device.id}</TableCell>
            <TableCell>{device.name}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

