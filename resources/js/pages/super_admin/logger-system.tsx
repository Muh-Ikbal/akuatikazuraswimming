import AppLayout from "@/layouts/app-layout"
import { Head, router } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Download, RefreshCw, AlertTriangle, AlertCircle } from "lucide-react"

interface LogEntry {
    timestamp: string;
    env: string;
    level: string;
    message: string;
}

interface Props {
    logs: LogEntry[];
}

export default function LoggerSystem({ logs }: Props) {

    const handleRefresh = () => {
        router.reload();
    };

    const getLevelBadge = (level: string) => {
        if (level === 'ERROR') {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                {level}
            </span>
        }
        if (level === 'WARNING') {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {level}
            </span>
        }
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{level}</span>
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Log Sistem', href: '/logging' }]}>
            <Head title="Log Sistem" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Log Sistem</h1>
                        <p className="text-muted-foreground">Menampilkan log error dan warning terbaru</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleRefresh}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button asChild>
                            <a href="/logging/download">
                                <Download className="w-4 h-4 mr-2" />
                                Download Full Log
                            </a>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Log Sistem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Timestamp</TableHead>
                                        <TableHead className="w-[100px]">Level</TableHead>
                                        <TableHead className="w-[100px]">Env</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                                <TableCell>{getLevelBadge(log.level)}</TableCell>
                                                <TableCell>{log.env}</TableCell>
                                                <TableCell className="font-mono text-xs break-all group relative">
                                                    <div className="max-h-[100px] overflow-y-auto">
                                                        {log.message}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Tidak ada log error atau warning yang ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}