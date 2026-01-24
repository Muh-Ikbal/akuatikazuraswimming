import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Edit,
    User,
    Banknote,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Wallet
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
import DialogPayment from "./payment/dialog-payment";
import AlertCancelPayment from "@/components/alert-cancel-payment";

interface Payment {
    id: number;
    enrolment_course_id: number;
    amount: number;
    amount_paid: number;
    payment_method: string;
    state: 'pending' | 'paid' | 'partial_paid' | 'failed';
    enrolment_course?: {
        id: number;
        member?: {
            id: number;
            name: string;
        };
        course?: {
            id: number;
            title: string;
        };
    };
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Management Pembayaran',
        href: '/management-pembayaran',
    },
];

interface Props {
    payments: any;
    filters: any;
    totalIncome: number;
    pendingAmount: number;
    totalPaidCount: number;
}

export default function PaymentManagement({ payments, filters, totalIncome, pendingAmount, totalPaidCount }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? "");
    const [page, setPage] = useState(payments.current_page)
    const [filterState, setFilterState] = useState<string>("all");
    const isTyping = useRef(false);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isTyping.current = true;
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (isTyping.current) {
            setPage(1);
            isTyping.current = false;
        }
    }, [searchQuery]);

    const debounceSearch = useMemo(
        () =>
            debounce((query: string, page: number) => {
                router.get('/management-pembayaran', {
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

    const paymentList: Payment[] = payments.data;

    const filteredPayments = paymentList.filter((p) => {

        const matchesState = filterState === "all" || p.state === filterState;
        return matchesState;
    });

    const handleDelete = (id: number) => {
        router.delete(`/management-pembayaran/${id}`);
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

    const getStateDisplay = (state: string) => {
        switch (state) {
            case 'pending':
                return {
                    label: 'Pending',
                    icon: <Clock className="w-3 h-3" />,
                    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 '
                };
            case 'partial_paid':
                return {
                    label: 'Belum Lunas',
                    icon: <Clock className="w-3 h-3" />,
                    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 '
                };
            case 'paid':
                return {
                    label: 'Lunas',
                    icon: <CheckCircle className="w-3 h-3" />,
                    className: 'bg-green-100 text-green-700 dark:bg-green-900/30'
                };
            case 'failed':
                return {
                    label: 'Batal',
                    icon: <XCircle className="w-3 h-3" />,
                    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 '
                };
            default:
                return {
                    label: state,
                    icon: null,
                    className: 'bg-gray-100 text-gray-700'
                };
        }
    };

    // Stats
    const paidCount = paymentList.filter(p => p.state === 'paid').length;
    const pendingCount = paymentList.filter(p => p.state === 'pending').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Management Pembayaran" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Management Pembayaran
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pembayaran kursus
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/management-pembayaran/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Payment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                                <div className="text-sm text-muted-foreground">Total Pemasukan</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
                                <div className="text-sm text-muted-foreground">Belum Terbayar</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalPaidCount}</div>
                                <div className="text-sm text-muted-foreground">Lunas</div>
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
                                    placeholder="Cari member, course, atau metode..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={onSearchChange}
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                                    value={filterState}
                                    onChange={(e) => setFilterState(e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Lunas</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Batal</option>
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
                                        <TableHead className="hidden md:table-cell">Course</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead className="hidden sm:table-cell">Terbayar</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => {
                                        const stateDisplay = getStateDisplay(payment.state);
                                        return (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{payment.enrolment_course?.member?.name}</p>
                                                            <p className="text-xs text-muted-foreground md:hidden">
                                                                {payment.enrolment_course?.course?.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className="text-sm">{payment.enrolment_course?.course?.title}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Banknote className="w-4 h-4 text-green-600" />
                                                        <span className="font-semibold text-green-600">
                                                            {formatCurrency(payment.amount)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Banknote className="w-4 h-4 text-green-600" />
                                                        <span className="font-semibold text-green-600">
                                                            {formatCurrency(payment.amount_paid)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{payment.payment_method}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stateDisplay.className}`}>
                                                        {stateDisplay.icon}
                                                        {stateDisplay.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatDate(payment.created_at)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {
                                                            payment.state !== 'paid' && payment.state !== 'failed' ? (
                                                                <>
                                                                    <DialogPayment payment={payment} />
                                                                    <AlertCancelPayment title="Batal Pembayaran?" description={`Apakah Anda yakin ingin membatalkan pembayaran ini? Tindakan ini tidak dapat dibatalkan.`} action={() => router.put(`/management-pembayaran/fail/${payment.id}`)} />

                                                                </>
                                                            ) : null
                                                        }
                                                        {payment.state !== 'failed' && (
                                                            <Link href={`/management-pembayaran/edit/${payment.id}`}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {payment.state !== 'paid' && (
                                                            <AlertDelete
                                                                title="Hapus Payment?"
                                                                description={`Apakah Anda yakin ingin menghapus payment ini? Tindakan ini tidak dapat dibatalkan.`}
                                                                action={() => handleDelete(payment.id)}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredPayments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Tidak ada payment ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>


                {/* Pagination */}
                {payments.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan {payments.from} - {payments.to} dari {payments.total} payment
                        </p>
                        <Pagination className="order-1 sm:order-2">
                            <PaginationContent className="flex-wrap justify-center gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={payments.prev_page_url || '#'}
                                        className={!payments.prev_page_url ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {payments.current_page}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href={payments.next_page_url || '#'}
                                        className={!payments.next_page_url ? 'pointer-events-none opacity-50' : ''}
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
