import { useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Search,
    BookOpen,
    School,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Eye,
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

interface Props {
    enrolments: Enrolment[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Kelas',
        href: '/riwayat-enrolment-member',
    },
];

export default function MemberEnrolmentHistory({ enrolments }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedEnrolment, setSelectedEnrolment] = useState<Enrolment | null>(null);

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
                    className: 'bg-green-100 text-green-700',
                    icon: CheckCircle,
                };
            case 'completed':
                return {
                    label: 'Selesai',
                    className: 'bg-blue-100 text-blue-700',
                    icon: CheckCircle,
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    className: 'bg-red-100 text-red-700 ',
                    icon: XCircle,
                };
            case 'on_progress':
                return {
                    label: 'Sedang Berjalan',
                    className: 'bg-yellow-100 text-yellow-700',
                    icon: Clock,
                };
            default:
                return {
                    label: state || '-',
                    className: 'bg-gray-100 text-gray-700',
                    icon: Clock,
                };
        }
    };

    const openReportDialog = (enrolment: Enrolment) => {
        setSelectedEnrolment(enrolment);
        setReportDialogOpen(true);
    };

    const totalEnrolments = enrolments.length;
    const activeEnrolments = enrolments.filter(e => e.state === 'active' || e.state === 'on_progress').length;
    const completedEnrolments = enrolments.filter(e => e.state === 'completed').length;
    const totalAttendance = enrolments.reduce((sum, e) => sum + e.attendance_count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Kelas" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Riwayat Kelas
                    </h1>
                    <p className="text-muted-foreground">
                        Riwayat pendaftaran kursus dan laporan dari coach
                    </p>
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
                            Daftar Enrolment
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
                                        <TableHead>Laporan</TableHead>
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
                                                    {enrolment.report_member ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openReportDialog(enrolment)}
                                                            className="gap-1"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            <span className="hidden sm:inline">Lihat</span>
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
                                                    ? "Belum ada riwayat enrolment"
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

            {/* Report View Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Laporan dari Coach
                        </DialogTitle>
                        <DialogDescription>
                            Laporan untuk enrolment <strong>{selectedEnrolment?.course_title}</strong> - <strong>{selectedEnrolment?.class_title}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedEnrolment?.report_member}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
