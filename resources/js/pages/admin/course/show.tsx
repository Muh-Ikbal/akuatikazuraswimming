import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Calendar,
    Clock,
    Image,
    CheckCircle,
    XCircle,
    Banknote
} from 'lucide-react';
import AlertDelete from '@/components/alert-delete';

interface Course {
    id: string;
    title: string;
    description: string;
    image?: string;
    total_meeting: number;
    weekly_meeting_count: number;
    price: number;
    state: "active" | "inactive";
    created_at?: string;
    updated_at?: string;
}

interface ShowCourseProps {
    course: Course;
}

export default function ShowCourse({ course }: ShowCourseProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Course Management',
            href: '/management-course',
        },
        {
            title: course.title,
            href: `/management-course/${course.id}`,
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleDelete = () => {
        router.delete(`/management-course/delete/${course.id}`);
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Link href="/management-course" className="shrink-0">
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                                {course.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Detail informasi course
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 ml-12 sm:ml-0">
                        <Link href={`/management-course/edit/${course.id}`}>
                            <Button variant="outline" className="h-10">
                                <Edit className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                        </Link>

                        <AlertDelete title="Hapus Course" description='Apakah anda yakin ingin menghapus course ini?' action={handleDelete} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Image & Status */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Course Image */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/40 rounded-t-lg overflow-hidden">
                                    {course.image ? (
                                        <img
                                            src={`/storage/${course.image}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Image className="w-16 h-16 text-primary/40" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${course.state === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {course.state === "active" ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {course.state === "active" ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Price Card */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Banknote className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Harga</p>
                                        <p className="text-xl sm:text-2xl font-bold text-primary">
                                            {formatCurrency(course.price)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Course Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg">Informasi Course</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Nama Course
                                    </h3>
                                    <p className="text-base sm:text-lg font-semibold">{course.title}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Deskripsi
                                    </h3>
                                    <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap">
                                        {course.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg">Jadwal & Pertemuan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Total Pertemuan</p>
                                            <p className="text-lg sm:text-xl font-bold">
                                                {course.total_meeting} <span className="text-sm font-normal text-muted-foreground">kali</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Pertemuan per Minggu</p>
                                            <p className="text-lg sm:text-xl font-bold">
                                                {course.weekly_meeting_count} <span className="text-sm font-normal text-muted-foreground">kali/minggu</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Calculated Duration */}
                                <div className="mt-4 p-3 sm:p-4 rounded-lg border border-dashed border-border">
                                    <p className="text-xs sm:text-sm text-muted-foreground">Estimasi Durasi Program</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground">
                                        ± {Math.ceil(course.total_meeting / course.weekly_meeting_count)} minggu
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        {(course.created_at || course.updated_at) && (
                            <Card>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        {course.created_at && (
                                            <div>
                                                <p className="text-muted-foreground">Dibuat pada</p>
                                                <p className="font-medium">{formatDate(course.created_at)}</p>
                                            </div>
                                        )}
                                        {course.updated_at && (
                                            <div>
                                                <p className="text-muted-foreground">Terakhir diubah</p>
                                                <p className="font-medium">{formatDate(course.updated_at)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
