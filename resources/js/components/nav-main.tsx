import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ group = [] }: { group: NavGroup[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {group.map(navGroup => (
                <div key={navGroup.title}>
                    <SidebarGroupLabel className='font-bold'>{navGroup.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {navGroup.items.map((item) => (
                            <SidebarMenuItem key={item.title} className=''>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(
                                        resolveUrl(item.href),
                                    )}
                                    tooltip={{ children: item.title }}
                                    className='h-12'
                                >
                                    <Link className=' font-bold' href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            ))}

        </SidebarGroup>
    );
}
