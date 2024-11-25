"use client"

import { Suspense, useEffect, useState } from 'react'
import AdministerTask from '@/components/AdministerTask'
import ActiveTasks from '@/components/ActiveTasks'
import TaskHistory from '@/components/TaskHistory'
import ActiveImplants from '@/components/ActiveImplants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Terminal } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          return 0;
        }
      });
    }, 100);

    return () => { setProgress(0); clearInterval(interval) };
  }, [isLoading]);
  
  return (
    <div className="container mx-auto p-6">

    <div className="pb-4">
      <Alert className='flex flex-col gap-2'>
        {isLoading ? <Terminal className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        {isLoading ? <AlertTitle>Heads up!</AlertTitle> : <AlertTitle>Hello!</AlertTitle>}
        {isLoading ? 
        <AlertDescription>
          Polling the database to fetch latest updates.
        </AlertDescription> : 
        <AlertDescription>
          We poll database in an interval to keep you up-to-date.
        </AlertDescription>
        }
        {isLoading ? <div><Progress value={progress} className="h-2 w-full"/></div> : <div className='h-2 w-full'></div>}
      </Alert>
    </div>
    

      <div className="grid grid-rows-2 grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Administer Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="" />}>
              <AdministerTask />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-1 max-h-72 min-h-72 overflow-y-auto">
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="" />}>
              <ActiveTasks isLoading={isLoading} setIsLoading={setIsLoading}/>
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-1 max-h-72 min-h-72 overflow-y-auto">
        <CardHeader>
          <CardTitle>Implant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="" />}>
            <ActiveImplants isLoading={isLoading} setIsLoading={setIsLoading}/>
          </Suspense>
        </CardContent>
        </Card>

        <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Task History</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="" />}>
            <TaskHistory isLoading={isLoading} setIsLoading={setIsLoading}/>
          </Suspense>
        </CardContent>
        </Card>
      </div>

    </div>
  )
}

