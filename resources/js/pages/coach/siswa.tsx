import { useState, useEffect, useMemo, useRef } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';
import {
    Search,
    Users,
    User,
    Phone,
    ChevronRight,
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

interface ClassEntry {
    class_title: string;
    course_title: string | null;
    enrolment_state: string;
}

interface Student {
    id: number;
    name: string;
    phone: string;
    image: string | null;
    address: string;
    classes: ClassEntry[];
    enrolment_count: number;
}

interface Props {
    students: any;
    stats: {
        total_students: number;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Siswa Saya',
        href: '/siswa-coach',
    },
];

export default function CoachStudents({ students, stats, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? "");
    const isTyping = useRef(false);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTyping.current = true;
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (isTyping.current) {
            setTimeout(() => {
                isTyping.current = false;
            }, 500);
        }
    }, [searchQuery]);

    const debounceSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get('/siswa-coach', {
                    search: query,
                    page: 1,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }, 500),
        []
    );

    useEffect(() => {
        debounceSearch(searchQuery);
        return () => {
            debounceSearch.cancel();
        };
    }, [searchQuery]);

    const studentList: Student[] = students.data;

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
                            Daftar member yang Anda ajar. Tekan untuk melihat riwayat pendaftaran kelas.
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
                                <div className="text-sm text-muted-foreground">Total Member</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, nomor telepon, atau alamat..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={onSearchChange}
                            />
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
                                        <TableHead>Member</TableHead>
                                        <TableHead className="hidden sm:table-cell">No. Telepon</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead className="hidden md:table-cell">Enrolment</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentList.map((student) => (
                                        <TableRow
                                            key={student.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <Link
                                                    href={`/siswa-coach/${student.id}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                                                </Link>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Link href={`/siswa-coach/${student.id}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{student.phone || '-'}</span>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/siswa-coach/${student.id}`}>
                                                    <div className="flex flex-wrap gap-1">
                                                        {student.classes.slice(0, 2).map((cls, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-black"
                                                            >
                                                                {cls.class_title}
                                                            </span>
                                                        ))}
                                                        {student.classes.length > 2 && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                                +{student.classes.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Link href={`/siswa-coach/${student.id}`}>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                        {student.enrolment_count} enrolment
                                                    </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/siswa-coach/${student.id}`}>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {studentList.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                {searchQuery
                                                    ? "Tidak ada member yang sesuai pencarian"
                                                    : "Belum ada member"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {students.from} - {students.to} dari {students.total} member
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={students.prev_page_url || '#'}
                                        className={!students.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {students.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={students.next_page_url || '#'}
                                        className={!students.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
