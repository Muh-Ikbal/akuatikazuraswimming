import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Download,
    Clock,
    Calendar,
    Eye,
    Edit,
    Image,
    BookOpen,
    Search,
    Filter,
    Trash2,
    LayoutGrid,
    List
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AlertDelete from "@/components/alert-delete";

interface Course {
    id: number;
    title: string;
    description: string;
    image?: string;
    total_meeting: number;
    weekly_meeting_count: number;
    price: number;
    state: "active" | "inactive";
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course Management',
        href: '/management-course',
    },
];

export default function CourseManagement(props: { courses: any }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    const courses: Course[] = props.courses.data;
    const filteredCourses = courses.filter((c) => {
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || c.state.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleDelete = (id: number) => {
        router.delete(`/management-course/delete/${id}`)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Management" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Course
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola kelas dan jadwal kursus renang
                        </p>
                    </div>
                    <div className="flex gap-3">

                        <Link href="/management-course/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Course
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{courses.length}</div>
                                <div className="text-sm text-muted-foreground">Total Course</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {courses.reduce((acc, c) => acc + c.total_meeting, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Pertemuan</div>
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
                                    placeholder="Cari course..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                                <div className="hidden sm:flex border border-input rounded-md overflow-hidden">
                                    <Button
                                        variant={viewMode === "card" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="rounded-none border-0"
                                        onClick={() => setViewMode("card")}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "table" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="rounded-none border-0"
                                        onClick={() => setViewMode("table")}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button variant="outline" size="icon" className="sm:hidden">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card View */}
                {viewMode === "card" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Course Image */}
                                <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/40">
                                    {course.image ? (
                                        <img
                                            src={`storage/${course.image}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Image className="w-16 h-16 text-primary/40" />
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.state === "active"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-400 text-white"
                                            }`}>
                                            {course.state}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-5">
                                    {/* Nama & Harga */}
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                                        <p className="text-xl font-bold text-primary">
                                            {formatCurrency(course.price)}
                                        </p>
                                    </div>

                                    {/* Deskripsi */}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Course Details */}
                                    <div className="flex items-center gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-muted-foreground">
                                                {course.total_meeting} pertemuan
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-muted-foreground">
                                                {course.weekly_meeting_count}x/minggu
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/management-course/${course.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="w-4 h-4 mr-1" />
                                                Detail
                                            </Button>
                                        </Link>
                                        <Link href={`/management-course/edit/${course.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDelete
                                            title="Hapus Course?"
                                            description={`Apakah Anda yakin ingin menghapus course "${course.title}"? Tindakan ini tidak dapat dibatalkan.`}
                                            action={() => handleDelete(course.id)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === "table" && (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Gambar</TableHead>
                                            <TableHead>Nama Course</TableHead>
                                            <TableHead className="hidden md:table-cell">Pertemuan</TableHead>
                                            <TableHead className="hidden sm:table-cell">Harga</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>
                                                    <div className="w-14 h-10 rounded-md bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden">
                                                        {course.image ? (
                                                            <img
                                                                src={`storage/${course.image}`}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Image className="w-5 h-5 text-primary/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{course.title}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                                            {course.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-primary" />
                                                            {course.total_meeting}x
                                                        </div>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            {course.weekly_meeting_count}x/minggu
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="font-semibold text-primary">
                                                        {formatCurrency(course.price)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.state === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {course.state === "active" ? "Aktif" : "Nonaktif"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/management-course/${course.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/management-course/${course.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDelete
                                                            title="Hapus Course?"
                                                            description={`Apakah Anda yakin ingin menghapus course "${course.title}"? Tindakan ini tidak dapat dibatalkan.`}
                                                            action={() => handleDelete(course.id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {props.courses.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.courses.from} - {props.courses.to} dari {props.courses.total} course
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.courses.prev_page_url || '#'}
                                        className={!props.courses.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {/* First page */}
                                {props.courses.current_page > 2 && (
                                    <>
                                        <PaginationItem className="hidden sm:block">
                                            <PaginationLink href={`/management-course?page=1`}>
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        {props.courses.current_page > 3 && (
                                            <PaginationItem className="hidden sm:block">
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                    </>
                                )}

                                {/* Previous page */}
                                {props.courses.current_page > 1 && (
                                    <PaginationItem className="hidden sm:block">
                                        <PaginationLink href={props.courses.prev_page_url || '#'}>
                                            {props.courses.current_page - 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Current page */}
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.courses.current_page}
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Next page */}
                                {props.courses.current_page < props.courses.last_page && (
                                    <PaginationItem className="hidden sm:block">
                                        <PaginationLink href={props.courses.next_page_url || '#'}>
                                            {props.courses.current_page + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Last page */}
                                {props.courses.current_page < props.courses.last_page - 1 && (
                                    <>
                                        {props.courses.current_page < props.courses.last_page - 2 && (
                                            <PaginationItem className="hidden sm:block">
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem className="hidden sm:block">
                                            <PaginationLink href={`/management-course?page=${props.courses.last_page}`}>
                                                {props.courses.last_page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href={props.courses.next_page_url || '#'}
                                        className={!props.courses.next_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
