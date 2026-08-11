import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Stethoscope } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "../store/store";
import { Button } from "../components/common";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950";

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
            <Stethoscope />
          </div>
          <h1 className="text-2xl font-bold">MediCare</h1>
          <p className="text-sm text-slate-500">Hospital Management Dashboard</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@medicare.com",
      password: "Admin@123",
    },
  });

  async function handleLogin(data) {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const savedPassword = localStorage.getItem("medicare_password");
    const correctPassword = savedPassword || "Admin@123";

    if (data.email !== "admin@medicare.com" || data.password !== correctPassword) {
      toast.error("Invalid demo credentials");
      setLoading(false);
      return;
    }

    dispatch(login());
    toast.success("Welcome back, Admin!");
    navigate("/dashboard");
    setLoading(false);
  }

  return (
    <AuthShell title="Sign in" subtitle="Use the demo account to access the dashboard">
      <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input {...register("email")} className={inputClass} />
          <FieldError message={errors.email?.message} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input type="password" {...register("password")} className={inputClass} />
          <FieldError message={errors.password?.message} />
        </label>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          <span className="flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" size={16} />}
            Sign In
          </span>
        </Button>

        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          Demo: <b>admin@medicare.com</b> / <b>Admin@123</b>
        </div>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema) });

  function handleForgotPassword(data) {
    if (data.email !== "admin@medicare.com") {
      toast.error("Email is not registered");
      return;
    }

    toast.success("Reset link sent (demo)");
    navigate("/reset-password");
  }

  return (
    <AuthShell title="Forgot password" subtitle="Enter your registered email">
      <form onSubmit={handleSubmit(handleForgotPassword)} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input {...register("email")} className={inputClass} />
          <FieldError message={errors.email?.message} />
        </label>

        <Button type="submit">Send Reset Link</Button>

        <Link to="/login" className="block text-center text-sm text-blue-600">
          Back to Login
        </Link>
      </form>
    </AuthShell>
  );
}

export function ResetPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetSchema) });

  function handleResetPassword(data) {
    localStorage.setItem("medicare_password", data.password);
    toast.success("Password reset successfully");
    navigate("/login");
  }

  return (
    <AuthShell title="Reset password" subtitle="Create a new secure password">
      <form onSubmit={handleSubmit(handleResetPassword)} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">New Password</span>
          <input type="password" {...register("password")} className={inputClass} />
          <FieldError message={errors.password?.message} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Confirm Password</span>
          <input type="password" {...register("confirmPassword")} className={inputClass} />
          <FieldError message={errors.confirmPassword?.message} />
        </label>

        <Button type="submit">Reset Password</Button>
      </form>
    </AuthShell>
  );
}
