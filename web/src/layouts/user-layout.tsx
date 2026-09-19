import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppConfigModal } from "@/components/layout/app-config-modal";
import { AccountMenu } from "@/components/layout/account-menu";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";
import "@/styles/workspace.css";

export default function UserLayout({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();
    const inCanvas = /^\/canvas\/[^/]+/.test(pathname);
    return (
        <div className={`flex h-full min-h-0 overflow-hidden bg-background text-foreground ${inCanvas ? "" : "yz-workspace"}`}>
            {inCanvas ? <AccountMenu /> : <WorkspaceSidebar />}
            <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
            <AppConfigModal />
        </div>
    );
}
