import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Edit,
    Calendar,
    Phone,
    MapPin,
    User,
    Users,
    Mail,
    CheckCircle,
    XCircle,
    BookOpen,
    School,
    Clock,
    FileText,
    Pencil,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AlertDelete from '@/components/alert-delete';

interface Member {
    id: number;
    name: string;
    birth_date: string;
    gender: string;
    address: string;
    phone_number: string;
    birth_place: string;
    entry_date: string;
    parent_name: string;
    parent_phone_number: string;
    user_id: number | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at?: string;
    updated_at?: string;
}

interface Enrolment {
    id: number;
    course_title: string;
    class_title: string;
    meeting_count: number;
    state: string;
    state_member: string | null;
    attendance_count: number;
    report_member: string | null;
    created_at: string;
}

interface ShowMemberProps {
    member: Member;
    enrolments: Enrolment[];
}

export default function ShowMember({ member, enrolments }: ShowMemberProps) {
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedEnrolment, setSelectedEnrolment] = useState<Enrolment | null>(null);

    const form = useForm({
        report_member: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Member Management',
            href: '/management-member',
        },
        {
            title: member.name,
            href: `/management-member/${member.id}`,
        },
    ];

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        router.delete(`/management-member/${member.id}`);
    };

    const getStateDisplay = (state: string) => {
        switch (state) {
            case 'active':
                return {
                    label: 'Aktif',
                    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    icon: CheckCircle,
                };
            case 'completed':
                return {
                    label: 'Selesai',
                    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    icon: CheckCircle,
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    icon: XCircle,
                };
            case 'on_progress':
                return {
                    label: 'Sedang Berjalan',
                    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    icon: Clock,
                };
            default:
                return {
                    label: state || '-',
                    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                    icon: Clock,
                };
        }
    };

    const openReportDialog = (enrolment: Enrolment) => {
        setSelectedEnrolment(enrolment);
        form.setData('report_member', enrolment.report_member || '');
        setReportDialogOpen(true);
    };

    const submitReport = () => {
        if (!selectedEnrolment) return;
        form.post(`/management-member/${member.id}/enrolment/${selectedEnrolment.id}/report`, {
            preserveScroll: true,
            onSuccess: () => {
                setReportDialogOpen(false);
                setSelectedEnrolment(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={member.name} />
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Link href="/management-member" className="shrink-0">
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                                {member.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Detail informasi member
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 ml-12 sm:ml-0">
                        <Link href={`/management-member/edit/${member.id}`}>
                            <Button variant="outline" className="h-10">
                                <Edit className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                        </Link>
                        <AlertDelete
                            title="Hapus Member?"
                            description={`Apakah Anda yakin ingin menghapus ${member.name}? Tindakan ini tidak dapat dibatalkan.`}
                            action={handleDelete}
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Avatar & Status */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${member.gender === 'male'
                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                        : 'bg-pink-100 dark:bg-pink-900/30'
                                        }`}>
                                        <User className={`w-12 h-12 ${member.gender === 'male'
                                            ? 'text-blue-600'
                                            : 'text-pink-600'
                                            }`} />
                                    </div>
                                    <h2 className="text-xl font-bold">{member.name}</h2>
                                    <p className="text-muted-foreground">
                                        {calculateAge(member.birth_date)} tahun • {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{member.phone_number}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status Akun</span>
                                    {member.user ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                            <XCircle className="w-4 h-4" />
                                            Tidak Ada
                                        </span>
                                    )}
                                </div>
                                {member.user && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span>{member.user.email}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Personal Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                        <p className="font-medium">{member.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tempat/Tanggal Lahir</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {member.birth_place},{formatDate(member.birth_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                        <p className="font-medium">{member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Umur</p>
                                        <p className="font-medium">{calculateAge(member.birth_date)} tahun</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">No HP</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            {member.phone_number}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-muted-foreground">Alamat</p>
                                        <p className="font-medium flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                            {member.address}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tanggal Masuk</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {formatDate(member.entry_date)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parent Info */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Informasi Orang Tua / Wali
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Orang Tua</p>
                                        <p className="font-medium">{member.parent_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">No HP Orang Tua</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            {member.parent_phone_number}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Enrolment History */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Riwayat Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Kursus</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead className="hidden sm:table-cell">Pertemuan</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">Kehadiran</TableHead>
                                                <TableHead className="hidden lg:table-cell">Tgl Daftar</TableHead>
                                                <TableHead>Laporan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enrolments.map((enrolment) => {
                                                const stateDisplay = getStateDisplay(enrolment.state);
                                                const StateIcon = stateDisplay.icon;
                                                return (
                                                    <TableRow key={enrolment.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                                <span className="font-medium text-sm">{enrolment.course_title}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <School className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                                <span className="text-sm">{enrolment.class_title}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <span className="text-sm">{enrolment.meeting_count ?? '-'}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stateDisplay.className}`}>
                                                                <StateIcon className="w-3 h-3" />
                                                                {stateDisplay.label}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium">
                                                                    {enrolment.attendance_count}
                                                                    {enrolment.meeting_count ? ` / ${enrolment.meeting_count}` : ''}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell">
                                                            <span className="text-sm text-muted-foreground">
                                                                {enrolment.created_at}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {enrolment.state === 'completed' ? (
                                                                <Button
                                                                    variant={enrolment.report_member ? "outline" : "default"}
                                                                    size="sm"
                                                                    onClick={() => openReportDialog(enrolment)}
                                                                    className="gap-1"
                                                                >
                                                                    {enrolment.report_member ? (
                                                                        <>
                                                                            <Pencil className="w-3 h-3" />
                                                                            <span className="hidden sm:inline">Edit</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FileText className="w-3 h-3" />
                                                                            <span className="hidden sm:inline">Tambah</span>
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {enrolments.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                        Belum ada riwayat enrolment
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {(member.created_at || member.updated_at) && (
                            <Card>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        {member.created_at && (
                                            <div>
                                                <p className="text-muted-foreground">Terdaftar pada</p>
                                                <p className="font-medium">{formatDate(member.created_at)}</p>
                                            </div>
                                        )}
                                        {member.updated_at && (
                                            <div>
                                                <p className="text-muted-foreground">Terakhir diubah</p>
                                                <p className="font-medium">{formatDate(member.updated_at)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedEnrolment?.report_member ? 'Edit Laporan Member' : 'Tambah Laporan Member'}
                        </DialogTitle>
                        <DialogDescription>
                            Laporan untuk enrolment <strong>{selectedEnrolment?.course_title}</strong> - <strong>{selectedEnrolment?.class_title}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            placeholder="Tulis laporan member di sini..."
                            value={form.data.report_member}
                            onChange={(e) => form.setData('report_member', e.target.value)}
                            rows={6}
                            className="resize-none"
                        />
                        {form.errors.report_member && (
                            <p className="text-sm text-red-500">{form.errors.report_member}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setReportDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={submitReport}
                            disabled={form.processing || !form.data.report_member.trim()}
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan Laporan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
