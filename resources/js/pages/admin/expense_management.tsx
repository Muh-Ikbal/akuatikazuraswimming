import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Edit,
    Banknote,
    Tag,
    TrendingDown
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

interface Expense {
    id: number;
    name: string;
    description: string;
    amount: number;
    expense_category_id: number;
    expense_category?: {
        id: number;
        name: string;
    };
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Pengeluaran',
        href: '/management-pengeluaran',
    },
];

export default function ExpenseManagement(props: { expenses: any, expense_count: number, expense_amount: number }) {
    const [searchQuery, setSearchQuery] = useState("");

    const expenses: Expense[] = props.expenses.data;

    const filteredExpenses = expenses.filter((e) => {
        return e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.expense_category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleDelete = (id: number) => {
        router.delete(`/management-pengeluaran/${id}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Total expenses
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Management Pengeluaran" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Management Pengeluaran
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pengeluaran operasional
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/management-pengeluaran/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Pengeluaran
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-red-600">{formatCurrency(props.expense_amount)}</div>
                                <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Banknote className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{props.expense_count}</div>
                                <div className="text-sm text-muted-foreground">Total Transaksi</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau kategori..."
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
                                        <TableHead>Nama</TableHead>
                                        <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredExpenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{expense.name}</p>
                                                    {expense.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                            {expense.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground sm:hidden">
                                                        {expense.expense_category?.name}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">{expense.expense_category?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Banknote className="w-4 h-4 text-red-600" />
                                                    <span className="font-semibold text-red-600">
                                                        {formatCurrency(expense.amount)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(expense.created_at)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={`/management-pengeluaran/${expense.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDelete
                                                        title="Hapus Pengeluaran?"
                                                        description={`Apakah Anda yakin ingin menghapus pengeluaran "${expense.name}"? Tindakan ini tidak dapat dibatalkan.`}
                                                        action={() => handleDelete(expense.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredExpenses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Tidak ada pengeluaran ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.expenses.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.expenses.from} - {props.expenses.to} dari {props.expenses.total} pengeluaran
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.expenses.prev_page_url || '#'}
                                        className={!props.expenses.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.expenses.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.expenses.next_page_url || '#'}
                                        className={!props.expenses.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
