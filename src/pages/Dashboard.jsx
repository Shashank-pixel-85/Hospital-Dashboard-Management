import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, IndianRupee, Stethoscope, Users } from "lucide-react";
import { Card, Badge } from "../components/common";

const monthlyData = [
  { month: "Jan", patients: 420, appointments: 280, revenue: 3.8 },
  { month: "Feb", patients: 510, appointments: 320, revenue: 4.2 },
  { month: "Mar", patients: 470, appointments: 360, revenue: 4.5 },
  { month: "Apr", patients: 590, appointments: 410, revenue: 5.1 },
  { month: "May", patients: 630, appointments: 450, revenue: 5.8 },
  { month: "Jun", patients: 710, appointments: 480, revenue: 6.2 },
  { month: "Jul", patients: 760, appointments: 530, revenue: 6.8 },
  { month: "Aug", patients: 830, appointments: 570, revenue: 7.1 },
];

export default function Dashboard() {
  const patients = useSelector((state) => state.patients);
  const doctors = useSelector((state) => state.doctors);
  const appointments = useSelector((state) => state.appointments);
  const beds = useSelector((state) => state.beds);

  const occupiedBeds = beds.filter((bed) => bed.status === "Occupied").length;
  const availableBeds = beds.filter((bed) => bed.status === "Available").length;
  const maintenanceBeds = beds.filter((bed) => bed.status === "Maintenance").length;

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === "2026-08-10"
  );

  const summaryCards = [
    {
      title: "Total Patients",
      value: patients.length + 1442,
      icon: Users,
      change: "+12.5%",
    },
    {
      title: "Doctors",
      value: doctors.length + 142,
      icon: Stethoscope,
      change: "+4.8%",
    },
    {
      title: "Appointments Today",
      value: todayAppointments.length,
      icon: CalendarDays,
      change: "+8.2%",
    },
    {
      title: "Revenue",
      value: "₹7.1L",
      icon: IndianRupee,
      change: "+9.4%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Hospital overview and daily operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Icon size={20} />
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {card.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
              <p className="mt-1 text-2xl font-bold">{card.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="font-bold">Patient & Appointment Trends</h2>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Monthly activity
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.12}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold">Revenue Overview</h2>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Monthly revenue in lakhs
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Bed Occupancy</h2>

          <div className="space-y-4">
            <BedRow label="Occupied" value={occupiedBeds} total={beds.length} />
            <BedRow label="Available" value={availableBeds} total={beds.length} />
            <BedRow label="Maintenance" value={maintenanceBeds} total={beds.length} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-bold">Today's Appointments</h2>

          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"
              >
                <div>
                  <p className="text-sm font-semibold">{appointment.patient}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {appointment.doctor} · {appointment.time}
                  </p>
                </div>
                <Badge>{appointment.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function BedRow({ label, value, total }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-slate-500 dark:text-slate-400">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
