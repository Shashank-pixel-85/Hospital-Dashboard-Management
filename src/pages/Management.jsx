import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button, Card, Modal, Badge } from "../components/common";
import { DataTable } from "../components/DataTable";
import {
  patientsSlice,
  doctorsSlice,
  appointmentsSlice,
  bedsSlice,
  medicinesSlice,
  billsSlice,
} from "../store/store";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950";

const patientSchema = z.object({
  name: z.string().min(2, "Patient name is required"),
  age: z.coerce.number().min(0).max(120),
  gender: z.string().min(1, "Select gender"),
  bloodGroup: z.string().min(1, "Select blood group"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter 10 digit phone number"),
  doctor: z.string().min(2, "Doctor is required"),
  department: z.string().min(2, "Department is required"),
  status: z.string().min(1, "Select status"),
  admissionDate: z.string().min(1, "Admission date is required"),
});

const doctorSchema = z.object({
  name: z.string().min(2, "Doctor name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  department: z.string().min(2, "Department is required"),
  experience: z.coerce.number().min(0).max(60),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter 10 digit phone number"),
  status: z.string().min(1, "Select status"),
});

const appointmentSchema = z.object({
  patient: z.string().min(2, "Patient is required"),
  doctor: z.string().min(2, "Doctor is required"),
  department: z.string().min(2, "Department is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  type: z.string().min(2, "Type is required"),
  status: z.string().min(1, "Select status"),
});

const bedSchema = z.object({
  ward: z.string().min(2, "Ward is required"),
  type: z.string().min(2, "Type is required"),
  floor: z.coerce.number().min(0),
  patient: z.string().min(1, "Patient is required"),
  status: z.string().min(1, "Select status"),
});

const medicineSchema = z.object({
  name: z.string().min(2, "Medicine name is required"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().min(0),
  reorder: z.coerce.number().min(0),
  expiry: z.string().min(1, "Expiry date is required"),
  price: z.coerce.number().min(0),
  status: z.string().min(1, "Select status"),
});

const billSchema = z.object({
  patient: z.string().min(2, "Patient is required"),
  service: z.string().min(2, "Service is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().min(0),
  status: z.string().min(1, "Select status"),
});

function FormField({ label, name, register, error, type = "text", options }) {
  return (
    <label className="block text-sm font-medium">
      {label}

      {options ? (
        <select {...register(name)} className={inputClass}>
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...register(name)} className={inputClass} />
      )}

      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function RecordForm({ record, fields, schema, onSave, onClose, title }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: record || {},
  });

  return (
    <Modal open={true} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              options={field.options}
              register={register}
              error={errors[field.name]?.message}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}

export function Patients() {
  const dispatch = useDispatch();
  const patients = useSelector((state) => state.patients);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const fields = [
    { name: "name", label: "Patient Name" },
    { name: "age", label: "Age", type: "number" },
    { name: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
    { name: "bloodGroup", label: "Blood Group", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    { name: "phone", label: "Phone" },
    { name: "doctor", label: "Doctor" },
    { name: "department", label: "Department" },
    { name: "status", label: "Status", options: ["Active", "Admitted", "Discharged"] },
    { name: "admissionDate", label: "Admission Date", type: "date" },
  ];

  function openAddForm() {
    setEditingPatient(null);
    setShowForm(true);
  }

  function openEditForm(patient) {
    setEditingPatient(patient);
    setShowForm(true);
  }

  function savePatient(data) {
    const patient = {
      ...data,
      age: Number(data.age),
      id: editingPatient ? editingPatient.id : `P-${Date.now()}`,
    };

    if (editingPatient) {
      dispatch(patientsSlice.actions.update(patient));
      toast.success("Patient updated");
    } else {
      dispatch(patientsSlice.actions.add(patient));
      toast.success("Patient added");
    }

    setShowForm(false);
    setEditingPatient(null);
  }

  function deletePatient(patient) {
    if (!window.confirm(`Delete ${patient.name}?`)) return;
    dispatch(patientsSlice.actions.remove(patient.id));
    toast.success("Patient deleted");
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Patient", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "gender", label: "Gender" },
    { key: "department", label: "Department", sortable: true },
    { key: "doctor", label: "Doctor" },
    { key: "status", label: "Status", render: (patient) => <Badge>{patient.status}</Badge> },
    { key: "admissionDate", label: "Admission", sortable: true },
  ];

  return (
    <PageLayout title="Patient Management" description="Manage patient records, admissions and care assignments." onAdd={openAddForm}>
      <DataTable
        rows={patients}
        columns={columns}
        onEdit={openEditForm}
        onDelete={deletePatient}
        filterOptions={["Active", "Admitted", "Discharged"]}
      />

      {showForm && (
        <RecordForm
          record={editingPatient}
          fields={fields}
          schema={patientSchema}
          onSave={savePatient}
          onClose={() => setShowForm(false)}
          title={editingPatient ? "Edit Patient" : "Add Patient"}
        />
      )}
    </PageLayout>
  );
}

export function Doctors() {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const fields = [
    { name: "name", label: "Doctor Name" },
    { name: "specialization", label: "Specialization" },
    { name: "department", label: "Department" },
    { name: "experience", label: "Experience (years)", type: "number" },
    { name: "phone", label: "Phone" },
    { name: "status", label: "Status", options: ["Active", "On Leave"] },
  ];

  function saveDoctor(data) {
    const doctor = {
      ...data,
      experience: Number(data.experience),
      id: editingDoctor ? editingDoctor.id : `D-${Date.now()}`,
    };

    if (editingDoctor) {
      dispatch(doctorsSlice.actions.update(doctor));
      toast.success("Doctor updated");
    } else {
      dispatch(doctorsSlice.actions.add(doctor));
      toast.success("Doctor added");
    }

    setShowForm(false);
    setEditingDoctor(null);
  }

  function deleteDoctor(doctor) {
    if (!window.confirm(`Delete ${doctor.name}?`)) return;
    dispatch(doctorsSlice.actions.remove(doctor.id));
    toast.success("Doctor deleted");
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Doctor", sortable: true },
    { key: "specialization", label: "Specialization" },
    { key: "department", label: "Department", sortable: true },
    { key: "experience", label: "Experience", sortable: true },
    { key: "status", label: "Status", render: (doctor) => <Badge>{doctor.status}</Badge> },
  ];

  return (
    <PageLayout title="Doctor Management" description="Manage doctors, specialties and availability." onAdd={() => { setEditingDoctor(null); setShowForm(true); }}>
      <DataTable rows={doctors} columns={columns} onEdit={(doctor) => { setEditingDoctor(doctor); setShowForm(true); }} onDelete={deleteDoctor} filterOptions={["Active", "On Leave"]} />
      {showForm && <RecordForm record={editingDoctor} fields={fields} schema={doctorSchema} onSave={saveDoctor} onClose={() => setShowForm(false)} title={editingDoctor ? "Edit Doctor" : "Add Doctor"} />}
    </PageLayout>
  );
}

export function Appointments() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const fields = [
    { name: "patient", label: "Patient" },
    { name: "doctor", label: "Doctor" },
    { name: "department", label: "Department" },
    { name: "date", label: "Date", type: "date" },
    { name: "time", label: "Time" },
    { name: "type", label: "Type", options: ["Consultation", "Follow-up", "Review"] },
    { name: "status", label: "Status", options: ["Scheduled", "Completed", "Cancelled"] },
  ];

  function saveAppointment(data) {
    const appointment = {
      ...data,
      id: editingAppointment ? editingAppointment.id : `A-${Date.now()}`,
    };

    if (editingAppointment) {
      dispatch(appointmentsSlice.actions.update(appointment));
      toast.success("Appointment updated");
    } else {
      dispatch(appointmentsSlice.actions.add(appointment));
      toast.success("Appointment added");
    }

    setShowForm(false);
    setEditingAppointment(null);
  }

  function deleteAppointment(appointment) {
    if (!window.confirm("Delete this appointment?")) return;
    dispatch(appointmentsSlice.actions.remove(appointment.id));
    toast.success("Appointment deleted");
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "doctor", label: "Doctor" },
    { key: "department", label: "Department" },
    { key: "date", label: "Date", sortable: true },
    { key: "time", label: "Time" },
    { key: "status", label: "Status", render: (appointment) => <Badge>{appointment.status}</Badge> },
  ];

  return (
    <PageLayout title="Appointment Management" description="Schedule and manage patient appointments." onAdd={() => { setEditingAppointment(null); setShowForm(true); }}>
      <DataTable rows={appointments} columns={columns} onEdit={(appointment) => { setEditingAppointment(appointment); setShowForm(true); }} onDelete={deleteAppointment} filterOptions={["Scheduled", "Completed", "Cancelled"]} />
      {showForm && <RecordForm record={editingAppointment} fields={fields} schema={appointmentSchema} onSave={saveAppointment} onClose={() => setShowForm(false)} title={editingAppointment ? "Edit Appointment" : "Add Appointment"} />}
    </PageLayout>
  );
}

export function Beds() {
  const dispatch = useDispatch();
  const beds = useSelector((state) => state.beds);
  const [showForm, setShowForm] = useState(false);
  const [editingBed, setEditingBed] = useState(null);

  const fields = [
    { name: "ward", label: "Ward" },
    { name: "type", label: "Type", options: ["Standard", "ICU", "Private"] },
    { name: "floor", label: "Floor", type: "number" },
    { name: "patient", label: "Patient" },
    { name: "status", label: "Status", options: ["Occupied", "Available", "Maintenance"] },
  ];

  function saveBed(data) {
    const bed = {
      ...data,
      floor: Number(data.floor),
      id: editingBed ? editingBed.id : `B-${Date.now()}`,
    };

    if (editingBed) {
      dispatch(bedsSlice.actions.update(bed));
      toast.success("Bed updated");
    } else {
      dispatch(bedsSlice.actions.add(bed));
      toast.success("Bed added");
    }

    setShowForm(false);
    setEditingBed(null);
  }

  function deleteBed(bed) {
    if (!window.confirm("Delete this bed?")) return;
    dispatch(bedsSlice.actions.remove(bed.id));
    toast.success("Bed deleted");
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "ward", label: "Ward", sortable: true },
    { key: "type", label: "Type" },
    { key: "floor", label: "Floor", sortable: true },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status", render: (bed) => <Badge>{bed.status}</Badge> },
  ];

  return (
    <PageLayout title="Bed Management" description="Track hospital bed availability and occupancy." onAdd={() => { setEditingBed(null); setShowForm(true); }}>
      <DataTable rows={beds} columns={columns} onEdit={(bed) => { setEditingBed(bed); setShowForm(true); }} onDelete={deleteBed} filterOptions={["Occupied", "Available", "Maintenance"]} />
      {showForm && <RecordForm record={editingBed} fields={fields} schema={bedSchema} onSave={saveBed} onClose={() => setShowForm(false)} title={editingBed ? "Edit Bed" : "Add Bed"} />}
    </PageLayout>
  );
}

export function Pharmacy() {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicines);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const fields = [
    { name: "name", label: "Medicine" },
    { name: "category", label: "Category" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "reorder", label: "Reorder Level", type: "number" },
    { name: "expiry", label: "Expiry Date", type: "date" },
    { name: "price", label: "Unit Price", type: "number" },
    { name: "status", label: "Status", options: ["In Stock", "Low Stock", "Out of Stock"] },
  ];

  function saveMedicine(data) {
    const medicine = {
      ...data,
      stock: Number(data.stock),
      reorder: Number(data.reorder),
      price: Number(data.price),
      id: editingMedicine ? editingMedicine.id : `M-${Date.now()}`,
    };

    if (editingMedicine) {
      dispatch(medicinesSlice.actions.update(medicine));
      toast.success("Medicine updated");
    } else {
      dispatch(medicinesSlice.actions.add(medicine));
      toast.success("Medicine added");
    }

    setShowForm(false);
    setEditingMedicine(null);
  }

  function deleteMedicine(medicine) {
    if (!window.confirm("Delete this medicine?")) return;
    dispatch(medicinesSlice.actions.remove(medicine.id));
    toast.success("Medicine deleted");
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Medicine", sortable: true },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock", sortable: true },
    { key: "reorder", label: "Reorder", sortable: true },
    { key: "expiry", label: "Expiry", sortable: true },
    { key: "price", label: "Price", render: (medicine) => `₹${medicine.price}` },
    { key: "status", label: "Status", render: (medicine) => <Badge>{medicine.status}</Badge> },
  ];

  return (
    <PageLayout title="Pharmacy" description="Manage medicine inventory, stock levels and expiry dates." onAdd={() => { setEditingMedicine(null); setShowForm(true); }}>
      <DataTable rows={medicines} columns={columns} onEdit={(medicine) => { setEditingMedicine(medicine); setShowForm(true); }} onDelete={deleteMedicine} filterOptions={["In Stock", "Low Stock", "Out of Stock"]} />
      {showForm && <RecordForm record={editingMedicine} fields={fields} schema={medicineSchema} onSave={saveMedicine} onClose={() => setShowForm(false)} title={editingMedicine ? "Edit Medicine" : "Add Medicine"} />}
    </PageLayout>
  );
}

export function Billing() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const fields = [
    { name: "patient", label: "Patient" },
    { name: "service", label: "Service" },
    { name: "date", label: "Date", type: "date" },
    { name: "amount", label: "Amount", type: "number" },
    { name: "status", label: "Status", options: ["Pending", "Paid", "Overdue"] },
  ];

  function saveBill(data) {
    const bill = {
      ...data,
      amount: Number(data.amount),
      id: editingBill ? editingBill.id : `INV-${Date.now()}`,
    };

    if (editingBill) {
      dispatch(billsSlice.actions.update(bill));
      toast.success("Bill updated");
    } else {
      dispatch(billsSlice.actions.add(bill));
      toast.success("Bill added");
    }

    setShowForm(false);
    setEditingBill(null);
  }

  function deleteBill(bill) {
    if (!window.confirm("Delete this bill?")) return;
    dispatch(billsSlice.actions.remove(bill.id));
    toast.success("Bill deleted");
  }

  const columns = [
    { key: "id", label: "Invoice", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "service", label: "Service" },
    { key: "date", label: "Date", sortable: true },
    { key: "amount", label: "Amount", sortable: true, render: (bill) => `₹${bill.amount}` },
    { key: "status", label: "Status", render: (bill) => <Badge>{bill.status}</Badge> },
  ];

  return (
    <PageLayout title="Billing" description="Manage invoices, payments and outstanding bills." onAdd={() => { setEditingBill(null); setShowForm(true); }}>
      <DataTable rows={bills} columns={columns} onEdit={(bill) => { setEditingBill(bill); setShowForm(true); }} onDelete={deleteBill} filterOptions={["Pending", "Paid", "Overdue"]} />
      {showForm && <RecordForm record={editingBill} fields={fields} schema={billSchema} onSave={saveBill} onClose={() => setShowForm(false)} title={editingBill ? "Edit Bill" : "Add Bill"} />}
    </PageLayout>
  );
}

function PageLayout({ title, description, onAdd, children }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <Button onClick={onAdd}>Add New</Button>
      </div>
      <Card>{children}</Card>
    </div>
  );
}
