// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid,UserCheck,UserCog, Users, BookOpen, Calendar, School, Banknote, Contact, HandCoins, PiggyBank, Landmark } from 'lucide-react';
import AppLogo from './app-logo';


const mainNavItems: NavGroup[] = [
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
        title:'PESERTA',
        items:[
            {
                title: 'Peserta',
                href: '/management-peserta',
                icon: Users,
            },
            {
                title: 'Coach',
                href: '/management-coach',
                icon: UserCog,
            },
            {
                title: 'Member',
                href: '/management-member',
                icon: UserCheck,
            },
            {
                title: 'Jadwal',
                href: '/management-jadwal',
                icon: Calendar,
            },
        ]
    },
    {
        title:'MASTER DATA',
        items :[
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
                href: 'management-user',
                icon: Contact,
            },
        ]
    },{
        title:'KEUANGAN',
        items:[
            {
                title: 'Pengeluaran',
                href: 'management-pengeluaran',
                icon: Banknote,
            },
            {
                title: 'Pemasukan',
                href: 'management-pemasukan',
                icon: PiggyBank,
            },
            {
                title: 'Laporan Keuangan',
                href: 'laporan-keuangan',
                icon: Landmark,
            },
        ]
    }

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className='px-6 py-5 border-b'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain group={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
