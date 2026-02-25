import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Search,
    User,
    Phone,
    MapPin,
    BookOpen,
    School,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

interface MemberData {
    id: number;
    name: string;
    phone: string;
    image: string | null;
    address: string;
    gender: string;
    birth_date: string;
}

interface Props {
    member: MemberData;
    enrolments: Enrolment[];
}

export default function RiwayatEnrolment({ member, enrolments }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedEnrolment, setSelectedEnrolment] = useState<Enrolment | null>(null);

    const form = useForm({
        report_member: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Siswa Saya',
            href: '/siswa-coach',
        },
        {
            title: `Riwayat Kelas - ${member.name}`,
            href: `/siswa-coach/${member.id}`,
        },
    ];

    const filteredEnrolments = enrolments.filter((enrolment) => {
        const query = searchQuery.toLowerCase();
        return (
            enrolment.course_title.toLowerCase().includes(query) ||
            enrolment.class_title.toLowerCase().includes(query)
        );
    });

    const getStateDisplay = (state: string) => {
        switch (state) {
            case 'active':
                return {
                    label: 'Aktif',
                    className: 'bg-green-100 text-green-700 ',
                    icon: CheckCircle,
                };
            case 'completed':
                return {
                    label: 'Selesai',
                    className: 'bg-blue-100 text-blue-700 ',
                    icon: CheckCircle,
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    className: 'bg-red-100 text-red-700 ',
                    icon: XCircle,
                };
            default:
                return {
                    label: state || '-',
                    className: 'bg-gray-100 text-gray-700 ',
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
        form.post(`/siswa-coach/${selectedEnrolment.id}/report`, {
            preserveScroll: true,
            onSuccess: () => {
                setReportDialogOpen(false);
                setSelectedEnrolment(null);
            },
        });
    };

    const totalEnrolments = enrolments.length;
    const activeEnrolments = enrolments.filter(e => e.state === 'active').length;
    const totalAttendance = enrolments.reduce((sum, e) => sum + e.attendance_count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Riwayat Kelas - ${member.name}`} />
            <div className="p-6 space-y-6">
                {/* Back button + Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/siswa-coach"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input bg-background hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Riwayat Kelas
                        </h1>
                        <p className="text-muted-foreground">
                            Detail pendaftaran kursus member
                        </p>
                    </div>
                </div>

                {/* Member Info Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {member.image ? (
                                    <img
                                        src={`/storage/${member.image}`}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-primary" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h2 className="text-xl font-bold">{member.name}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {member.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="w-4 h-4 flex-shrink-0" />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.address && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{member.address}</span>
                                        </div>
                                    )}
                                    {member.gender && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4 flex-shrink-0" />
                                            <span>{member.gender === 'male' ? 'Laki-laki' : member.gender === 'female' ? 'Perempuan' : member.gender}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalEnrolments}</div>
                                <div className="text-sm text-muted-foreground">Total Pendaftaran</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{activeEnrolments}</div>
                                <div className="text-sm text-muted-foreground">Aktif</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{totalAttendance}</div>
                                <div className="text-sm text-muted-foreground">Total Kehadiran</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kursus atau kelas..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Enrolment Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Daftar Kelas
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
                                        <TableHead className="hidden lg:table-cell">Tanggal Daftar</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEnrolments.map((enrolment) => {
                                        const stateDisplay = getStateDisplay(enrolment.state);
                                        const StateIcon = stateDisplay.icon;
                                        return (
                                            <TableRow key={enrolment.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                        <span className="font-medium">{enrolment.course_title}</span>
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
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stateDisplay.className}`}>
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
                                                                    <span className="hidden sm:inline">Edit Laporan</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FileText className="w-3 h-3" />
                                                                    <span className="hidden sm:inline">Tambah Laporan</span>
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
                                    {filteredEnrolments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                {enrolments.length === 0
                                                    ? "Belum ada enrolment untuk member ini"
                                                    : "Tidak ada enrolment yang sesuai pencarian"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
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
