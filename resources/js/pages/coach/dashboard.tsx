import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    MapPin,
    TrendingUp,
    QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Coach',
        href: dashboard().url,
    },
];

interface Stats {
    total_classes: number;
    total_students: number;
    completed_sessions: number;
    upcoming_sessions: number;
}

interface TodaySchedule {
    id: number;
    time: string;
    location: string;
    class_title: string;
    course_title: string;
    total_students: number;
}

interface ClassInfo {
    class_title: string;
    course_title: string;
    total_students: number;
    capacity: number;
}

interface Props {
    stats: Stats;
    todaySchedules: TodaySchedule[];
    classesInfo: ClassInfo[];
}

export default function CoachDashboard({ stats, todaySchedules, classesInfo }: Props) {
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Coach" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard Coach</h1>
                        <p className="text-muted-foreground">Selamat datang kembali!</p>
                    </div>
                    <Link href="/qr-code">
                        <Button>
                            <QrCode className="mr-2 h-4 w-4" />
                            Lihat QR Code
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Kelas */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kelas Diajar</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_classes}</div>
                            <p className="text-xs text-muted-foreground">total kelas aktif</p>
                        </CardContent>
                    </Card>

                    {/* Total Siswa */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_students}</div>
                            <p className="text-xs text-muted-foreground">siswa yang diajar</p>
                        </CardContent>
                    </Card>

                    {/* Sesi Selesai */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sesi Selesai</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_sessions}</div>
                            <p className="text-xs text-muted-foreground">jadwal telah selesai</p>
                        </CardContent>
                    </Card>

                    {/* Jadwal Mendatang */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jadwal Mendatang</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                                <Calendar className="h-5 w-5" style={{ color: '#d97706' }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming_sessions}</div>
                            <p className="text-xs text-muted-foreground">jadwal akan datang</p>
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
                            <Badge variant="secondary">{todaySchedules.length} sesi</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {todaySchedules.length > 0 ? (
                                todaySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10"
                                    >
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">{schedule.class_title}</div>
                                            <div className="text-sm text-muted-foreground">{schedule.course_title}</div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(schedule.time)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {schedule.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{schedule.total_students}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">Tidak ada jadwal hari ini</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Kelas yang Diajar */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Kelas yang Diajar
                            </CardTitle>
                            <Link href="/jadwal-coach">
                                <Button variant="ghost" size="sm">
                                    Lihat Jadwal
                                    <TrendingUp className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {classesInfo.length > 0 ? (
                                classesInfo.map((classInfo, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium text-foreground">{classInfo.class_title}</div>
                                            <div className="text-sm text-muted-foreground">{classInfo.course_title}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                <Users className="h-4 w-4 text-primary" />
                                                {classInfo.total_students}/{classInfo.capacity}
                                            </div>
                                            <p className="text-xs text-muted-foreground">siswa</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">Belum ada kelas yang diajar</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/jadwal-coach" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Lihat Jadwal</div>
                                        <div className="text-sm text-muted-foreground">Kelola jadwal mengajar</div>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/qr-code" className="block">
                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                        <QrCode className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">QR Code</div>
                                        <div className="text-sm text-muted-foreground">Lihat QR absensi</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
