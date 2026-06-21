import LoginForm from "@/components/LoginForm";

export const metadata = { title: "로그인 · 머신러닝 기말 대비" };

export default function LoginPage() {
  return (
    <div className="auth-wrap">
      <LoginForm />
    </div>
  );
}
