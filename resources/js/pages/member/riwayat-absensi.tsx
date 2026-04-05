import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';

interface Statistics {
    present: number;
    remaining: number;
    all_schedules: number;
}

interface AttendanceDetail {
    enrolment_id: number;
    date: string;
    time: string;
    location: string;
    status: 'present';
    schedule_status?: string;
    scan_time: string | null;
    course_title: string;
}

interface EnrolmentDetail {
    enrolment_id: number;
    course_title: string;
    class_title: string;
    meeting_count: number;
    class_session_id: number | null;
}

interface EnrolmentFilter {
    id: number;
    label: string;
    state: string;
}

interface Props {
    statistics: Statistics;
    detailedAttendance: AttendanceDetail[];
    enrolmentDetails: EnrolmentDetail[];
    enrolmentFilters: EnrolmentFilter[];
    defaultEnrolmentId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Absensi',
        href: '/riwayat-absensi',
    },
];

export default function RiwayatAbsensi({
    statistics,
    detailedAttendance,
    enrolmentDetails,
    enrolmentFilters,
    defaultEnrolmentId,
}: Props) {
    const [selectedEnrolmentId, setSelectedEnrolmentId] = useState<string>(
        defaultEnrolmentId ? String(defaultEnrolmentId) : 'all'
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
        const day = date.getDate();
        const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${monthName} ${year}`;
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const endHour = String(parseInt(hours) + 1).padStart(2, '0');
        return `${hours}:${minutes} - ${endHour}:${minutes}`;
    };

    // Filter attendance by selected enrolment
    const filteredAttendance = useMemo(() => {
        if (selectedEnrolmentId === 'all') return detailedAttendance;
        const id = Number(selectedEnrolmentId);
        return detailedAttendance.filter((a) => a.enrolment_id === id);
    }, [selectedEnrolmentId, detailedAttendance]);

    // Filter enrolment details for stat cards
    const filteredEnrolmentDetails = useMemo(() => {
        if (selectedEnrolmentId === 'all') return enrolmentDetails;
        const id = Number(selectedEnrolmentId);
        return enrolmentDetails.filter((d) => d.enrolment_id === id);
    }, [selectedEnrolmentId, enrolmentDetails]);

    // Get state label
    const getStateLabel = (state: string) => {
        switch (state) {
            case 'active': return 'Aktif';
            case 'on_progress': return 'Berjalan';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return state;
        }
    };

    // Selected filter label for trigger display
    const selectedFilterLabel = useMemo(() => {
        if (selectedEnrolmentId === 'all') return 'Semua Kelas';
        const found = enrolmentFilters.find((f) => String(f.id) === selectedEnrolmentId);
        return found ? found.label : 'Pilih Kelas';
    }, [selectedEnrolmentId, enrolmentFilters]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Absensi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Riwayat Absensi</h1>
                        <p className="text-muted-foreground">Lihat rekap kehadiran kursus Anda</p>
                    </div>

                    {/* Enrolment Filter */}
                    {enrolmentFilters.length > 0 && (
                        <div className="w-full sm:w-72">
                            <Select
                                value={selectedEnrolmentId}
                                onValueChange={setSelectedEnrolmentId}
                            >
                                <SelectTrigger className="truncate">
                                    <span className="truncate">{selectedFilterLabel}</span>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {enrolmentFilters.map((filter) => (
                                        <SelectItem key={filter.id} value={String(filter.id)}>
                                            {filter.label} ({getStateLabel(filter.state)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Enrolment Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    {filteredEnrolmentDetails.map((detail, index) => (
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
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Detail Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((attendance, index) => (
                                    <div
                                        key={`${attendance.enrolment_id}-${attendance.date}-${index}`}
                                        className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    Hadir
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{attendance.course_title}</span>
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
                                    Belum ada data kehadiran untuk kelas ini
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
