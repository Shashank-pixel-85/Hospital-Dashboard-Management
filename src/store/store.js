import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialPatients = [
    { id: "P-1001", name: "Arjun Kumar", age: 34, gender: "Male", bloodGroup: "O+", phone: "9876543210", doctor: "Dr. Ananya Rao", department: "Cardiology", status: "Admitted", admissionDate: "2026-08-08" },
    { id: "P-1002", name: "Priya Sharma", age: 28, gender: "Female", bloodGroup: "A+", phone: "9867543210", doctor: "Dr. Rahul Mehta", department: "Neurology", status: "Active", admissionDate: "2026-08-09" },
    { id: "P-1003", name: "Vikram Singh", age: 51, gender: "Male", bloodGroup: "B+", phone: "9854321098", doctor: "Dr. Neha Patel", department: "Orthopedics", status: "Discharged", admissionDate: "2026-08-05" },
    { id: "P-1004", name: "Sneha Reddy", age: 42, gender: "Female", bloodGroup: "AB+", phone: "9843210987", doctor: "Dr. Kiran Rao", department: "General Medicine", status: "Admitted", admissionDate: "2026-08-07" },
    { id: "P-1005", name: "Rohan Desai", age: 23, gender: "Male", bloodGroup: "O-", phone: "9832109876", doctor: "Dr. Ananya Rao", department: "Cardiology", status: "Active", admissionDate: "2026-08-10" },
    { id: "P-1006", name: "Meera Iyer", age: 63, gender: "Female", bloodGroup: "A-", phone: "9821098765", doctor: "Dr. Neha Patel", department: "Orthopedics", status: "Admitted", admissionDate: "2026-08-06" }
];
const initialDoctors = [
    { id: "D-101", name: "Dr. Ananya Rao", specialization: "Cardiologist", department: "Cardiology", experience: 12, phone: "9811111111", status: "Active" },
    { id: "D-102", name: "Dr. Rahul Mehta", specialization: "Neurologist", department: "Neurology", experience: 9, phone: "9822222222", status: "Active" },
    { id: "D-103", name: "Dr. Neha Patel", specialization: "Orthopedic Surgeon", department: "Orthopedics", experience: 15, phone: "9833333333", status: "On Leave" },
    { id: "D-104", name: "Dr. Kiran Rao", specialization: "Physician", department: "General Medicine", experience: 8, phone: "9844444444", status: "Active" }
];
const initialAppointments = [
    { id: "A-201", patient: "Arjun Kumar", doctor: "Dr. Ananya Rao", department: "Cardiology", date: "2026-08-10", time: "09:30 AM", type: "Consultation", status: "Scheduled" },
    { id: "A-202", patient: "Priya Sharma", doctor: "Dr. Rahul Mehta", department: "Neurology", date: "2026-08-10", time: "11:00 AM", type: "Follow-up", status: "Scheduled" },
    { id: "A-203", patient: "Vikram Singh", doctor: "Dr. Neha Patel", department: "Orthopedics", date: "2026-08-10", time: "02:00 PM", type: "Review", status: "Completed" },
    { id: "A-204", patient: "Sneha Reddy", doctor: "Dr. Kiran Rao", department: "General Medicine", date: "2026-08-11", time: "10:30 AM", type: "Consultation", status: "Scheduled" }
];
const initialBeds = [
    { id: "B-101", ward: "General", type: "Standard", floor: 1, patient: "Arjun Kumar", status: "Occupied" },
    { id: "B-102", ward: "General", type: "Standard", floor: 1, patient: "Sneha Reddy", status: "Occupied" },
    { id: "B-103", ward: "General", type: "Standard", floor: 1, patient: "—", status: "Available" },
    { id: "B-201", ward: "ICU", type: "ICU", floor: 2, patient: "Meera Iyer", status: "Occupied" },
    { id: "B-202", ward: "ICU", type: "ICU", floor: 2, patient: "—", status: "Maintenance" },
    { id: "B-301", ward: "Private", type: "Private", floor: 3, patient: "—", status: "Available" }
];
const initialMedicines = [
    { id: "M-301", name: "Paracetamol 500mg", category: "Analgesic", stock: 420, reorder: 100, expiry: "2027-06-30", price: 2.5, status: "In Stock" },
    { id: "M-302", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 65, reorder: 100, expiry: "2027-02-28", price: 8.5, status: "Low Stock" },
    { id: "M-303", name: "Atorvastatin 20mg", category: "Cardiac", stock: 180, reorder: 60, expiry: "2027-09-30", price: 12, status: "In Stock" },
    { id: "M-304", name: "Insulin Glargine", category: "Diabetes", stock: 0, reorder: 30, expiry: "2026-12-31", price: 520, status: "Out of Stock" }
];
const initialBills = [
    { id: "INV-501", patient: "Arjun Kumar", service: "Cardiology Consultation", date: "2026-08-10", amount: 3500, status: "Pending" },
    { id: "INV-502", patient: "Priya Sharma", service: "Neurology Follow-up", date: "2026-08-09", amount: 2400, status: "Paid" },
    { id: "INV-503", patient: "Vikram Singh", service: "Orthopedic Review", date: "2026-08-08", amount: 5200, status: "Overdue" },
    { id: "INV-504", patient: "Sneha Reddy", service: "General Medicine", date: "2026-08-07", amount: 1800, status: "Paid" }
];
const makeCrud = (name, initial) => createSlice({
    name,
    initialState: initial,
    reducers: {
        add: (state, action) => { state.push(action.payload); },
        update: (state, action) => {
            const i = state.findIndex(x => x.id === action.payload.id);
            if (i >= 0)
                state[i] = action.payload;
        },
        remove: (state, action) => state.filter(x => x.id !== action.payload)
    }
});
export const patientsSlice = makeCrud("patients", initialPatients);
export const doctorsSlice = makeCrud("doctors", initialDoctors);
export const appointmentsSlice = makeCrud("appointments", initialAppointments);
export const bedsSlice = makeCrud("beds", initialBeds);
export const medicinesSlice = makeCrud("medicines", initialMedicines);
export const billsSlice = makeCrud("bills", initialBills);
const authSlice = createSlice({
    name: "auth",
    initialState: { authenticated: localStorage.getItem("medicare_auth") === "true" },
    reducers: {
        login: (s) => { s.authenticated = true; localStorage.setItem("medicare_auth", "true"); },
        logout: (s) => { s.authenticated = false; localStorage.removeItem("medicare_auth"); }
    }
});
export const { login, logout } = authSlice.actions;
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer, patients: patientsSlice.reducer, doctors: doctorsSlice.reducer,
        appointments: appointmentsSlice.reducer, beds: bedsSlice.reducer, medicines: medicinesSlice.reducer, bills: billsSlice.reducer
    }
});
