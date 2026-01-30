import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle
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
    check_in_time: string;
    check_out_time: string | null;
    state: 'present' | 'late' | 'alpha';
    status: string;
}

interface Stats {
    total_present: number;
    total_late: number;
    total_alpha: number;
    total_records: number;
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

    const getStatusBadge = (state: string) => {
        if (state === 'present') {
            return (
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Tepat Waktu
                </Badge>
            );
        } else if (state === 'late') {
            return (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Terlambat
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Alpa
                </Badge>
            );
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
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tepat Waktu</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.total_present}</div>
                            <p className="text-xs text-muted-foreground">kehadiran tepat waktu</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-100">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.total_late}</div>
                            <p className="text-xs text-muted-foreground">kehadiran terlambat</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alpa</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.total_alpha}</div>
                            <p className="text-xs text-muted-foreground">total alpa</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Absensi</CardTitle>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_records}</div>
                            <p className="text-xs text-muted-foreground">total scan absensi</p>
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
                                            <TableHead>Jam Absen</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceRecords.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-medium">
                                                    {formatDate(record.date)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <Clock className="h-4 w-4" />
                                                        {record.check_in_time}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(record.state)}
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
                                    Riwayat absensi akan muncul setelah Anda melakukan scan kehadiran
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
