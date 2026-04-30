import Link from "next/link";
import { LayoutDashboard, Settings, User, HelpCircle } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 h-[calc(100vh-3.5rem)]">
      <nav className="flex-1 space-y-1 px-2 py-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
