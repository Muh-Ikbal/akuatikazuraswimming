import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, MapPin, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';

interface Schedule {
    id: number;
    date: string;
    time: string;
    location: string;
    status: 'published' | 'on_going' | 'completed' | 'cancelled';
    attendance_status: 'present' | 'absent' | 'on_going' | 'cancelled' | 'scheduled';
    class_session: {
        title: string;
    };
    course: {
        title: string;
        total_meeting: number;
    };
    coach: {
        name: string;
    } | null;
}

interface CourseInfo {
    title: string;
    state: string;
    coach_name: string;
    schedule_days: string;
    schedule_time: string;
    location: string;
    total_meeting: number;
    class_title: string;
}

interface Props {
    schedulesByDate: Record<string, Schedule[]>;
    courseInfo: CourseInfo | null;
    upcomingSchedules: Schedule[];
    currentMonth: number;
    currentYear: number;
    totalSchedules: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal',
        href: '/jadwal-member',
    },
];

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Jadwal({
    schedulesByDate,
    courseInfo,
    upcomingSchedules,
    currentMonth,
    currentYear
}: Props) {
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: (number | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            days.push(day);
        }

        return days;
    }, [month, year]);

    // Get schedule status for a specific date
    const getDateInfo = (day: number) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const schedules = schedulesByDate[dateStr] || [];

        if (schedules.length === 0) return null;

        // Get the primary status (prioritize certain statuses)
        const schedule = schedules[0];
        return {
            hasSchedule: true,
            status: schedule.attendance_status,
            scheduleStatus: schedule.status,
            count: schedules.length,
        };
    };

    // Check if a date is today
    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();
    };

    // Get date text color based on status
    const getDateColor = (dateInfo: ReturnType<typeof getDateInfo>, day: number) => {
        if (!dateInfo) return 'text-foreground';

        // If it's today, show blue
        if (isToday(day)) {
            return 'text-blue-600 font-bold';
        }

        switch (dateInfo.status) {
            case 'present':
                return 'text-green-600 font-semibold';
            case 'absent':
            case 'cancelled':
                return 'text-red-600 font-semibold';
            case 'on_going':
                return 'text-blue-600 font-semibold';
            default:
                return 'text-green-600 font-semibold';
        }
    };

    // Navigate months
    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // Format date for upcoming schedules
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${monthName} ${year}`;
    };

    // Format time
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const endHour = String(parseInt(hours) + 1).padStart(2, '0');
        return `${hours}:${minutes} - ${endHour}:${minutes}`;
    };

    // Get meeting number for a schedule
    const getMeetingNumber = (schedule: Schedule, index: number) => {
        return index + 1;
    };

    // Get state badge color
    const getStateBadgeColor = (state: string) => {
        switch (state) {
            case 'active':
            case 'on_progress':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'completed':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Jadwal</h1>
                    <p className="text-muted-foreground">Lihat jadwal kursus renang Anda</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Calendar - Takes 2 columns */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-lg font-semibold">
                                {monthNames[month - 1]} {year}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, index) => {
                                    const dateInfo = day ? getDateInfo(day) : null;
                                    const dateColor = day ? getDateColor(dateInfo, day) : '';

                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                aspect-square p-2 text-center relative flex items-center justify-center
                                                ${day ? 'hover:bg-muted/50 cursor-pointer rounded-lg' : ''}
                                                ${isToday(day ?? 0) ? 'bg-primary/10 rounded-lg ring-2 ring-primary' : ''}
                                            `}
                                        >
                                            {day && (
                                                <span className={`text-sm ${dateColor}`}>
                                                    {day}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-muted-foreground">Hari ini / On Progress</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-muted-foreground">Hadir</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-muted-foreground">Tidak Hadir</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar - Course Info & Upcoming */}
                    <div className="space-y-6">
                        {/* Course Info */}
                        {courseInfo && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Info Course</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{courseInfo.title}</h3>
                                        <Badge className={`mt-1 ${getStateBadgeColor(courseInfo.state)}`}>
                                            {courseInfo.state === 'on_progress' ? 'On Progress' : courseInfo.state}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>{courseInfo.coach_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{courseInfo.schedule_days}, {courseInfo.schedule_time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{courseInfo.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{courseInfo.total_meeting} Pertemuan</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Upcoming Schedules */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Jadwal Mendatang</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((schedule, index) => (
                                        <div
                                            key={schedule.id}
                                            className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="font-medium text-sm">
                                                {formatDate(schedule.date)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatTime(schedule.time)}
                                            </div>
                                            <Badge variant="outline" className="mt-2">
                                                Pertemuan {getMeetingNumber(schedule, index)}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada jadwal mendatang
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
