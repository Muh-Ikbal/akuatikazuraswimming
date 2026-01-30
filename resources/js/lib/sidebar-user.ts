import { LayoutGrid, UserCheck, UserCog, Users, BookOpen, Calendar, School, Banknote, Contact, HandCoins, PiggyBank, Landmark, QrCode, GraduationCap, Home, Star, Phone, ClipboardCheck, ClipboardList, Percent, ScanBarcode, ScanLine, Eye, History, Image as ImageIcon, Clock } from 'lucide-react';
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
                title: 'Pendaftaran',
                href: '/management-enrolment',
                icon: UserCheck,
            },

            {
                title: 'Jadwal',
                href: '/management-jadwal',
                icon: Calendar,
            },
            {
                title: 'Pembayaran',
                href: '/management-pembayaran',
                icon: PiggyBank,
            },
        ]
    },
    {
        title: 'KEHADIRAN',
        items: [
            {
                title: 'Kehadiran Member',
                href: '/kehadiran-member',
                icon: ClipboardCheck,
            },
            {
                title: 'Kehadiran Pegawai',
                href: '/kehadiran-coach',
                icon: ClipboardList,
            },
        ]
    },
    {
        title: 'MASTER DATA',
        items: [
            {
                title: 'Kursus',
                href: '/management-course',
                icon: BookOpen,
            },
            {
                title: 'Kelas',
                href: '/management-kelas',
                icon: School,
            },
            {
                title: 'Sesi Absensi Pegawai',
                href: '/admin/settings/employee-sessions',
                icon: Clock,
            },
            {
                title: 'Pelatih',
                href: '/management-coach',
                icon: UserCog,
            },
            {
                title: 'Kategori Pengeluaran',
                href: '/kategori-pengeluaran',
                icon: HandCoins,
            },
            {
                title: 'Promo',
                href: '/management-promo',
                icon: Percent,
            },
            {
                title: 'Pengguna',
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
                title: 'Laporan Keuangan',
                href: '/laporan-keuangan',
                icon: Landmark,
            },
        ]
    },
    {
        title: 'MANAJEMEN TAMPILAN',
        items: [
            {
                title: 'Beranda Utama',
                href: '/cms/hero',
                icon: Home,
            },
            {
                title: 'Keunggulan',
                href: '/cms/keunggulan',
                icon: Star,
            },
            {
                title: 'Visi & Misi',
                href: '/cms/visi-misi',
                icon: Eye,
            },
            {
                title: 'Sejarah',
                href: '/cms/sejarah',
                icon: History,
            },
            {
                title: 'Galeri',
                href: '/cms/gallery',
                icon: ImageIcon,
            },
            {
                title: 'Informasi Kontak',
                href: '/cms/kontak',
                icon: Phone,
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
                title: 'QR Code',
                href: '/qr-code',
                icon: QrCode,
            },
            {
                title: 'Scan QR Member',
                href: '/scan-qr-member',
                icon: ScanBarcode,
            },
            {
                title: 'Scan QR Pegawai',
                href: '/scan-qr-pegawai',
                icon: ScanLine,
            }
        ]
    },

];

export { adminNavItems, memberNavItems, coachNavItems, operatorNavItems };