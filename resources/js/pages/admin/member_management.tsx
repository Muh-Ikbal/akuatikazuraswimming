import { useState, useEffect, useMemo, useRef } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Download,
    Users,
    Edit,
    Search,
    Trash2,
    Phone,
    MapPin,
    Calendar,
    Eye,
    UserCircle,
    User
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
import { debounce } from "lodash";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import AlertDelete from "@/components/alert-delete";
import { AlerInformation } from "@/components/alert-information";

interface Member {
    id: number;
    name: string;
    birth_date: string;
    gender: string;
    address: string;
    phone_number: string;
    parent_name: string;
    parent_phone_number: string;
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
        title: 'Member Management',
        href: '/management-member',
    },
];

interface Props {
    members: any;
    filters: any;
    memberStats: any;
}

export default function MemberManagement(props: Props) {
    const [searchQuery, setSearchQuery] = useState(props.filters?.search ?? "");
    const [filterGender, setFilterGender] = useState<string>("all");
    const [page, setPage] = useState<number>(props.members.current_page);

    const { flash } = usePage().props as any;
    useEffect(() => {
        if (flash.success || flash.error) {
            setTimeout(() => {
                router.reload();
            }, 5000);
        }
    }, [flash]);

    // fitur search

    const isTyping = useRef(false);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTyping.current = true;
        setSearchQuery(e.target.value);
    };


    useEffect(() => {
        if (isTyping.current) {
            setTimeout(() => {
                setPage(1);
                isTyping.current = false;
            }, 500);
        }
    }, [searchQuery]);

    const debounceSearch = useMemo(
        () =>
            debounce((query: string, page: number) => {
                router.get('/management-member', {
                    search: query,
                    page: page
                }, {
                    preserveState: true,
                    replace: true

                })
            }, 500),
        []
    )

    useEffect(() => {
        debounceSearch(searchQuery, page);
        return () => {
            debounceSearch.cancel()
        }
    }, [searchQuery, page])

    const members: Member[] = props.members.data;

    const filteredMembers = members.filter((m) => {

        const matchesGender =
            filterGender === "all" || m.gender === filterGender;
        return matchesGender;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/management-member/${id}`);
    };

    const memberStats = props.memberStats;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Member Management" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <AlerInformation flash={flash} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Member
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data siswa kursus renang
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/management-member/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Daftar Member
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{memberStats.total}</div>
                                <div className="text-sm text-muted-foreground">Total Member</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{memberStats.male_count}</div>
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
                                <div className="text-2xl font-bold">{memberStats.female_count}</div>
                                <div className="text-sm text-muted-foreground">Perempuan</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{memberStats.user_count}</div>
                                <div className="text-sm text-muted-foreground">Punya Akun</div>
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
                                    placeholder="Cari member atau orang tua..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={onSearchChange}
                                />
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
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="hidden md:table-cell">Umur</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead className="hidden lg:table-cell">Orang Tua</TableHead>
                                        <TableHead className="hidden sm:table-cell">No HP</TableHead>
                                        <TableHead className="hidden xl:table-cell">Akun</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.gender === 'male'
                                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                                        : 'bg-pink-100 dark:bg-pink-900/30'
                                                        }`}>
                                                        <User className={`w-5 h-5 ${member.gender === 'male'
                                                            ? 'text-blue-600'
                                                            : 'text-pink-600'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground md:hidden">
                                                            {calculateAge(member.birth_date)} tahun
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    <span>{calculateAge(member.birth_date)} tahun</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.gender === 'male'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                                    }`}>
                                                    {member.gender === 'male' ? 'L' : 'P'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div>
                                                    <p className="font-medium text-sm">{member.parent_name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {member.parent_phone_number}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className="text-sm text-muted-foreground">{member.phone_number}</span>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {member.user ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                                                        Tidak Ada
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={`/management-member/${member.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/management-member/edit/${member.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDelete
                                                        title="Hapus Member?"
                                                        description={`Apakah Anda yakin ingin menghapus ${member.name}? Tindakan ini tidak dapat dibatalkan.`}
                                                        action={() => handleDelete(member.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Tidak ada member ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.members.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.members.from} - {props.members.to} dari {props.members.total} member
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.members.prev_page_url || '#'}
                                        className={!props.members.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.members.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.members.next_page_url || '#'}
                                        className={!props.members.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
