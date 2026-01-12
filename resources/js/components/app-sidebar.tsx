// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
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
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import { adminNavItems, memberNavItems, coachNavItems, operatorNavItems } from '@/lib/sidebar-user';



export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    let navItem = adminNavItems;
    if (auth.user.roles[0].name == 'admin') {
        navItem = adminNavItems;
    } else if (auth.user.roles[0].name == 'member') {
        navItem = memberNavItems;
    } else if (auth.user.roles[0].name == 'coach') {
        navItem = coachNavItems;
    } else if (auth.user.roles[0].name == 'operator') {
        navItem = operatorNavItems;
    }
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
                <NavMain group={navItem} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
