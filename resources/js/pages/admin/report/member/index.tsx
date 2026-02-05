import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from 'react';
import { Filter, RefreshCcw, Download } from 'lucide-react';

interface MemberReportItem {
    id: number;
    joined_date: string;
    name: string;
    description: string;
    amount: number;
    remaining_sessions: number;
    status: string;
}

interface Props {
    data: MemberReportItem[];
    filters: {
        start_date: string;
        end_date: string;
        status: string | null;
    };
}

export default function MemberReport({ data, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [status, setStatus] = useState(filters.status || '');

    const handleApplyFilter = () => {
        router.get('/laporan-member', {
            start_date: startDate,
            end_date: endDate,
            status: status
        }, { preserveState: true });
    };

    const handleResetFilter = () => {
        setStartDate('');
        setEndDate('');
        setStatus('');
        router.get('/laporan-member');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Laporan Member', href: '/laporan-member' }]}>
            <Head title="Laporan Member" />
            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Laporan Member</h1>
                        <p className="text-muted-foreground">Laporan data member berdasarkan enrolment</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Filter Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4 items-end">
                            <div className="space-y-2 w-full lg:w-auto">
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 w-full lg:w-auto">
                                <label className="text-sm font-medium">Tanggal Akhir</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 w-full lg:w-auto">
                                <label className="text-sm font-medium">Status Membership</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="on_progress">Berlangsung</option>
                                    <option value="completed">Selesai</option>
                                </select>
                            </div>
                            <div className="flex gap-2 lg:gap-4">
                                <Button onClick={handleApplyFilter}>
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                                <Button variant="outline" onClick={handleResetFilter}>
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button variant="secondary" asChild>
                                    <a href={`/laporan-member/export?start_date=${startDate}&end_date=${endDate}&status=${status}`}>
                                        <div className="flex items-center">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </div>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal Pembayaran</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead>Jumlah Bayar</TableHead>
                                    <TableHead>Jumlah Pertemuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{formatDate(item.joined_date)}</TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                                            <TableCell>{item.remaining_sessions}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data ditemukan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
