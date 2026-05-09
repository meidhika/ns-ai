import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Token tidak ditemukan", { status: 400 });
  }

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return new NextResponse("Token tidak valid atau sudah digunakan", {
        status: 400,
      });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return new NextResponse("Token sudah kedaluwarsa", { status: 400 });
    }

    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: { token: existingToken.token }, 
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    return NextResponse.redirect(`${baseUrl}/en/signin?verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return new NextResponse("Terjadi kesalahan internal", { status: 500 });
  }
}
