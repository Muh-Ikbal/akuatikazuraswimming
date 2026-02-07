
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { type SharedData, type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, QrCode, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    const menuItems = [
        {
            title: 'Jadwal Saya',
            description: 'Lihat jadwal latihan dan kelas Anda',
            icon: Calendar,
            href: '/jadwal-member',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'Riwayat Absensi',
            description: 'Cek catatan kehadiran Anda',
            icon: Clock,
            href: '/riwayat-absensi',
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'QR Code',
            description: 'Tunjukkan untuk absensi kelas',
            icon: QrCode,
            href: '/qr-code',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                {/* Welcome Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Halo, {auth.user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Selamat datang kembali di Dashboard Anda.
                    </p>
                </div>

                {/* Menu Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.href}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group cursor-pointer relative overflow-hidden">
                                <CardContent className="p-6 flex flex-col h-full gap-4">
                                    <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                        <item.icon className={`h-7 w-7 ${item.color}`} />
                                    </div>

                                    <div className="space-y-2 flex-1">
                                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-sm font-medium text-primary mt-2 group-hover:underline decoration-2 underline-offset-4">
                                        Buka Menu
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>

                                    {/* Decorative background element */}
                                    <div className="absolute -right-6 -bottom-6 opacity-[0.03] transform rotate-12 group-hover:opacity-[0.07] transition-opacity duration-300 pointer-events-none">
                                        <item.icon className="w-32 h-32" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
