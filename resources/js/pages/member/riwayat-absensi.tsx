import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, XCircle, Filter } from 'lucide-react';
import { useState } from 'react';

interface Statistics {
    total: number;
    present: number;
    absent: number;
    percentage: number;
    remaining: number;
}

interface AttendanceDetail {
    meeting_number: number;
    date: string;
    time: string;
    location: string;
    status: 'present' | 'absent';
    scan_time: string | null;
    course_title: string;
}

interface Props {
    statistics: Statistics;
    detailedAttendance: AttendanceDetail[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Absensi',
        href: '/riwayat-absensi',
    },
];

export default function RiwayatAbsensi({ statistics, detailedAttendance }: Props) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');

    // Format date to Indonesian format
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
        const day = date.getDate();
        const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${monthName} ${year}`;
    };

    // Format time range
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const endHour = String(parseInt(hours) + 1).padStart(2, '0');
        return `${hours}:${minutes} - ${endHour}:${minutes}`;
    };

    // Filter attendance based on selected status
    const filteredAttendance = detailedAttendance.filter((attendance) => {
        if (filterStatus === 'all') return true;
        return attendance.status === filterStatus;
    });

    // Get filter label
    const getFilterLabel = () => {
        switch (filterStatus) {
            case 'present':
                return 'Hadir';
            case 'absent':
                return 'Tidak Hadir';
            default:
                return 'Semua';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Riwayat Absensi</h1>
                    <p className="text-muted-foreground">Lihat rekap kehadiran kursus Anda</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{statistics.total}</div>
                                <p className="text-sm text-muted-foreground mt-1">Total Pertemuan</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{statistics.present}</div>
                                <p className="text-sm text-muted-foreground mt-1">Hadir</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-600">{statistics.absent}</div>
                                <p className="text-sm text-muted-foreground mt-1">Tidak Hadir</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{statistics.percentage}%</div>
                                <p className="text-sm text-muted-foreground mt-1">Persentase</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Combined Chart & Summary Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                            {/* Circular Progress */}
                            <div className="flex-shrink-0">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90">
                                        {/* Background circle */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="80"
                                            stroke="#e5e7eb"
                                            strokeWidth="16"
                                            fill="none"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="80"
                                            stroke="#3b82f6"
                                            strokeWidth="16"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 80}`}
                                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - statistics.percentage / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold">{statistics.percentage}%</div>
                                            <div className="text-sm text-muted-foreground">Kehadiran</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Breakdown */}
                            <div className="flex-1 space-y-4 w-full">
                                <h3 className="font-semibold text-lg">Ringkasan Kehadiran</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-sm">Hadir</span>
                                        </div>
                                        <span className="font-semibold">{statistics.present} pertemuan</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="text-sm">Tidak Hadir</span>
                                        </div>
                                        <span className="font-semibold">{statistics.absent} pertemuan</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-gray-400" />
                                            <span className="text-sm">Tersisa</span>
                                        </div>
                                        <span className="font-semibold">{statistics.remaining} pertemuan</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        Catatan: Ketidakhadiran tidak dapat diganti
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Attendance List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Detail Kehadiran</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {getFilterLabel()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                    Semua
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('present')}>
                                    Hadir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('absent')}>
                                    Tidak Hadir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((attendance) => (
                                    <div
                                        key={attendance.meeting_number}
                                        className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {attendance.status === 'present' ? (
                                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                            ) : (
                                                <XCircle className="h-6 w-6 text-red-600" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="font-medium">
                                                    Pertemuan {attendance.meeting_number}
                                                </h4>
                                                <Badge
                                                    className={
                                                        attendance.status === 'present'
                                                            ? 'bg-green-100 text-green-700 border-green-200'
                                                            : 'bg-red-100 text-red-700 border-red-200'
                                                    }
                                                >
                                                    {attendance.status === 'present' ? 'Hadir' : 'Tidak Hadir'}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div>{formatDate(attendance.date)}</div>
                                                <div>{formatTime(attendance.time)}</div>
                                                {attendance.scan_time && (
                                                    <div className="text-xs">
                                                        Scan: {attendance.scan_time}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Tidak ada data untuk filter ini
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
