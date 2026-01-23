import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Edit,
    Calendar,
    Phone,
    User,
    Mail,
    CheckCircle,
    XCircle,
    Award
} from 'lucide-react';
import AlertDelete from '@/components/alert-delete';

interface CertificateCoach {
    id: number;
    title: string;
    description: string;
    image: string | null;
    coach_id: number;
}

interface Coach {
    id: number;
    name: string;
    phone_number: string;
    address: string;
    birthplace: string;
    birth_date: string;
    gender: string;
    image: string | null;
    user_id: number | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    certificate_coaches?: CertificateCoach[];
    created_at?: string;
    updated_at?: string;
}

interface ShowCoachProps {
    coach: Coach;
}

export default function ShowCoach({ coach }: ShowCoachProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coach Management',
            href: '/management-coach',
        },
        {
            title: coach.name,
            href: `/management-coach/${coach.id}`,
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
        router.delete(`/management-coach/${coach.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={coach.name} />
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Link href="/management-coach" className="shrink-0">
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                                {coach.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Detail informasi coach
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 ml-12 sm:ml-0">
                        <Link href={`/management-coach/edit/${coach.id}`}>
                            <Button variant="outline" className="h-10">
                                <Edit className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                        </Link>
                        <AlertDelete
                            title="Hapus Coach?"
                            description={`Apakah Anda yakin ingin menghapus ${coach.name}? Tindakan ini tidak dapat dibatalkan.`}
                            action={handleDelete}
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Photo & Status */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    {coach.image ? (
                                        <img
                                            src={`/storage/${coach.image}`}
                                            alt={coach.name}
                                            className="w-32 h-32 rounded-full object-cover mb-4"
                                        />
                                    ) : (
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${coach.gender === 'male'
                                            ? 'bg-blue-100 dark:bg-blue-900/30'
                                            : 'bg-pink-100 dark:bg-pink-900/30'
                                            }`}>
                                            <User className={`w-16 h-16 ${coach.gender === 'male'
                                                ? 'text-blue-600'
                                                : 'text-pink-600'
                                                }`} />
                                        </div>
                                    )}
                                    <h2 className="text-xl font-bold">{coach.name}</h2>
                                    <p className="text-muted-foreground">
                                        {calculateAge(coach.birth_date)} tahun • {coach.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{coach.phone_number}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status Akun</span>
                                    {coach.user ? (
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
                                {coach.user && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span>{coach.user.email}</span>
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
                                        <p className="font-medium">{coach.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Alamat</p>
                                        <p className="font-medium">{coach.address}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Tempat/Tanggal Lahir</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {coach.birthplace}, {formatDate(coach.birth_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                        <p className="font-medium">{coach.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Umur</p>
                                        <p className="font-medium">{calculateAge(coach.birth_date)} tahun</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">No HP</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            {coach.phone_number}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certificates */}
                        <Card>
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    Sertifikat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                {coach.certificate_coaches && coach.certificate_coaches.length > 0 ? (
                                    <div className="grid gap-4">
                                        {coach.certificate_coaches.map((cert) => (
                                            <div key={cert.id} className="flex gap-4 p-4 border rounded-lg">
                                                {cert.image ? (
                                                    <img
                                                        src={`/storage/${cert.image}`}
                                                        alt={cert.title}
                                                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Award className="w-8 h-8 text-primary" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">{cert.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {cert.description || 'Tidak ada deskripsi'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Award className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                        <p>Belum ada sertifikat</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        {(coach.created_at || coach.updated_at) && (
                            <Card>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        {coach.created_at && (
                                            <div>
                                                <p className="text-muted-foreground">Terdaftar pada</p>
                                                <p className="font-medium">{formatDate(coach.created_at)}</p>
                                            </div>
                                        )}
                                        {coach.updated_at && (
                                            <div>
                                                <p className="text-muted-foreground">Terakhir diubah</p>
                                                <p className="font-medium">{formatDate(coach.updated_at)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
