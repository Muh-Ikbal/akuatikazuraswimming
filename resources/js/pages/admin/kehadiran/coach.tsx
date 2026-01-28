import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ClipboardList,
    Search,
    Calendar,
    UserCog,
    CalendarCheck,
    Trash2,
    Filter,
    X
} from 'lucide-react';
import { useState } from 'react';

interface Attendance {
    id: number;
    employee_name: string;
    role: string;
    class_session: string;
    scan_time: string;
    date: string;
    state: string;
}

interface Props {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total: number;
        today: number;
        this_month: number;
    };
    filters: {
        search: string;
        start_date: string;
        end_date: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kehadiran Pegawai', href: '/kehadiran-coach' },
];

export default function KehadiranPegawai({ attendances, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = () => {
        router.get('/kehadiran-coach', {
            search,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        router.get('/kehadiran-coach');
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data kehadiran ini?')) {
            router.delete(`/kehadiran-coach/${id}`);
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/kehadiran-coach', {
            ...filters,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kehadiran Coach" />
            <div className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-primary" />
                            Kehadiran Pegawai
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data kehadiran pegawai
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <UserCog className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Kehadiran</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Hari Ini</p>
                                <p className="text-2xl font-bold">{stats.today}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bulan Ini</p>
                                <p className="text-2xl font-bold">{stats.this_month}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="p-4 pb-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Sembunyikan' : 'Tampilkan'}
                            </Button>
                        </div>
                    </CardHeader>
                    {showFilters && (
                        <CardContent className="p-4 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama pegawai..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    placeholder="Tanggal Mulai"
                                />
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    placeholder="Tanggal Akhir"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleFilter} className="flex-1">
                                        <Search className="w-4 h-4 mr-2" />
                                        Filter
                                    </Button>
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm">Nama Pegawai</th>
                                        <th className="text-left p-4 font-medium text-sm">Role</th>
                                        <th className="text-left p-4 font-medium text-sm">Kelas</th>
                                        <th className="text-left p-4 font-medium text-sm">Status</th>
                                        <th className="text-left p-4 font-medium text-sm">Waktu Scan</th>
                                        <th className="text-center p-4 font-medium text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {attendances.data.length > 0 ? (
                                        attendances.data.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-muted/30">
                                                <td className="p-4">
                                                    <span className="font-medium">{attendance.employee_name}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-900 text-xs font-medium capitalize">
                                                        {attendance.role == 'coach' ? 'Pelatih' : attendance.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{attendance.class_session}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendance.state === 'present'
                                                        ? 'bg-green-100 text-green-900'
                                                        : 'bg-red-100 text-red-900'
                                                        }`}>
                                                        {attendance.state === 'present' ? 'Hadir' : 'Terlambat'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                                                        <CalendarCheck className="w-3 h-3" />
                                                        {attendance.scan_time}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(attendance.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                <p>Tidak ada data kehadiran</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {attendances.last_page > 1 && (
                            <div className="flex items-center justify-between p-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {attendances.data.length} dari {attendances.total} data
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={attendances.current_page === 1}
                                        onClick={() => handlePageChange(attendances.current_page - 1)}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={attendances.current_page === attendances.last_page}
                                        onClick={() => handlePageChange(attendances.current_page + 1)}
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
