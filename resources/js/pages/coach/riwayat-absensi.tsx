import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Absensi',
        href: '/riwayat-absensi-coach',
    },
];

interface AttendanceRecord {
    id: number;
    date: string;
    time: string;
    location: string;
    class_title: string;
    course_title: string;
    status: 'present' | 'absent' | 'cancelled';
    scan_time: string | null;
}

interface Stats {
    total_present: number;
    total_absent: number;
    total_schedules: number;
    attendance_rate: number;
}

interface Props {
    attendanceRecords: AttendanceRecord[];
    stats: Stats;
}

export default function RiwayatAbsensiCoach({ attendanceRecords, stats }: Props) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return (
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hadir
                    </Badge>
                );
            case 'absent':
                return (
                    <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Tidak Hadir
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="secondary">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Dibatalkan
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Riwayat Absensi</h1>
                    <p className="text-muted-foreground">Lihat riwayat kehadiran Anda</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hadir</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.total_present}</div>
                            <p className="text-xs text-muted-foreground">sesi dihadiri</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tidak Hadir</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.total_absent}</div>
                            <p className="text-xs text-muted-foreground">sesi tidak hadir</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_schedules}</div>
                            <p className="text-xs text-muted-foreground">total sesi terlaksana</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.attendance_rate}%</div>
                            <p className="text-xs text-muted-foreground">persentase kehadiran</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {attendanceRecords.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Lokasi</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Waktu Scan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceRecords.map((record) => (
                                            <TableRow key={`${record.id}-${record.date}`}>
                                                <TableCell className="font-medium">
                                                    {formatDate(record.date)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(record.time)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{record.class_title}</div>
                                                        <div className="text-xs text-muted-foreground">{record.course_title}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <MapPin className="h-3 w-3" />
                                                        {record.location}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(record.status)}
                                                </TableCell>
                                                <TableCell>
                                                    {record.scan_time ? (
                                                        <span className="text-sm text-muted-foreground">{record.scan_time}</span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-1">Belum Ada Riwayat</h3>
                                <p className="text-sm text-muted-foreground">
                                    Riwayat absensi akan muncul setelah Anda mengajar
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
