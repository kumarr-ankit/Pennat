import "./App.css";
import { AlertBox } from "./components/AlertBox";
import { Button } from "@/components/ui/button"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

 function AlertBasic() {
  return (
    <Alert className="max-w-md">
      <CheckCircle2Icon />
      <AlertTitle>Account updated successfully</AlertTitle>
      <AlertDescription>
        Your profile information has been saved. Changes will be reflected
        immediately.
      </AlertDescription>
    </Alert>
  )
}


function App() {
  return (
    <>
      <p>Hey, I am Pennat 🖊️🐧</p>

      <Button>Click Me.</Button>

      {AlertBasic()}
      <AlertBox />
    </>
  );
}

export default App;
