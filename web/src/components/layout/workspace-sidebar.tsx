import { BookOpen, FolderOpen, Share2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { AccountMenu } from "./account-menu";
import { UserStatusActions } from "./user-status-actions";

const items = [
    { to: "/assets", label: "我的资产", icon: FolderOpen },
    { to: "/canvas", label: "我的画布", icon: Share2 },
    { to: "/prompts", label: "提示词库", icon: BookOpen },
];

export function WorkspaceSidebar() {
    const { pathname } = useLocation();
    return (
        <aside className="yz-sidebar" aria-label="工作台导航">
            <NavLink to="/" className="yz-sidebar-brand" aria-label="YZCanvas 首页">
                <img src="/logo.svg" alt="" width={44} height={44} />
                <span>YZCanvas</span>
            </NavLink>
            <nav className="yz-sidebar-nav">
                {items.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} title={label} className={({ isActive }) => `yz-sidebar-link ${isActive || (to === "/canvas" && pathname === "/") ? "is-active" : ""}`}>
                        <Icon size={25} strokeWidth={1.7} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="yz-sidebar-bottom">
                <div className="yz-sidebar-tools">
                    <UserStatusActions />
                </div>
                <AccountMenu embedded />
            </div>
        </aside>
    );
}
