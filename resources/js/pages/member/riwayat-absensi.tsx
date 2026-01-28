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
import { CheckCircle2, XCircle, Filter, Clock, CalendarDays } from 'lucide-react';
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
    status: 'present' | 'absent' | 'scheduled' | 'today';
    schedule_status?: string;
    scan_time: string | null;
    course_title: string;
}

interface EnrolmentDetail {
    course_title: string;
    class_title: string;
    meeting_count: number;
    class_session_id: number | null;
}

interface Props {
    statistics: Statistics;
    detailedAttendance: AttendanceDetail[];
    enrolmentDetails: EnrolmentDetail[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Absensi',
        href: '/riwayat-absensi',
    },
];

export default function RiwayatAbsensi({ statistics, detailedAttendance, enrolmentDetails }: Props) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'scheduled' | 'today'>('all');

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
            case 'scheduled':
                return 'Terjadwal';
            case 'today':
                return 'Hari Ini';
            default:
                return 'Semua';
        }
    };

    // Get status badge style and label
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'present':
                return { bg: 'bg-green-100 text-green-700 border-green-200', label: 'Hadir' };
            case 'absent':
                return { bg: 'bg-red-100 text-red-700 border-red-200', label: 'Tidak Hadir' };
            case 'scheduled':
                return { bg: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Terjadwal' };
            case 'today':
                return { bg: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Hari Ini' };
            default:
                return { bg: 'bg-gray-100 text-gray-700 border-gray-200', label: status };
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present':
                return <CheckCircle2 className="h-6 w-6 text-green-600" />;
            case 'absent':
                return <XCircle className="h-6 w-6 text-red-600" />;
            case 'scheduled':
                return <CalendarDays className="h-6 w-6 text-blue-600" />;
            case 'today':
                return <Clock className="h-6 w-6 text-yellow-600" />;
            default:
                return <Clock className="h-6 w-6 text-gray-600" />;
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

                <div className="grid gap-4 md:grid-cols-4">
                    {enrolmentDetails.map((detail, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{detail.meeting_count}</div>
                                    <p className="text-sm font-medium mt-1">{detail.course_title}</p>
                                    <p className="text-xs text-muted-foreground">{detail.class_title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

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
                                <DropdownMenuItem onClick={() => setFilterStatus('scheduled')}>
                                    Terjadwal
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterStatus('today')}>
                                    Hari Ini
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
                                            {getStatusIcon(attendance.status)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">

                                                <Badge className={getStatusStyle(attendance.status).bg}>
                                                    {getStatusStyle(attendance.status).label}
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
