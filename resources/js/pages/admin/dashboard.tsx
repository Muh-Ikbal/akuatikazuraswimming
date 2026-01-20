import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    Calendar,
    TrendingUp,
    TrendingDown,
    UserCheck,
    Wallet,
    DollarSign
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface payments {
    id: number;
    amount: string;
    amount_paid: string;
    created_at: string;
}

interface schedule {
    time: string;
    date: string;
    location: string;
}

interface classSession {
    id: number;
    title: string;
    enrolment_count: number;
    schedule: schedule[];
}

interface RevenuePerCourse {
    id: number;
    title: string;
    total_revenue: number;
    total_students: number;
}

export default function Dashboard(props: {
    members: number,
    coaches: number,
    courses: number,
    payments: payments[],
    class_sessions: classSession[],
    revenue_per_course: RevenuePerCourse[]
}) {

    const class_sessions = props.class_sessions;
    const revenuePerCourse = props.revenue_per_course || [];
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);


    // const totalPayments = props.payments.reduce((total, payment) => total + payment.amount, 0);
    const totalPaymentsThisMonth = props.payments.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
    }).reduce((total, payment) => total + parseFloat(payment.amount_paid), 0);
    const totalPaymentsLastMonth = props.payments.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate >= firstDayOfLastMonth && paymentDate <= lastDayOfLastMonth;
    }).reduce((total, payment) => total + parseFloat(payment.amount), 0);
    // Data statistik (akan diganti dengan data asli dari backend)

    const stats = {
        totalPeserta: props.members,
        pesertaBaru: 12,
        totalCoach: props.coaches,
        totalCourse: props.courses,
        jadwalHariIni: class_sessions.length,
        pendapatanBulanIni: totalPaymentsThisMonth,
        pendapatanBulanLalu: totalPaymentsLastMonth,
    };

    // Calculate max revenue for progress bar
    const maxRevenue = Math.max(...revenuePerCourse.map(c => c.total_revenue), 1);

    const pendapatanTrend = stats.pendapatanBulanLalu === 0 ? (stats.pendapatanBulanIni > 0 ? 100 : 0) : ((stats.pendapatanBulanIni - stats.pendapatanBulanLalu) / stats.pendapatanBulanLalu) * 100;

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
                            {class_sessions.length > 0 ? (
                                class_sessions.map((record, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10"
                                    >
                                        <div>
                                            <div className="font-medium text-foreground">{record.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {record.schedule[0]?.time} • {record.schedule[0]?.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{record.enrolment_count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada jadwal hari ini</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pendapatan per Course */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                Pendapatan per Course
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {revenuePerCourse.length > 0 ? (
                                revenuePerCourse.map((course) => (
                                    <div key={course.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{course.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {course.total_students} peserta
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    {formatCurrency(course.total_revenue)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{ width: `${(course.total_revenue / maxRevenue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada data pendapatan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

