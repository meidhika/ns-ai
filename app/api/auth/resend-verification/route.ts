import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email sudah terverifikasi" },
        { status: 400 },
      );
    }

    // Hapus token lama jika ada agar tidak menumpuk
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate token baru
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Email berhasil dikirim ulang" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}
