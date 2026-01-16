import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
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
        id: number;
        title: string;
    };
    course: {
        title: string;
        total_meeting: number;
    } | null;
    total_students: number;
}

interface ClassInfo {
    class_title: string;
    course_title: string;
    total_students: number;
    capacity: number;
    schedule_days: string;
    schedule_time: string;
    location: string;
}

interface Stats {
    total_classes: number;
    total_schedules: number;
    completed: number;
    upcoming: number;
}

interface Props {
    schedulesByDate: Record<string, Schedule[]>;
    classesInfo: ClassInfo[];
    upcomingSchedules: Schedule[];
    currentMonth: number;
    currentYear: number;
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Mengajar',
        href: '/jadwal-coach',
    },
];

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function JadwalCoach({
    schedulesByDate,
    classesInfo,
    upcomingSchedules,
    currentMonth,
    currentYear,
    stats
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

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

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

        const schedule = schedules[0];
        return {
            hasSchedule: true,
            status: schedule.attendance_status,
            scheduleStatus: schedule.status,
            count: schedules.length,
            classTitle: schedule.class_session.title,
        };
    };

    // Check if a date is today
    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();
    };

    // Get date styling based on status
    const getDateStyles = (dateInfo: ReturnType<typeof getDateInfo>, day: number) => {
        let bgClass = '';
        let textClass = 'text-foreground';
        let dotColor = '';
        let dotStyle: React.CSSProperties | undefined = undefined;

        if (isToday(day)) {
            bgClass = 'bg-primary/10 ring-2 ring-primary';
            textClass = 'text-primary font-bold';
        }

        if (dateInfo) {
            switch (dateInfo.status) {
                case 'present':
                    dotColor = 'bg-green-500';
                    if (!isToday(day)) textClass = 'text-green-600 font-semibold';
                    break;
                case 'absent':
                case 'cancelled':
                    dotColor = 'bg-red-500';
                    if (!isToday(day)) textClass = 'text-red-600 font-semibold';
                    break;
                case 'on_going':
                    dotColor = 'bg-blue-500';
                    break;
                case 'scheduled':
                    dotStyle = { backgroundColor: '#f59e0b' };
                    break;
            }
        }

        return { bgClass, textClass, dotColor, dotStyle };
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
        return `${dayName}, ${day} ${monthName}`;
    };

    // Format time
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        // const endHour = String(parseInt(hours) + 1).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Mengajar" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Jadwal Mengajar</h1>
                    <p className="text-muted-foreground">Kelola jadwal dan absensi mengajar Anda</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-blue-500 text-white">
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm opacity-90">Total Kelas</p>
                                <p className="text-3xl font-bold">{stats.total_classes}</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-3">
                                <Users className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-500 text-white">
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm opacity-90">Jadwal Selesai</p>
                                <p className="text-3xl font-bold">{stats.completed}</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-3">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-white" style={{ backgroundColor: '#f59e0b' }}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm opacity-90">Jadwal Mendatang</p>
                                <p className="text-3xl font-bold">{stats.upcoming}</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-3">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-white" style={{ backgroundColor: '#a855f7' }}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm opacity-90">Total Sesi</p>
                                <p className="text-3xl font-bold">{stats.total_schedules}</p>
                            </div>
                            <div className="rounded-full bg-white/20 p-3">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
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
                                    const styles = day ? getDateStyles(dateInfo, day) : { bgClass: '', textClass: '', dotColor: '', dotStyle: undefined };

                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                aspect-square p-1 text-center relative flex flex-col items-center justify-center rounded-lg
                                                ${day ? 'hover:bg-muted/50 cursor-pointer' : ''}
                                                ${styles.bgClass}
                                            `}
                                        >
                                            {day && (
                                                <>
                                                    <span className={`text-sm ${styles.textClass}`}>
                                                        {day}
                                                    </span>
                                                    {dateInfo && (
                                                        <div className="flex gap-0.5 mt-1">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} style={styles.dotStyle} />
                                                            {dateInfo.count > 1 && (
                                                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor}`} style={styles.dotStyle} />
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-muted-foreground">Hadir</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-muted-foreground">Tidak Hadir</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                                    <span className="text-muted-foreground">Terjadwal</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-muted-foreground">Sedang Berlangsung</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Classes Info */}
                        {classesInfo.length > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Kelas yang Diajar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {classesInfo.map((classInfo, index) => (
                                        <div key={index} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                            <h3 className="font-semibold text-sm">{classInfo.class_title}</h3>
                                            <p className="text-xs text-muted-foreground">{classInfo.course_title}</p>
                                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-3 w-3" />
                                                    <span>{classInfo.total_students}/{classInfo.capacity} siswa</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{classInfo.schedule_days}, {classInfo.schedule_time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{classInfo.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                    upcomingSchedules.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {formatDate(schedule.date)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatTime(schedule.time)}
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {schedule.total_students} siswa
                                                </Badge>
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {schedule.location}
                                            </div>
                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                {schedule.class_session.title}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <XCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada jadwal mendatang
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
