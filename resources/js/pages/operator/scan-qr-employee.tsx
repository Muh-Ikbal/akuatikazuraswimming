import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
    QrCode,
    Camera,
    CheckCircle2,
    XCircle,
    User,
    Clock,
    RefreshCw,
    Loader2,
    ScanLine,
    History,
    UserCheck,
    Briefcase
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Scan QR Pegawai',
        href: '/scan-qr-pegawai',
    },
];

interface ScanResult {
    success: boolean;
    attendanceToday?: number;
    employee?: {
        id: number;
        name: string;
        email: string;
        role: string;
        qr_code: string;
    } | string;
    message: string;
    timestamp?: string;
    attendanceType?: string;
    state?: string;
}

interface RecentScan {
    id: number;
    employee_name: string;
    time: string;
    status: 'success' | 'failed';
    attendanceType?: string;
}

interface Props {
    attendanceToday: number;
}

export default function ScanQREmployee({ attendanceToday: initialAttendance }: Props) {
    const { flash } = usePage().props as any;
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [manualCode, setManualCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const [attendanceCount, setAttendanceCount] = useState(initialAttendance);

    useEffect(() => {
        if (flash?.scan_result) {
            setScanResult(flash.scan_result);
            if (flash.scan_result.attendanceToday) {
                setAttendanceCount(flash.scan_result.attendanceToday);
            }
        }
    }, [flash]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setIsScanning(true);
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsScanning(false);
    };

    const lastScanTimeRef = useRef(0);

    const onScan = (result: any) => {
        const value = result?.[0]?.rawValue;
        if (!value) return;

        const now = Date.now();

        // throttle: 1 detik
        if (now - lastScanTimeRef.current < 1000) return;

        lastScanTimeRef.current = now;
        handleSubmitScan(value);
    };

    const handleSubmitScan = async (qrCode: string) => {
        setIsProcessing(true);

        router.post('/scan-qr-pegawai/verify', { qr_code: qrCode }, {
            onSuccess: (page: any) => {
                const result = page.props.flash?.scan_result;
                setScanResult(result);
                if (result?.success) {
                    const employeeName = typeof result.employee === 'object' ? result.employee.name : result.employee;
                    addRecentScan(employeeName || 'Unknown', 'success', result.attendanceType);
                    if (result.attendanceToday) {
                        setAttendanceCount(result.attendanceToday);
                    }
                } else {
                    const employeeName = typeof result.employee === 'object' ? result.employee.name : result.employee;
                    addRecentScan(employeeName || 'Unknown', 'failed');
                }
            },
            onError: () => {
                setScanResult({
                    success: false,
                    message: 'Terjadi kesalahan saat memverifikasi QR Code'
                });
                addRecentScan(qrCode, 'failed');
            },
            onFinish: () => {
                setIsProcessing(false);
                setManualCode('');
            },
            preserveState: true,
        });
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;
        handleSubmitScan(manualCode);
    };

    const addRecentScan = (name: string, status: 'success' | 'failed', attendanceType?: string) => {
        const newScan: RecentScan = {
            id: Date.now(),
            employee_name: name,
            time: new Date().toLocaleTimeString('id-ID'),
            status,
            attendanceType
        };
        setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
    };

    const resetScan = () => {
        setScanResult(null);
        setManualCode('');
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Pegawai" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5">
                            <Briefcase className="h-6 w-6 md:h-7 md:w-7 text-orange-600" />
                        </div>
                        Scan QR Pegawai
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Scan QR Code untuk absensi pegawai (Coach, Admin, Operator)
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Scanner Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Camera/Scanner Card */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-orange-500/5">
                            <CardHeader className="relative pb-4 border-b bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Camera className="h-5 w-5 text-orange-600" />
                                    Scanner QR Code Pegawai
                                </CardTitle>
                                <CardDescription>
                                    Arahkan kamera ke QR Code pegawai atau masukkan kode manual
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Camera View */}
                                {isScanning ? (
                                    <div className="relative mb-6">
                                        <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-black">
                                            <Scanner
                                                onScan={onScan}
                                                constraints={{
                                                    facingMode: 'environment',
                                                    aspectRatio: 1,
                                                    width: { ideal: 1920 },
                                                    height: { ideal: 1080 },
                                                }}
                                            />
                                        </div>
                                        <Button
                                            onClick={stopCamera}
                                            variant="destructive"
                                            className="mt-4 w-full"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Tutup Kamera
                                        </Button>
                                    </div>
                                ) : (
                                    /* Empty Scanner State */
                                    <div className="flex flex-col items-center py-8 text-center mb-6">
                                        <div className="relative mb-6">
                                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                                                <QrCode className="h-16 w-16 text-muted-foreground/40" />
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-6">
                                            Klik tombol di bawah untuk memulai scan
                                        </p>
                                        <Button
                                            onClick={startCamera}
                                            size="lg"
                                            className="gap-2 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <Camera className="h-5 w-5" />
                                            Buka Kamera
                                        </Button>
                                    </div>
                                )}

                                {/* Manual Input */}
                                <div className="pt-6 border-t">
                                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                        <QrCode className="h-4 w-4 text-muted-foreground" />
                                        Input Manual
                                    </h4>
                                    <form onSubmit={handleManualSubmit} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                            placeholder="Masukkan kode QR..."
                                            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isProcessing || !manualCode.trim()}
                                            className="bg-orange-500 hover:bg-orange-600"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Verifikasi'
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Recent Scans & Statistics */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Quick Stats */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/20">
                            <CardContent className="p-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                    Statistik Hari Ini
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserCheck className="h-4 w-4 text-orange-600" />
                                            <span className="text-xs text-orange-600 font-medium">Total Absensi Pegawai</span>
                                        </div>
                                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                                            {attendanceCount}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Scans */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/20">
                            <CardContent className="p-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    Hasil Scan
                                </h3>
                                {recentScans.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentScans.map((scan) => (
                                            <div
                                                key={scan.id}
                                                className={`p-3 rounded-lg border flex items-center justify-between ${scan.status === 'success'
                                                    ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                                                    : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {scan.status === 'success' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <div>
                                                        <span className="text-sm font-medium truncate max-w-[120px]">
                                                            {scan.employee_name}
                                                        </span>
                                                        {scan.attendanceType && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Absen {scan.attendanceType}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {scan.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Belum ada scan hari ini
                                    </div>
                                )}

                                {/* Current Scan Result */}
                                {scanResult && (
                                    <div className={`mt-4 p-4 rounded-lg border ${scanResult.success
                                        ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                                        : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            {scanResult.success ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className={`font-medium ${scanResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                                    {scanResult.message}
                                                </p>
                                                {scanResult.success && typeof scanResult.employee === 'object' && (
                                                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                        <p><User className="h-3 w-3 inline mr-1" />{scanResult.employee.name}</p>
                                                        <p><Briefcase className="h-3 w-3 inline mr-1" />{scanResult.employee.role}</p>
                                                        <p><Clock className="h-3 w-3 inline mr-1" />{scanResult.timestamp}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tips Card */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="text-lg">💡</span>
                                    Tips Scan
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">•</span>
                                        Khusus untuk pegawai (Coach, Admin, Operator)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">•</span>
                                        Maksimal 2x scan per hari (masuk & pulang)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500">•</span>
                                        Absen setelah 08:30 akan tercatat terlambat
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
