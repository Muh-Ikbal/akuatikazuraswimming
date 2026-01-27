import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData, type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, School, Users, MapPin, Clock, Book } from 'lucide-react';
import { dashboard } from '@/routes';

interface Schedule {
    id: number;
    date: string;
    time: string;
    location: string;
    class_title: string;
    course_title: string;
}

interface CourseEnrolment {
    id: number;
    course_title: string;
    class_title: string;
    meeting_count: number;
    state: string;
}

interface DashboardProps {
    stats: {
        total_attendance: number;
        total_courses: number;
    };
    upcomingSchedules: Schedule[];
    historyCourses: CourseEnrolment[];
    currentEnrolments: CourseEnrolment[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats, upcomingSchedules, historyCourses, currentEnrolments }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Selamat Datang, {auth.user.name}! Berikut ringkasan aktivitas renang Anda.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kehadiran
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_attendance || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Sesi latihan dihadiri
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kursus Diikuti
                            </CardTitle>
                            <School className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Kelas aktif saat ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Schedules */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Mendatang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {schedule.class_title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {schedule.course_title}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {schedule.time}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    {schedule.location}
                                                </div>
                                                <div className="font-medium text-foreground">
                                                    {schedule.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Tidak ada jadwal mendatang.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Current Enrolments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kursus Yang Diikuti Saat Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {currentEnrolments && currentEnrolments.length > 0 ? (
                                    currentEnrolments.map((enrolment) => (
                                        <div
                                            key={enrolment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-green-500/10 rounded-full">
                                                    <School className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {enrolment.course_title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Kelas: {enrolment.class_title}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-green-600">
                                                    Aktif
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {enrolment.meeting_count} pertemuan
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Tidak ada kursus yang sedang diikuti.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Courses */}
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Kursus Yang Pernah Diikuti</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {historyCourses && historyCourses.length > 0 ? (
                                    historyCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <Book className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {course.course_title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Kelas: {course.class_title}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-blue-600">
                                                    Selesai
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {course.meeting_count} pertemuan
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Tidak ada riwayat kursus yang pernah diikuti.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout >
    );
}
