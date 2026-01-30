import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import AlertDelete from '@/components/alert-delete';

interface Session {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    late_threshold: string;
    alpha_threshold: string | null;
}

interface Props {
    sessions: Session[];
}

export default function EmployeeSessionIndex({ sessions }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        start_time: '',
        end_time: '',
        late_threshold: '',
        alpha_threshold: '',
    });

    const openCreateModal = () => {
        setEditingSession(null);
        reset();
        setIsOpen(true);
    };

    const openEditModal = (session: Session) => {
        setEditingSession(session);
        setData({
            name: session.name,
            start_time: session.start_time.substring(0, 5), // H:i:s -> H:i
            end_time: session.end_time.substring(0, 5),
            late_threshold: session.late_threshold.substring(0, 5),
            alpha_threshold: session.alpha_threshold ? session.alpha_threshold.substring(0, 5) : '',
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSession) {
            put(`/admin/settings/employee-sessions/${editingSession.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post('/admin/settings/employee-sessions', {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/settings/employee-sessions/${id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengaturan Sesi Absensi', href: '/admin/settings/employee-sessions' }]}>
            <Head title="Pengaturan Sesi Absensi" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Sesi Absensi Pegawai</h1>
                        <p className="text-muted-foreground">Atur jadwal sesi absensi dan batas keterlambatan.</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Sesi
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Sesi</TableHead>
                                    <TableHead>Jam Mulai</TableHead>
                                    <TableHead>Jam Selesai</TableHead>
                                    <TableHead>Batas Terlambat</TableHead>
                                    <TableHead>Batas Alpa</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Belum ada sesi absensi yang dibuat.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="font-medium">{session.name}</TableCell>
                                            <TableCell>{session.start_time.substring(0, 5)}</TableCell>
                                            <TableCell>{session.end_time.substring(0, 5)}</TableCell>
                                            <TableCell>
                                                <span className="text-yellow-600 font-medium">
                                                    {session.late_threshold.substring(0, 5)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-red-600 font-medium">
                                                    {session.alpha_threshold ? session.alpha_threshold.substring(0, 5) : '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(session)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <AlertDelete
                                                        title="Hapus Sesi?"
                                                        description={`Apakah anda yakin ingin menghapus sesi "${session.name}"?`}
                                                        action={() => handleDelete(session.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingSession ? 'Edit Sesi' : 'Tambah Sesi Baru'}</DialogTitle>
                            <DialogDescription>
                                Masukkan detail sesi absensi di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Sesi</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Sesi Pagi"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Jam Mulai</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="start_time"
                                            type="time"
                                            className="pl-9"
                                            value={data.start_time}
                                            onChange={e => setData('start_time', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">Jam Selesai</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="end_time"
                                            type="time"
                                            className="pl-9"
                                            value={data.end_time}
                                            onChange={e => setData('end_time', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="late_threshold">Batas Keterlambatan</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                    <Input
                                        id="late_threshold"
                                        type="time"
                                        className="pl-9 border-red-200 focus-visible:ring-red-500"
                                        value={data.late_threshold}
                                        onChange={e => setData('late_threshold', e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Absen setelah jam ini akan dianggap terlambat.</p>
                                {errors.late_threshold && <p className="text-sm text-red-500">{errors.late_threshold}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alpha_threshold">Batas Alpa (Opsional)</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                                    <Input
                                        id="alpha_threshold"
                                        type="time"
                                        className="pl-9 border-red-200 focus-visible:ring-red-600"
                                        value={data.alpha_threshold}
                                        onChange={e => setData('alpha_threshold', e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Lewat jam ini akan dianggap Alpa.</p>
                                {errors.alpha_threshold && <p className="text-sm text-red-500">{errors.alpha_threshold}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={processing}>Simpan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
