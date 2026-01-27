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
    Calendar,
    RefreshCw,
    Loader2,
    ScanLine,
    History,
    UserCheck
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Scan QR',
        href: '/scan-qr',
    },
];

interface ScanResult {
    success: boolean;
    attendanceToday?: number;
    member?: {
        id: number;
        name: string;
        email: string;
        qr_code: string;
        status: string;
    };
    message: string;
    timestamp?: string;
}

interface RecentScan {
    id: number;
    member_name: string;
    time: string;
    status: 'success' | 'failed';
}

export default function ScanQRMember() {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [manualCode, setManualCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsScanning(true);
            // setScanResult(null);
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

        // Simulate API call - replace with actual endpoint
        router.post('/scan-qr-member/verify', { qr_code: qrCode }, {
            onSuccess: (page: any) => {
                const result = page.props.flash?.scan_result;
                console.log(page.props);
                setScanResult(result);
                if (result?.success) {
                    addRecentScan(result.member?.name || 'Unknown', 'success');
                } else {
                    addRecentScan(result.member || 'Unknown', 'failed');
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

        setIsProcessing(true);

        // Simulate API call - replace with actual endpoint
        router.post('/scan-qr-member/verify', { qr_code: manualCode }, {
            onSuccess: (page: any) => {
                const result = page.props.scan_result;
                console.log(result)
                setScanResult(result);
                if (result?.success) {
                    addRecentScan(result.member?.name || 'Unknown', 'success');
                } else {
                    addRecentScan(manualCode, 'failed');
                }
            },
            onError: () => {
                setScanResult({
                    success: false,
                    message: 'Terjadi kesalahan saat memverifikasi QR Code'
                });
                addRecentScan(manualCode, 'failed');
            },
            onFinish: () => {
                setIsProcessing(false);
                setManualCode('');

            },
            preserveState: true,
        });
    };

    const addRecentScan = (name: string, status: 'success' | 'failed') => {
        const newScan: RecentScan = {
            id: Date.now(),
            member_name: name,
            time: new Date().toLocaleTimeString('id-ID'),
            status
        };
        setRecentScans(prev => [newScan, ...prev.slice(0, 0)]);
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
            <Head title="Scan QR" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                            <ScanLine className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                        </div>
                        Scan QR
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Scan QR Code untuk absensi dan verifikasi kehadiran
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Scanner Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Camera/Scanner Card */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
                            <CardHeader className="relative pb-4 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Camera className="h-5 w-5 text-primary" />
                                    Scanner QR Code
                                </CardTitle>
                                <CardDescription>
                                    Arahkan kamera ke QR Code member atau masukkan kode manual
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
                                                    facingMode: 'environment', // Use rear camera
                                                    aspectRatio: 1, // Square aspect ratio
                                                    // Advanced constraints
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
                                            className="gap-2 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
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
                                            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isProcessing || !manualCode.trim()}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl  border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserCheck className="h-4 w-4 text-green-600" />
                                            <span className="text-xs text-green-600 font-medium">Hadir</span>
                                        </div>
                                        <p className="text-2xl font-bold text-black">
                                            {scanResult?.attendanceToday || 0}
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
                                    Scan Message
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
                                                            {scan.member_name}
                                                        </span>
                                                        <div className="text-xs text-muted-foreground">{scanResult?.message ? scanResult?.message : 'Unknown'}</div>
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
                                        <span className="text-primary">•</span>
                                        Pastikan QR Code dalam kondisi terang
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        Arahkan kamera dengan stabil
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        Gunakan input manual jika scan gagal
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
