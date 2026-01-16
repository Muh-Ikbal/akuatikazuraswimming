import { LayoutGrid, UserCheck, UserCog, Users, BookOpen, Calendar, School, Banknote, Contact, HandCoins, PiggyBank, Landmark, QrCode } from 'lucide-react';
import { type NavGroup } from '@/types';
import { dashboard } from '@/routes';

const adminNavItems: NavGroup[] = [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },

        ]
    },
    {
        title: 'PESERTA',
        items: [
            {
                title: 'Member',
                href: '/management-member',
                icon: Users,
            },
            {
                title: 'Enrolment',
                href: '/management-enrolment',
                icon: UserCheck,
            },
            {
                title: 'Coach',
                href: '/management-coach',
                icon: UserCog,
            },
            {
                title: 'Jadwal',
                href: '/management-jadwal',
                icon: Calendar,
            },
        ]
    },
    {
        title: 'MASTER DATA',
        items: [
            {
                title: 'Course',
                href: '/management-course',
                icon: BookOpen,
            },
            {
                title: 'Kelas',
                href: '/management-kelas',
                icon: School,
            },
            {
                title: 'Kategori Pengeluaran',
                href: '/kategori-pengeluaran',
                icon: HandCoins,
            },
            {
                title: 'User',
                href: '/management-user',
                icon: Contact,
            },
        ]
    }, {
        title: 'KEUANGAN',
        items: [
            {
                title: 'Pengeluaran',
                href: '/management-pengeluaran',
                icon: Banknote,
            },
            {
                title: 'Pemasukan',
                href: '/management-pemasukan',
                icon: PiggyBank,
            },
            {
                title: 'Laporan Keuangan',
                href: '/laporan-keuangan',
                icon: Landmark,
            },
        ]
    }

];

const memberNavItems: NavGroup[] = [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Jadwal',
                href: '/jadwal-member',
                icon: Calendar,
            },
            {
                title: 'Riwayat Absensi',
                href: '/riwayat-absensi',
                icon: Calendar,
            },
            {
                title: 'QR Code',
                href: '/qr-code',
                icon: QrCode,
            },

        ]
    },

];

const coachNavItems: NavGroup[] = [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Jadwal',
                href: '/jadwal-coach',
                icon: Calendar,
            },
            {
                title: 'Riwayat Absensi',
                href: '/riwayat-absensi-coach',
                icon: Calendar,
            },
            {
                title: 'QR Code',
                href: '/qr-code',
                icon: QrCode,
            },
        ]
    },

];

const operatorNavItems: NavGroup[] = [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Scan QR',
                href: '/scan-qr',
                icon: QrCode,
            },
        ]
    },

];

export { adminNavItems, memberNavItems, coachNavItems, operatorNavItems };