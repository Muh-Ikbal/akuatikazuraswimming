import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ClipboardCheck,
    Search,
    Calendar,
    Users,
    CalendarCheck,
    Trash2,
    Filter,
    X,
    Plus,
    Pencil,
    Save
} from 'lucide-react';
import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

interface Attendance {
    id: number;
    member_name: string;
    class_session: string;
    course: string;
    coach: string;
    scan_time: string;
    date: string;
}

interface ClassSession {
    id: number;
    title: string;
}

interface Props {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    class_sessions: ClassSession[];
    stats: {
        total: number;
        today: number;
        this_month: number;
    };
    filters: {
        search: string;
        start_date: string;
        end_date: string;
        class_session_id: string;
    };
    members: { user_id: number; name: string }[];
    schedules: { id: number; title: string; class_session_id: number }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kehadiran Member', href: '/kehadiran-member' },
];

export default function KehadiranMember({ attendances, class_sessions, stats, filters, members, schedules }: Props) {
    const { auth } = usePage<any>().props;
    const isSuperAdmin = auth.user.roles.some((role: any) => role.name === 'super_admin');

    const [search, setSearch] = useState(filters.search);
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [classSessionId, setClassSessionId] = useState(filters.class_session_id);
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

    // Form for Create
    const createForm = useForm({
        user_id: '',
        scan_time: '',
        schedule_id: '',
    });

    // Form for Edit
    const editForm = useForm({
        scan_time: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/kehadiran-member', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditClick = (attendance: Attendance) => {
        setSelectedAttendance(attendance);
        editForm.setData({
            scan_time: format(new Date(attendance.scan_time), "yyyy-MM-dd'T'HH:mm"),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAttendance) return;

        editForm.put(`/kehadiran-member/${selectedAttendance.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setSelectedAttendance(null);
            },
        });
    };

    const handleFilter = () => {
        router.get('/kehadiran-member', {
            search,
            start_date: startDate,
            end_date: endDate,
            class_session_id: classSessionId,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setClassSessionId('');
        router.get('/kehadiran-member');
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data kehadiran ini?')) {
            router.delete(`/kehadiran-member/${id}`);
        }
    };

    const handlePageChange = (page: number) => {
        router.get('/kehadiran-member', {
            ...filters,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kehadiran Member" />
            <div className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <ClipboardCheck className="w-6 h-6 text-primary" />
                            Kehadiran Member
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data kehadiran member
                        </p>
                    </div>
                    {isSuperAdmin && (
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Kehadiran
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kehadiran Member</DialogTitle>
                                    <DialogDescription>
                                        Masukkan data kehadiran member secara manual.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="member">Member</Label>
                                        <Select
                                            onValueChange={(val) => createForm.setData('user_id', val)}
                                            defaultValue={createForm.data.user_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members.map((member) => (
                                                    <SelectItem key={member.user_id} value={member.user_id.toString()}>
                                                        {member.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.user_id && <span className="text-destructive text-sm">{createForm.errors.user_id}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="schedule">Jadwal Kelas</Label>
                                        <Select
                                            onValueChange={(val) => createForm.setData('schedule_id', val)}
                                            defaultValue={createForm.data.schedule_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Jadwal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schedules.map((sch) => (
                                                    <SelectItem key={sch.id} value={sch.id.toString()}>
                                                        {sch.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.schedule_id && <span className="text-destructive text-sm">{createForm.errors.schedule_id}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scan_time">Waktu Kehadiran</Label>
                                        <Input
                                            id="scan_time"
                                            type="datetime-local"
                                            value={createForm.data.scan_time}
                                            onChange={(e) => createForm.setData('scan_time', e.target.value)}
                                        />
                                        {createForm.errors.scan_time && <span className="text-destructive text-sm">{createForm.errors.scan_time}</span>}
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama member..."
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
                                <select
                                    className="h-10 px-3 border rounded-md bg-background text-sm border-input"
                                    value={classSessionId}
                                    onChange={(e) => setClassSessionId(e.target.value)}
                                >
                                    <option value="">Semua Kelas</option>
                                    {class_sessions.map((session) => (
                                        <option key={session.id} value={session.id}>
                                            {session.title}
                                        </option>
                                    ))}
                                </select>
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
                                        <th className="text-left p-4 font-medium text-sm">Member</th>
                                        <th className="text-left p-4 font-medium text-sm">Kelas</th>
                                        <th className="text-left p-4 font-medium text-sm">Kursus</th>
                                        <th className="text-left p-4 font-medium text-sm">Waktu Scan</th>
                                        {isSuperAdmin && (
                                            <th className="text-center p-4 font-medium text-sm">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {attendances.data.length > 0 ? (
                                        attendances.data.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-muted/30">
                                                <td className="p-4">
                                                    <span className="font-medium">{attendance.member_name}</span>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{attendance.class_session}</td>
                                                <td className="p-4 text-muted-foreground">{attendance.course}</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-900 text-xs font-medium">
                                                        <CalendarCheck className="w-3 h-3" />
                                                        {attendance.scan_time}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {isSuperAdmin && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 mr-1"
                                                                onClick={() => handleEditClick(attendance)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDelete(attendance.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                <p>Tidak ada data kehadiran</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Edit Modal */}
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Kehadiran Member</DialogTitle>
                                    <DialogDescription>
                                        Ubah waktu kehadiran member.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_scan_time">Waktu Kehadiran</Label>
                                        <Input
                                            id="edit_scan_time"
                                            type="datetime-local"
                                            value={editForm.data.scan_time}
                                            onChange={(e) => editForm.setData('scan_time', e.target.value)}
                                        />
                                        {editForm.errors.scan_time && <span className="text-destructive text-sm">{editForm.errors.scan_time}</span>}
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={editForm.processing}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Perubahan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

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
