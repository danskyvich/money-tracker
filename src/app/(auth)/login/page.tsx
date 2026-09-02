import LoginPage from "@/features/auth/components/login-page";
import { Suspense } from "react";

export default async function Login() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    </div>
  );
}