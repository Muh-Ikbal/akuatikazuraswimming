import { useState, useEffect, useMemo, useRef } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from "lodash";
import {
    Plus,
    Download,
    Users,
    Edit,
    Search,
    Phone,
    Calendar,
    Eye,
    User,
    Image as ImageIcon
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
import { AlerInformation } from "@/components/alert-information";

interface Coach {
    id: number;
    name: string;
    phone_number: string;
    birth_date: string;
    gender: string;
    image: string | null;
    user_id: number | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Pelatih',
        href: '/management-coach',
    },
];

export default function CoachManagement(props: { coaches: any, coachStats: any, filters: any }) {
    const [searchQuery, setSearchQuery] = useState(props.filters?.search ?? "");
    const [filterGender, setFilterGender] = useState<string>("all");
    const initialPage = props.coaches.current_page;
    const [page, setPage] = useState<number>(initialPage);
    const { flash } = usePage().props as any;
    const isTyping = useRef(false);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTyping.current = true;
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        if (flash.success || flash.error) {
            setTimeout(() => {
                router.reload();
            }, 5000);
        }
    }, [flash]);


    useEffect(() => {
        if (isTyping.current) {
            setPage(1);
            isTyping.current = false;
        }
    }, [searchQuery]);

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string, page: number) => {
                router.get('/management-coach', {
                    search: query,
                    page: page
                }, {
                    preserveState: true,
                    replace: true,
                })
            }, 500),
        []
    )
    useEffect(() => {
        debouncedSearch(searchQuery, page)

        return () => {
            debouncedSearch.cancel()
        }
    }, [searchQuery, page])


    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();

    // };

    const coaches: Coach[] = props.coaches.data;
    const coachStats: Coach[] = props.coachStats;

    const filteredCoaches = coaches.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone_number.includes(searchQuery);
        const matchesGender =
            filterGender === "all" || c.gender === filterGender;
        return matchesSearch && matchesGender;
    });

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleDelete = (id: number) => {
        router.delete(`/management-coach/${id}`);
    };

    // Stats
    const maleCount = coachStats.filter(c => c.gender === 'male').length;
    const femaleCount = coachStats.filter(c => c.gender === 'female').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Management Kursus" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <AlerInformation flash={flash} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Pelatih
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data pelatih renang
                        </p>
                    </div>
                    <div className="flex gap-3">

                        <Link href="/management-coach/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Pelatih
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{coachStats.length}</div>
                                <div className="text-sm text-muted-foreground">Total Pelatih</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{maleCount}</div>
                                <div className="text-sm text-muted-foreground">Laki-laki</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{femaleCount}</div>
                                <div className="text-sm text-muted-foreground">Perempuan</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex w-full">

                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Cari pelatih..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={onSearchChange}
                                    />

                                </div>

                            </div>

                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterGender}
                                    onChange={(e) => setFilterGender(e.target.value)}
                                >
                                    <option value="all">Semua Gender</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
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
                                        <TableHead>Pelatih</TableHead>
                                        <TableHead className="hidden md:table-cell">Umur</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead className="hidden sm:table-cell">No HP</TableHead>
                                        <TableHead className="hidden lg:table-cell">Email</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCoaches.map((coach) => (
                                        <TableRow key={coach.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {coach.image ? (
                                                        <img
                                                            src={`/storage/${coach.image}`}
                                                            alt={coach.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${coach.gender === 'male'
                                                            ? 'bg-blue-100 dark:bg-blue-900/30'
                                                            : 'bg-pink-100 dark:bg-pink-900/30'
                                                            }`}>
                                                            <User className={`w-5 h-5 ${coach.gender === 'male'
                                                                ? 'text-blue-600'
                                                                : 'text-pink-600'
                                                                }`} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{coach.name}</p>
                                                        <p className="text-xs text-muted-foreground md:hidden">
                                                            {calculateAge(coach.birth_date)} tahun
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    <span>{calculateAge(coach.birth_date)} tahun</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${coach.gender === 'male'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                    }`}>
                                                    {coach.gender === 'male' ? 'L' : 'P'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {coach.phone_number}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm text-muted-foreground">
                                                    {coach.user?.email || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={`/management-coach/${coach.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/management-coach/edit/${coach.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDelete
                                                        title="Hapus Coach?"
                                                        description={`Apakah Anda yakin ingin menghapus ${coach.name}? Tindakan ini tidak dapat dibatalkan.`}
                                                        action={() => handleDelete(coach.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCoaches.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Tidak ada coach ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.coaches.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.coaches.from} - {props.coaches.to} dari {props.coaches.total} coach
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.coaches.prev_page_url || '#'}
                                        className={!props.coaches.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.coaches.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.coaches.next_page_url || '#'}
                                        className={!props.coaches.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
