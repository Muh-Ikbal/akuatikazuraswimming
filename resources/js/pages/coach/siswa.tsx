import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import {
    Search,
    Users,
    School,
    User,
    Phone,
    MapPin,
    BookOpen
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
    id: number;
    name: string;
    phone: string;
    image: string | null;
    address: string;
    class_session: {
        id: number;
        title: string;
    };
    course: {
        id: number;
        title: string;
    } | null;
    enrolment_state: string;
}

interface ClassInfo {
    id: number;
    title: string;
    course_title: string | null;
}

interface Props {
    students: Student[];
    classesInfo: ClassInfo[];
    stats: {
        total_students: number;
        total_classes: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Siswa Saya',
        href: '/siswa-coach',
    },
];

export default function CoachStudents({ students, classesInfo, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterClass, setFilterClass] = useState<string>("all");

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.phone?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = filterClass === "all" || student.class_session.id.toString() === filterClass;
        return matchesSearch && matchesClass;
    });

    const getStateDisplay = (state: string) => {
        switch (state) {
            case 'active':
                return {
                    label: 'Aktif',
                    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                };
            case 'completed':
                return {
                    label: 'Selesai',
                    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                };
            default:
                return {
                    label: state,
                    className: 'bg-gray-100 text-gray-700'
                };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Siswa Saya" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Siswa Saya
                        </h1>
                        <p className="text-muted-foreground">
                            Daftar siswa yang Anda ajar
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.total_students}</div>
                                <div className="text-sm text-muted-foreground">Total Siswa</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <School className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.total_classes}</div>
                                <div className="text-sm text-muted-foreground">Total Kelas</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau nomor telepon..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterClass}
                                    onChange={(e) => setFilterClass(e.target.value)}
                                >
                                    <option value="all">Semua Kelas</option>
                                    {classesInfo.map((cls) => (
                                        <option key={cls.id} value={cls.id.toString()}>
                                            {cls.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Classes Overview */}
                {classesInfo.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classesInfo.map((cls) => {
                            const classStudentCount = students.filter(s => s.class_session.id === cls.id).length;
                            return (
                                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <School className="w-5 h-5 text-primary" />
                                            {cls.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <BookOpen className="w-4 h-4" />
                                            {cls.course_title || '-'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="font-medium">{classStudentCount} siswa</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Siswa</TableHead>
                                        <TableHead className="hidden sm:table-cell">No. Telepon</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead className="hidden md:table-cell">Course</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student, index) => {
                                        const stateDisplay = getStateDisplay(student.enrolment_state);
                                        return (
                                            <TableRow key={`${student.id}-${student.class_session.id}-${index}`}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                            {student.image ? (
                                                                <img
                                                                    src={`/storage/${student.image}`}
                                                                    alt={student.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="w-5 h-5 text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{student.name}</p>
                                                            <p className="text-xs text-muted-foreground sm:hidden">
                                                                {student.phone || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{student.phone || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {student.class_session.title}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="text-sm">
                                                        {student.course?.title || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stateDisplay.className}`}>
                                                        {stateDisplay.label}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                {students.length === 0
                                                    ? "Belum ada siswa di kelas Anda"
                                                    : "Tidak ada siswa yang sesuai filter"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
