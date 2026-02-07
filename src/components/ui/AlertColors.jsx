import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"

export function AlertColors({errorMsg}) {
  
  return (
    <Alert className="max-w-md ml-6 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>Error Code. {errorMsg.status} </AlertTitle>
      <AlertDescription>
  
   {errorMsg.message}
      </AlertDescription>
    </Alert>
  )
}
