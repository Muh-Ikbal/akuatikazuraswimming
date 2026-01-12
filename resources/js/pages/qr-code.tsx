import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
    QrCode,
    Download,
    Sparkles,
    Shield,
    Clock,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'QR Code Member',
        href: '/qr-code',
    },
];

interface QrCodeData {
    id: number;
    qr_code: string;
    qr_code_path: string;
    user_id: number;
}

export default function QRCodeMember({ qr_code }: { qr_code: QrCodeData }) {
    const { auth } = usePage<SharedData>().props;
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qr_code?.qr_code_path;
        link.download = `qrcode-${auth.user.name}.png`;
        link.click();
    };

    const handleGenerateQRCode = () => {
        setIsGenerating(true);
        router.post('/generate-qr-code', {}, {
            onFinish: () => setIsGenerating(false)
        });
    };

    const features = [
        {
            icon: Shield,
            title: 'Verifikasi Aman',
            description: 'QR Code unik untuk identifikasi member'
        },
        {
            icon: Clock,
            title: 'Absensi Cepat',
            description: 'Scan untuk absensi kehadiran kelas'
        },
        {
            icon: CheckCircle2,
            title: 'Akses Mudah',
            description: 'Akses fasilitas dengan scan QR'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="QR Code Member" />
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                            <QrCode className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                        </div>
                        QR Code
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Tunjukkan QR Code ini untuk absensi dan verifikasi keanggotaan
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* QR Code Card - Main Content */}
                    <Card className="lg:col-span-3 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
                        <CardHeader className="relative pb-4 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <CardTitle className="text-center text-xl font-semibold">
                                Kartu Member Digital
                            </CardTitle>
                            <CardDescription className="text-center flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Akuatik Azura Swimming Club
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-8 px-4 md:px-8">
                            {qr_code ? (
                                <>
                                    {/* QR Code Container with decorative border */}
                                    <div className="relative mb-8 group">
                                        {/* Animated gradient border */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-2xl opacity-30 group-hover:opacity-50 blur transition-opacity duration-500" />
                                        <div className="relative bg-white p-4 rounded-xl shadow-lg">
                                            <img
                                                src={qr_code.qr_code_path}
                                                alt="QR Code"
                                                className="w-full max-w-[250px] md:max-w-[280px] rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                                            />
                                        </div>
                                    </div>

                                    {/* Member Info */}
                                    <div className="mb-8 text-center space-y-2">
                                        <p className="text-lg font-semibold text-foreground">
                                            {auth.user.name}
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Member ID</span>
                                            <span className="text-sm font-mono font-bold text-primary">
                                                {qr_code.qr_code.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        onClick={handleDownload}
                                        size="lg"
                                        className="gap-2 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <Download className="h-5 w-5" />
                                        Download QR Code
                                    </Button>
                                </>
                            ) : (
                                /* Empty State - No QR Code */
                                <div className="flex flex-col items-center py-8 text-center">
                                    <div className="relative mb-8">
                                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                                            <QrCode className="h-20 w-20 text-muted-foreground/40" />
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background border rounded-full text-xs text-muted-foreground">
                                            Belum ada QR Code
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2">
                                        Buat QR Code Member Anda
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                                        Generate QR Code unik untuk absensi dan verifikasi keanggotaan Anda
                                    </p>

                                    <Button
                                        onClick={handleGenerateQRCode}
                                        disabled={isGenerating}
                                        size="lg"
                                        className="gap-2 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5" />
                                                Generate QR Code
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Features Sidebar */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
                            Fungsi QR Code
                        </h3>
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 hover:from-primary/5 hover:to-card"
                            >
                                <CardContent className="flex items-start gap-4 p-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-foreground mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Tips Card */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500/10 to-orange-500/5 mt-6">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="text-lg">💡</span>
                                    Tips Penggunaan
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        Simpan QR Code di galeri HP untuk akses cepat
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        Tunjukkan QR Code saat datang ke lokasi
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        Jaga kerahasiaan QR Code Anda
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
