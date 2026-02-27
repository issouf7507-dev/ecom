"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconPackage,
  IconCategory,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconBuildingStore,
  IconListDetails,
  IconSparkles,
  IconClock,
  IconMail,
  IconPhoto,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Ajouter produit",
      url: "/ajouter-produits",
      icon: IconPackage,
    },
    {
      title: "Produits Liste",
      url: "/produits-listes",
      icon: IconListDetails,
    },

    {
      title: "Nouvelles Arrivées",
      url: "/nouvelles-arrivees",
      icon: IconSparkles,
    },
    {
      title: "Produits à Venir",
      url: "/produits-a-venir",
      icon: IconClock,
    },

    {
      title: "Catégories",
      url: "/categories",
      icon: IconCategory,
    },

    {
      title: "Commandes",
      url: "/commandes",
      icon: IconShoppingCart,
    },
    // {
    //   title: "Clients",
    //   url: "/clients",
    //   icon: IconUsers,
    // },
    {
      title: "Campagnes",
      url: "/campagnes",
      icon: IconMail,
    },

    {
      title: "Carousel",
      url: "/carousel",
      icon: IconPhoto,
    },
    {
      title: "Accordéon Interactif",
      url: "/accordion",
      icon: IconPhoto,
    },
    {
      title: "Salon de beauté",
      url: "/catalogue",
      icon: IconBuildingStore,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconBuildingStore className="size-5!" />
                <span className="text-base font-semibold orbitron">
                  Kik Game Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
