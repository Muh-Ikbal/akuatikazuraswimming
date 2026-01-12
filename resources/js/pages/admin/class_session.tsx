import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Users,
    Edit,
    Search,
    Phone,
    Calendar,
    Eye,
    User,
    Image as ImageIcon,
    Building
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import AlertDelete from "@/components/alert-delete";

interface ClassSession {
    id: number;
    title: string;
    course_id: number;
    course?: {
        id: number,
        title: string,
    };
    coach_id: number
    coach?: {
        id: number,
        name: string,
    };
    capacity: number;
    created_at: string;
}

interface TotalStudent {
    class_session_id: number;


}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelas Management',
        href: '/management-kelas',
    },
];

export default function CoachManagement(props: { class_session: any, total_student: any }) {
    const [searchQuery, setSearchQuery] = useState("");

    const class_sessions: ClassSession[] = props.class_session.data;
    const total_student: TotalStudent[] = props.total_student;

    const filteredClassSessions = class_sessions.filter((c) => {
        const matchesSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.course?.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });


    const handleDelete = (id: number) => {
        router.delete(`/management-kelas/${id}`);
    };

    // Stats
    const totalClass = class_sessions.length;
    // const studentPerClass = 
    const totalStudents = total_student.length;
    const totalCapacity = class_sessions.reduce((total, session) => total + session.capacity, 0);
    const availableCapacity = totalCapacity - totalStudents;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coach Management" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Kelas
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data kelas renang
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/management-kelas/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kelas
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Building className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalClass}</div>
                                <div className="text-sm text-muted-foreground">Total Kelas</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalCapacity}</div>
                                <div className="text-sm text-muted-foreground">Total Kapasitas</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalStudents}</div>
                                <div className="text-sm text-muted-foreground">Total Siswa</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{availableCapacity}</div>
                                <div className="text-sm text-muted-foreground">Kapasitas Tersisa</div>
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
                                    placeholder="Cari coach..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead className="hidden md:table-cell">Course</TableHead>
                                        <TableHead>Coach</TableHead>
                                        <TableHead className="hidden sm:table-cell">Kapasitas</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClassSessions.map((class_session) => (
                                        <TableRow key={class_session.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium">{class_session.title}</p>
                                                        <p className="text-xs text-muted-foreground md:hidden">
                                                            {total_student.map((s) => s.class_session_id === class_session.id).length}/{class_session.capacity}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <p className="font-medium">{class_session.course?.title}</p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    {class_session.coach?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                    {total_student.map((s) => s.class_session_id === class_session.id).length}/{class_session.capacity}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">

                                                    <Link href={`/management-kelas/edit/${class_session.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDelete
                                                        title="Hapus Kelas?"
                                                        description={`Apakah Anda yakin ingin menghapus ${class_session.title}? Tindakan ini tidak dapat dibatalkan.`}
                                                        action={() => handleDelete(class_session.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredClassSessions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Tidak ada kelas ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.class_session.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.class_session.from} - {props.class_session.to} dari {props.class_session.total} kelas
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.class_session.prev_page_url || '#'}
                                        className={!props.class_session.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.class_session.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.class_session.next_page_url || '#'}
                                        className={!props.class_session.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
