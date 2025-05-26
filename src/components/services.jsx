import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Services() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Services</h1>
                    <p>Services content will go here.</p>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
} 