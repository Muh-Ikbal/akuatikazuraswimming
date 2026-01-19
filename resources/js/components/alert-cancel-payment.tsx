import { XCircle } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"



const AlertCancelPayment = ({ title, description, action }: { title: string, description: string, action: () => void }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' size='icon' className="text-destructive hover:bg-destructive/10">
                    <XCircle className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={action} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ya</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertCancelPayment;