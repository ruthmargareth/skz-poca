import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 401 });
    }

    // Bandingkan password input dengan hashed password di database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Login berhasil" });

    // Simpan sesi dengan cookie
    response.headers.set(
      "Set-Cookie",
      `session=${user.email}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Error saat login:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
