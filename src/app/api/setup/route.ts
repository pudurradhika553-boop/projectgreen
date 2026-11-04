import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Users exist." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Name, email and password (min 8 chars) are required." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const superAdminRole = await prisma.role.findUnique({
      where: { name: "SUPER_ADMIN" },
    });

    if (!superAdminRole) {
      await prisma.role.create({
        data: { name: "SUPER_ADMIN", description: "Full system access" },
      });
    }

    const role = await prisma.role.findUniqueOrThrow({
      where: { name: "SUPER_ADMIN" },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        roles: {
          create: { roleId: role.id },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully",
      userId: user.id,
    });
  } catch (err: any) {
    console.error("Setup error:", err);
    return NextResponse.json(
      { error: err.message || "Setup failed" },
      { status: 500 }
    );
  }
}
