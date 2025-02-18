import { verifyJWT } from "@/lib/auth/auth.jwt";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { globalSettings } from "@/settings/global-settings";
import { type JWTPayload } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// Validation schema for headers
const bearerTokenSchema = z
  .string()
  .min(1, { message: 'Bearer token is required' });
  // .regex(/^Bearer\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/, "Missing or invalid token");

const JWT_SECRET = env.JWT_SECRET;

// Retrieve all tasks
export async function GET(
  req: NextRequest,
  { params }: { params: { identifier: string } }
) {
  try {
    // Retrieve and validation of Bearer token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let verifyToken: JWTPayload; 
    try {
      verifyToken = await verifyJWT(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    // console.log('Token verified:', verifyToken);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (verifyToken.exp && Date.now() >= verifyToken.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    if (verifyToken.name !== globalSettings[0].app.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsedToken = bearerTokenSchema.safeParse(token);

    // Retrieve and token validate
    if (token !== JWT_SECRET) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 403 });
    }

    if (!parsedToken.success) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        identifier: {
          equals: params.identifier,
          mode: 'insensitive'
        },
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}