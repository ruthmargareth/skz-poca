import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogIn from "./loginadmin"; // memisahkan UI login ke Client Component

export default function LoginPage() {
  const session = cookies().get("session")?.value;

  if (session) {
    redirect("/admin/cards");
  }

  return <AdminLogIn />;
}
