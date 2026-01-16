import { useState, useEffect } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePage } from '@inertiajs/react';
import { AlerInformation } from "@/components/alert-information";
import {
    Plus,
    Search,
    Edit,
    User,
    BookOpen,
    Building,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
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

interface Enrolment {
    id: number;
    member_id: number;
    class_session_id: number;
    course_id: number;
    state: 'on_progress' | 'completed' | 'cancelled';
    member?: {
        id: number;
        name: string;
    };
    class_session?: {
        id: number;
        title: string;
    };
    course?: {
        id: number;
        title: string;
        price: number;
    };
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrolment Management',
        href: '/management-enrolment',
    },
];

export default function EnrolmentManagement(props: { enrolments: any }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterState, setFilterState] = useState<string>("all");
    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash.success || flash.error) {
            setTimeout(() => {
                router.reload();
            }, 5000);
        }
    }, [flash]);



    const enrolments: Enrolment[] = props.enrolments.data;

    const filteredEnrolments = enrolments.filter((e) => {
        const matchesSearch =
            e.member?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.class_session?.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = filterState === "all" || e.state === filterState;
        return matchesSearch && matchesState;
    });

    const handleDelete = (id: number) => {
        router.delete(`/management-enrolment/${id}`);
    };

    const getStateDisplay = (state: string) => {
        switch (state) {
            case 'on_progress':
                return {
                    label: 'Berlangsung',
                    icon: <Clock className="w-3 h-3" />,
                    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                };
            case 'completed':
                return {
                    label: 'Selesai',
                    icon: <CheckCircle className="w-3 h-3" />,
                    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    icon: <XCircle className="w-3 h-3" />,
                    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                };
            default:
                return {
                    label: state,
                    icon: <AlertCircle className="w-3 h-3" />,
                    className: 'bg-gray-100 text-gray-700'
                };
        }
    };

    // Stats
    const totalEnrolments = enrolments.length;
    const onProgressCount = enrolments.filter(e => e.state === 'on_progress').length;
    const completedCount = enrolments.filter(e => e.state === 'completed').length;
    const cancelledCount = enrolments.filter(e => e.state === 'cancelled').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrolment Management" />
            <div className="p-6 space-y-6">
                <AlerInformation flash={flash} />
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Enrolment
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pendaftaran siswa ke kelas
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/management-enrolment/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Enrolment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalEnrolments}</div>
                                <div className="text-sm text-muted-foreground">Total Enrolment</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{onProgressCount}</div>
                                <div className="text-sm text-muted-foreground">Berlangsung</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{completedCount}</div>
                                <div className="text-sm text-muted-foreground">Selesai</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{cancelledCount}</div>
                                <div className="text-sm text-muted-foreground">Dibatalkan</div>
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
                                    placeholder="Cari member, kelas, atau course..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterState}
                                    onChange={(e) => setFilterState(e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="on_progress">Berlangsung</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
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
                                        <TableHead>Member</TableHead>
                                        <TableHead className="hidden md:table-cell">Kelas</TableHead>
                                        <TableHead className="hidden lg:table-cell">Course</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEnrolments.map((enrolment) => {
                                        const stateDisplay = getStateDisplay(enrolment.state);
                                        return (
                                            <TableRow key={enrolment.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{enrolment.member?.name}</p>
                                                            <p className="text-xs text-muted-foreground md:hidden">
                                                                {enrolment.class_session?.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Building className="w-4 h-4 text-muted-foreground" />
                                                        <span>{enrolment.class_session?.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                        <span>{enrolment.course?.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stateDisplay.className}`}>
                                                        {stateDisplay.icon}
                                                        {stateDisplay.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/management-enrolment/edit/${enrolment.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDelete
                                                            title="Hapus Enrolment?"
                                                            description={`Apakah Anda yakin ingin menghapus enrolment ${enrolment.member?.name}? Tindakan ini tidak dapat dibatalkan.`}
                                                            action={() => handleDelete(enrolment.id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredEnrolments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Tidak ada enrolment ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.enrolments.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.enrolments.from} - {props.enrolments.to} dari {props.enrolments.total} enrolment
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.enrolments.prev_page_url || '#'}
                                        className={!props.enrolments.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.enrolments.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.enrolments.next_page_url || '#'}
                                        className={!props.enrolments.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
