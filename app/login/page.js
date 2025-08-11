import Login from "@/components/login";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Login />
    </div>
  );
}
export const metadata = {
  title: "AccessibilityGuard - Login",
  description: "Login to your AccessibilityGuard account to manage your website's accessibility.",
};