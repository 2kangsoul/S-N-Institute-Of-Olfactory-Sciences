"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRegister } from "@/src/Features/Auth/auth.hooks";
import {
  authRegisterValidation,
  AuthRegisterType,
} from "@/src/Features/Auth/auth.validation";
import { ApiResponse } from "@/src/types/api-response.type";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRegisterType>({
    resolver: zodResolver(authRegisterValidation),
  });

  const onSubmit = (values: AuthRegisterType) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Register successful! Please login.");
        router.push("/login");
      },
      onError: (error) => {
        const err = error as AxiosError<ApiResponse<null>>;
        toast.error(err.response?.data?.message || "Register failed");
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,.35)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "32px",
            fontSize: "15px",
          }}
        >
          Create your account to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="fullName"
              style={{
                display: "block",
                color: "#e2e8f0",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.fullName && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                color: "#e2e8f0",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register("username")}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.username && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}
              >
                {errors.username.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                color: "#e2e8f0",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.email && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#e2e8f0",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #475569",
                background: "#0f172a",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.password && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: registerMutation.isPending ? "#475569" : "#2563eb",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: registerMutation.isPending ? "not-allowed" : "pointer",
            }}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
