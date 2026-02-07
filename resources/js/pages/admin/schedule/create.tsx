import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, Clock, MapPin, School, User } from 'lucide-react';

interface ClassSession {
    id: number;
    title: string;

}

interface Coach {
    id: number;
    name: string;
}

interface Schedule {
    id: number;
    class_session_id: number;
    coach_id: number;
    date: string;
    time: string;
    end_time: string;
    location: string;
    status: string;
}

interface Props {
    schedule?: Schedule;
    class_sessions: ClassSession[];
    coaches: Coach[];
}

export default function CreateSchedule({ schedule, class_sessions, coaches }: Props) {
    const isEdit = !!schedule;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Management Jadwal',
            href: '/management-jadwal',
        },
        {
            title: isEdit ? 'Edit Jadwal' : 'Tambah Jadwal',
            href: isEdit ? `/management-jadwal/${schedule?.id}` : '/management-jadwal/create',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        coach_id: schedule?.coach_id || '',
        class_session_id: schedule?.class_session_id || '',
        date: schedule?.date || '',
        time: schedule?.time || '',
        end_time: schedule?.end_time || '',
        location: schedule?.location || '',
        status: schedule?.status || 'published',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/management-jadwal/${schedule?.id}`);
        } else {
            post('/management-jadwal');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Jadwal" : "Tambah Jadwal"} />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <Link href="/management-jadwal" className="shrink-0">
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                            {isEdit ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {isEdit ? 'Perbarui data jadwal' : 'Buat jadwal kelas baru'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6">
                        {/* Data Jadwal */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Data Jadwal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                                {/* coach */}
                                <div className="space-y-2">
                                    <Label htmlFor="coach_id" className="text-sm">
                                        Pelatih <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="coach_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.coach_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.coach_id}
                                            onChange={(e) => setData('coach_id', parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Pelatih --</option>
                                            {coaches.map((coach) => (
                                                <option key={coach.id} value={coach.id}>
                                                    {coach.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.coach_id && <p className="text-sm text-destructive">{errors.coach_id}</p>}
                                </div>
                                {/* Kelas */}
                                <div className="space-y-2">
                                    <Label htmlFor="class_session_id" className="text-sm">
                                        Kelas <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            id="class_session_id"
                                            className={`w-full h-10 sm:h-11 pl-10 pr-3 border rounded-md bg-background text-sm ${errors.class_session_id ? 'border-destructive' : 'border-input'}`}
                                            value={data.class_session_id}
                                            onChange={(e) => setData('class_session_id', parseInt(e.target.value))}
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {class_sessions.map((session) => (
                                                <option key={session.id} value={session.id}>
                                                    {session.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.class_session_id && <p className="text-sm text-destructive">{errors.class_session_id}</p>}
                                </div>

                                {/* Date & Time */}
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="date" className="text-sm">
                                        Tanggal <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="date"
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.date ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                                    <div className="space-y-2">
                                        <Label htmlFor="time" className="text-sm">
                                            Waktu Mulai <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="time"
                                                type="time"
                                                value={data.time}
                                                onChange={(e) => setData('time', e.target.value)}
                                                className={`h-10 sm:h-11 pl-10 ${errors.time ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                        {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time" className="text-sm">
                                            Waktu Selesai
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                                className={`h-10 sm:h-11 pl-10 ${errors.end_time ? 'border-destructive' : ''}`}
                                            />
                                        </div>
                                        {errors.end_time && <p className="text-sm text-destructive">{errors.end_time}</p>}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm">
                                        Lokasi <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            placeholder="Contoh: Kolam Renang A, Lantai 2"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className={`h-10 sm:h-11 pl-10 ${errors.location ? 'border-destructive' : ''}`}
                                        />
                                    </div>
                                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <select
                                        id="status"
                                        className={`w-full h-10 sm:h-11 px-3 border rounded-md bg-background text-sm ${errors.status ? 'border-destructive' : 'border-input'}`}
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="published">Dijadwalkan</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Dibatalkan</option>
                                    </select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <Link href="/management-jadwal" className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto h-11">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto h-11">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Menyimpan...' : (isEdit ? 'Update Jadwal' : 'Simpan Jadwal')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
