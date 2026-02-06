import { useState, useEffect, useCallback } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Download,
    Users,
    Eye,
    Edit,
    Search,
    Filter,
    Trash2,
    LayoutGrid,
    List,
    Mail,
    Shield,
    UserCircle
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
} from "@/components/ui/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AlertDelete from "@/components/alert-delete";

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: { id: number; name: string }[];
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    users: any;
    roles: Role[];
    stats: any;
    filters?: {
        search?: string;
        role?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Pengguna',
        href: '/management-user',
    },
];

const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    coach: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    member: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    operator: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function UserManagement({ users, roles, stats, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [filterRole, setFilterRole] = useState<string>(filters?.role || "all");
    const [viewMode, setViewMode] = useState<"card" | "table">("table");
    const [isInitialMount, setIsInitialMount] = useState(true);

    const userList: User[] = users.data;

    // Server-side search with debounce
    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get('/management-user', {
                search: searchQuery || undefined,
                role: filterRole !== 'all' ? filterRole : undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filterRole]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/management-user/${id}`);
    };

    const getRoleBadge = (roleName: string) => {
        const colorClass = roleColors[roleName] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
                {roleName}
            </span>
        );
    };

    // Count users by role
    // const roleStats = stats.map(role => ({
    //     name: role.name,
    //     count: users.filter(u => u.roles.some(r => r.name === role.name)).length
    // }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pengguna dan hak akses sistem
                        </p>
                    </div>
                    <div className="flex gap-3">

                        <Link href="/management-user/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah User
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4 ">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <div className="text-sm text-muted-foreground">Total User</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 tex t-red-700 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-red-700 " />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.admin_count}</div>
                                <div className="text-sm text-muted-foreground">Admin</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.coach_count}</div>
                                <div className="text-sm text-muted-foreground">Pelatih</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.member_count}</div>
                                <div className="text-sm text-muted-foreground">Member</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.operator_count}</div>
                                <div className="text-sm text-muted-foreground">Operator</div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* {roleStats.map((stat) => ( */}
                    {/* <Card key={stat.name}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.name === 'admin' ? 'bg-red-100 dark:bg-red-900/30' :
                                stat.name === 'coach' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                    stat.name === 'member' ? 'bg-green-100 dark:bg-green-900/30' :
                                        'bg-purple-100 dark:bg-purple-900/30'
                                }`}>
                                <Shield className={`w-6 h-6 ${stat.name === 'admin' ? 'text-red-600' :
                                    stat.name === 'coach' ? 'text-blue-600' :
                                        stat.name === 'member' ? 'text-green-600' :
                                            'text-purple-600'
                                    }`} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.count}</div>
                                <div className="text-sm text-muted-foreground capitalize">{stat.name}</div>
                            </div>
                        </CardContent>
                    </Card> */}
                    {/* ))} */}
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari user..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="all">Semua Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name} className="capitalize">
                                            {role.name}
                                        </option>
                                    ))}
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
                        {userList.map((user) => (
                            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-5">
                                    {/* User Avatar & Name */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                            <UserCircle className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Badge */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles.map((role) => (
                                                <span key={role.id}>
                                                    {getRoleBadge(role.name == 'coach' ? 'Pelatih' : role.name)}
                                                </span>
                                            ))}
                                            {user.roles.length === 0 && (
                                                <span className="text-sm text-muted-foreground">No role assigned</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Bergabung: {formatDate(user.created_at)}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/management-user/edit/${user.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDelete
                                            title="Hapus User?"
                                            description={`Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`}
                                            action={() => handleDelete(user.id)}
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
                                            <TableHead>Nama</TableHead>
                                            <TableHead className="hidden md:table-cell">Email</TableHead>
                                            <TableHead>Jabatan</TableHead>
                                            <TableHead className="hidden sm:table-cell">Bergabung</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userList.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                                            <UserCircle className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="text-muted-foreground">{user.email}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role) => (
                                                            <span key={role.id}>
                                                                {getRoleBadge(role.name)}
                                                            </span>
                                                        ))}
                                                        {user.roles.length === 0 && (
                                                            <span className="text-sm text-muted-foreground">-</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="text-muted-foreground">{formatDate(user.created_at)}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/management-user/edit/${user.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDelete
                                                            title="Hapus User?"
                                                            description={`Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`}
                                                            action={() => handleDelete(user.id)}
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
                {users.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {users.from} - {users.to} dari {users.total} user
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={users.prev_page_url || '#'}
                                        className={!users.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {/* First page */}
                                {users.current_page > 2 && (
                                    <>
                                        <PaginationItem className="hidden sm:block">
                                            <PaginationLink href={`/management-user?page=1`}>
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        {users.current_page > 3 && (
                                            <PaginationItem className="hidden sm:block">
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                    </>
                                )}

                                {/* Previous page */}
                                {users.current_page > 1 && (
                                    <PaginationItem className="hidden sm:block">
                                        <PaginationLink href={users.prev_page_url || '#'}>
                                            {users.current_page - 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Current page */}
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {users.current_page}
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Next page */}
                                {users.current_page < users.last_page && (
                                    <PaginationItem className="hidden sm:block">
                                        <PaginationLink href={users.next_page_url || '#'}>
                                            {users.current_page + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {/* Last page */}
                                {users.current_page < users.last_page - 1 && (
                                    <>
                                        {users.current_page < users.last_page - 2 && (
                                            <PaginationItem className="hidden sm:block">
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem className="hidden sm:block">
                                            <PaginationLink href={`/management-user?page=${users.last_page}`}>
                                                {users.last_page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href={users.next_page_url || '#'}
                                        className={!users.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
