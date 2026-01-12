import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    Calendar,
    CreditCard,
    TrendingUp,
    TrendingDown,
    UserCheck,
    Wallet
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard User',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    // Data statistik (akan diganti dengan data asli dari backend)
    const stats = {
        totalPeserta: 156,
        pesertaBaru: 12,
        totalCoach: 8,
        totalCourse: 5,
        jadwalHariIni: 6,
        pendapatanBulanIni: 45600000,
        pendapatanBulanLalu: 42000000,
    };

    const recentActivities = [
        { type: 'enrollment', name: 'Siti Nurhaliza', action: 'mendaftar course Basic Swimming', time: '2 jam lalu' },
        { type: 'payment', name: 'Ahmad Wijaya', action: 'melakukan pembayaran Rp 750.000', time: '3 jam lalu' },
        { type: 'schedule', name: 'Coach Budi', action: 'menyelesaikan sesi kelas Basic 1A', time: '5 jam lalu' },
        { type: 'enrollment', name: 'Dewi Lestari', action: 'mendaftar course Intermediate', time: '1 hari lalu' },
    ];

    const upcomingSchedules = [
        { kelas: 'Kelas Basic 1A', waktu: '08:00 - 09:00', lokasi: 'Kolam Utama', peserta: 6 },
        { kelas: 'Kelas Basic 1B', waktu: '09:30 - 10:30', lokasi: 'Kolam Utama', peserta: 8 },
        { kelas: 'Kelas Intermediate 2A', waktu: '14:00 - 15:00', lokasi: 'Kolam Utama', peserta: 5 },
    ];

    const pendapatanTrend = ((stats.pendapatanBulanIni - stats.pendapatanBulanLalu) / stats.pendapatanBulanLalu) * 100;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Selamat datang di panel admin Akuatik Azura</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Peserta */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPeserta}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-green-600 font-medium">+{stats.pesertaBaru}</span>
                                bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Coach */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Coach</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCoach}</div>
                            <p className="text-xs text-muted-foreground">coach aktif</p>
                        </CardContent>
                    </Card>

                    {/* Total Course */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Course</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCourse}</div>
                            <p className="text-xs text-muted-foreground">course tersedia</p>
                        </CardContent>
                    </Card>

                    {/* Pendapatan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                                <Wallet className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.pendapatanBulanIni)}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {pendapatanTrend >= 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span className="text-green-600 font-medium">+{pendapatanTrend.toFixed(1)}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                        <span className="text-red-600 font-medium">{pendapatanTrend.toFixed(1)}%</span>
                                    </>
                                )}
                                dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Jadwal Hari Ini */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Jadwal Hari Ini
                            </CardTitle>
                            <span className="text-sm text-muted-foreground">{stats.jadwalHariIni} sesi</span>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingSchedules.map((schedule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10"
                                >
                                    <div>
                                        <div className="font-medium text-foreground">{schedule.kelas}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {schedule.waktu} • {schedule.lokasi}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="font-medium">{schedule.peserta}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terbaru */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 py-3 border-b border-border last:border-0"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                        {activity.type === 'enrollment' && <Users className="h-4 w-4 text-primary" />}
                                        {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-green-600" />}
                                        {activity.type === 'schedule' && <Calendar className="h-4 w-4 text-blue-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.name}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
