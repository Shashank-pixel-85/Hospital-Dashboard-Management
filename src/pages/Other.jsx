import { useState } from "react";
import { Bell, Check, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Card } from "../components/common";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950";

export function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New appointment scheduled for Arjun Kumar.", read: false },
    { id: 2, text: "Amoxicillin stock is below reorder level.", read: false },
    { id: 3, text: "Invoice INV-503 is overdue.", read: true },
  ]);

  function markAsRead(id) {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);
    toast.success("Marked as read");
  }

  function markAllAsRead() {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updatedNotifications);
    toast.success("All notifications marked as read");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Stay updated on hospital operations.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold">Recent Notifications</h2>
          <Button variant="secondary" onClick={markAllAsRead}>
            Mark all read
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center justify-between rounded-lg p-4 ${
                notification.read
                  ? "bg-slate-50 dark:bg-slate-800/40"
                  : "bg-blue-50 dark:bg-blue-500/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell
                  size={18}
                  className={notification.read ? "text-slate-400" : "text-blue-600"}
                />
                <span className="text-sm">{notification.text}</span>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-white dark:hover:bg-slate-800"
                  title="Mark as read"
                >
                  <Check size={17} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function Profile() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@medicare.com");

  function saveProfile(event) {
    event.preventDefault();
    toast.success("Profile updated");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account information.
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <UserCircle size={38} />
          </div>
          <div>
            <h2 className="font-bold">{name}</h2>
            <p className="text-sm text-slate-500">Administrator</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="mt-6 max-w-xl space-y-4">
          <label className="block text-sm font-medium">
            Full Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              type="email"
              required
            />
          </label>

          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
