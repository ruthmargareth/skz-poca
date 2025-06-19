import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" });

  response.headers.set(
    "Set-Cookie",
    `session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
  );

  return response;
}
