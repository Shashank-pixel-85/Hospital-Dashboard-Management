# MediCare Hospital Management Dashboard

Frontend assessment project for the Hospital Management Dashboard.

## Stack
- React 19 + JavaScript/JSX + Vite
- React Router
- Tailwind CSS
- Redux Toolkit
- Recharts
- React Hook Form + Zod
- React Hot Toast
- Lucide React

## Included
- Authentication: Login, Forgot Password, Reset Password
- Protected routes
- Dashboard summary cards and charts
- Patients, Doctors, Appointments, Beds, Pharmacy and Billing CRUD UI
- Search, filter, sorting and pagination
- Notifications and User Profile
- Loading, empty and error states
- Responsive mobile/tablet/desktop layout
- Dark/light mode

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Demo login

Email: `admin@medicare.com`  
Password: `Admin@123`

Authentication and CRUD are intentionally frontend/mock because the assessment says CRUD can be UI-only when no backend is available and API integration is a separate learning session.

## Deployment

The Vite app can be deployed to Vercel or Netlify. Use the default Vite build command `npm run build` and publish the `dist` directory.

## Project structure

```text
src/
  components/
    common.jsx
    DataTable.jsx
    EntityPage.jsx
    Layout.jsx
  pages/
    Auth.jsx
    Dashboard.jsx
    Management.jsx
    Other.jsx
  store/
    store.js
  App.jsx
  main.jsx
  index.css
```


> Submission format: standard React JavaScript/JSX files (`.js` and `.jsx`).

- Dark mode: class-based theme toggle with localStorage persistence.
