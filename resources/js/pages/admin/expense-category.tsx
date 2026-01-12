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
    Tag,
    HandCoins
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

interface ExpenseCategory {
    id: number;
    name: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori Pengeluaran',
        href: '/kategori-pengeluaran',
    },
];

export default function ExpenseCategoryManagement(props: { expensesCategory: any }) {
    const [searchQuery, setSearchQuery] = useState("");

    const categories: ExpenseCategory[] = props.expensesCategory.data;

    const filteredCategories = categories.filter((c) => {
        return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleDelete = (id: number) => {
        router.delete(`/kategori-pengeluaran/delete/${id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Pengeluaran" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Kategori Pengeluaran
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola kategori untuk pengeluaran
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/kategori-pengeluaran/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kategori
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <HandCoins className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{categories.length}</div>
                                <div className="text-sm text-muted-foreground">Total Kategori</div>
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
                                    placeholder="Cari kategori..."
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
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Tag className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(category.created_at)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link href={`/kategori-pengeluaran/edit/${category.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDelete
                                                        title="Hapus Kategori?"
                                                        description={`Apakah Anda yakin ingin menghapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`}
                                                        action={() => handleDelete(category.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCategories.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Tidak ada kategori ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {props.expensesCategory.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {props.expensesCategory.from} - {props.expensesCategory.to} dari {props.expensesCategory.total} kategori
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={props.expensesCategory.prev_page_url || '#'}
                                        className={!props.expensesCategory.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {props.expensesCategory.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={props.expensesCategory.next_page_url || '#'}
                                        className={!props.expensesCategory.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
