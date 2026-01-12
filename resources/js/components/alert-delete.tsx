import { Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"



const AlertDelete = ({ title, description, action }: { title: string, description: string, action: () => void }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' size='icon' className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={action} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ya, Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDelete;