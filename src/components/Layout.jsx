import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pill,
  Stethoscope,
  Sun,
  UserCircle,
  Users,
  BedDouble,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/store";
import toast from "react-hot-toast";

const menuItems = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/patients", "Patients", Users],
  ["/doctors", "Doctors", Stethoscope],
  ["/appointments", "Appointments", CalendarDays],
  ["/beds", "Beds", BedDouble],
  ["/pharmacy", "Pharmacy", Pill],
  ["/billing", "Billing", CreditCard],
  ["/notifications", "Notifications", Bell],
  ["/profile", "User Profile", UserCircle],
];

export function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  function signOut() {
    dispatch(logout());
    toast.success("Signed out successfully");
    navigate("/login");
  }

  function renderMenuItems(closeMobileMenu = false) {
    return menuItems.map(([path, label, Icon]) => (
      <Link
        key={path}
        to={path}
        onClick={() => closeMobileMenu && setMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
          location.pathname === path
            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <Icon size={18} />
        {(!sidebarCollapsed || closeMobileMenu) && label}
      </Link>
    ));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900 lg:block ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Stethoscope size={20} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="font-bold">MediCare</div>
                <div className="text-[10px] text-slate-500">Hospital ERP</div>
              </div>
            )}
          </Link>
        </div>

        <nav className="space-y-1 p-3">{renderMenuItems()}</nav>

        {!sidebarCollapsed && (
          <div className="absolute bottom-20 left-3 right-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Hospital Operations
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage patients, care teams and hospital resources.
            </p>
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-3 right-3 rounded border px-2 py-1 text-xs dark:border-slate-700"
        >
          {sidebarCollapsed ? "Expand" : "Collapse"}
        </button>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Stethoscope size={20} />
            </div>
            <b>MediCare</b>
          </div>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="space-y-1">{renderMenuItems(true)}</nav>
      </aside>

      <div
        className={`${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        } min-h-screen transition-all`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu />
          </button>

          <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
            Hospital Management Dashboard
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Toggle dark mode"
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              to="/notifications"
              className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell size={19} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>

            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold">Admin User</div>
              <div className="text-xs text-slate-500">Administrator</div>
            </div>

            <button
              onClick={signOut}
              title="Logout"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
