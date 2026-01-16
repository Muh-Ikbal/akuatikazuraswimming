import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Flash {
    success: string;
    error: string;
}

export const AlerInformation = ({ flash }: { flash: Flash }) => {
    return (
        <div className="w-full">
            {flash.success && (
                <Alert variant={'success'} className="bg-green-400" style={{ width: '100%' }}>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        {flash.success}
                    </AlertDescription>
                </Alert>
            )}
            {flash.error && (
                <Alert variant={'error'} className="bg-red-400" style={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {flash.error}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

