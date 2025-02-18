import { verifyJWT } from '@/lib/auth/auth.jwt';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { generateTaskIdentifier } from '@/lib/utils';
import { globalSettings } from '@/settings/global-settings';
import { type JWTPayload } from 'jose';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for headers
const bearerTokenSchema = z
  .string()
  .min(1, { message: 'Bearer token is required' });
  // .regex(/^Bearer\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/, "Missing or invalid token");

const JWT_SECRET = env.JWT_SECRET;

// Generate userPriority
const userPriority = (priority: string | undefined) => {
  let userPriorityOrder: number | null = null;
  switch (priority) {
    case 'urgent':
      userPriorityOrder = 1;
      break;
    case 'high':
      userPriorityOrder = 2;
      break;
    case 'medium':
      userPriorityOrder = 3;
      break;
    case 'low':
      userPriorityOrder = 4;
      break;
    case 'no priority':
      userPriorityOrder = 5;
      break;
    case undefined:
      userPriorityOrder = 5;
      break;
    default:
      userPriorityOrder = 5;
      break;
  }
  return userPriorityOrder;
};

// Retrieve all tasks
export async function GET(req: NextRequest) {
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

    // TODO: Vérifiez ici la validité du token (par exemple avec votre base de données ou un JWT)

    // Retrieve all tasks from the database
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new task
const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().nullable().optional(),
  label: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  aiPriority: z.number().optional(),
  userPriority: z.number().optional(),
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export async function POST(req: NextRequest) {
  try {
    // Retrieve eand validation of Bearer token
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

    // Validating token
    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }


    // Validating data send by the client
    const body = await req.json();
    const parsedBody = createTaskSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid task data', details: parsedBody.error.errors },
        { status: 400 }
      );
    }

    // Generate a new task identifier
    const getLastTaskCreated = await prisma.task.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { identifier: true },
    });

    const newTaskIdentifier = getLastTaskCreated ? generateTaskIdentifier(getLastTaskCreated.identifier) : 'TASK-0001';


    // Create the task in database
    const newTask = await prisma.task.create({
      data: {
        ...parsedBody.data,
        id: nanoid(),
        identifier: newTaskIdentifier,
        title: parsedBody.data.title,
        content: parsedBody.data.content,
        label: parsedBody.data.label ?? 'others',
        status: parsedBody.data.status ?? 'backlog',
        priority: parsedBody.data.priority ?? 'no priority',
        userPriority: userPriority(parsedBody.data.priority),
        aiPriority: parsedBody.data.aiPriority ?? 0,
        userId: parsedBody.data.userId,
        token: token,
        active: true,
      },
    });

    // Response to the client
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);

    // Gestion des erreurs Prisma
    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   return NextResponse.json(
    //     { error: 'Database error', code: (error as Prisma.PrismaClientKnownRequestError).code, message: (error as Prisma.PrismaClientKnownRequestError).message },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Update a task
const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  label: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  aiPriority: z.number().optional(),
  userPriority: z.number().optional(),
  dueOfDate: z.coerce.date().optional(), 
  userId: z.string(),
});

export async function PUT(req: NextRequest) {
  try {
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

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (verifyToken.exp && Date.now() >= verifyToken.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    if (verifyToken.name !== globalSettings[0].app.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validating token
    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await req.json();
    const parsedBody = updateTaskSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid task data', details: parsedBody.error.errors },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: parsedBody.data.id },
      data: {
        title: parsedBody.data.title,
        content: parsedBody.data.content,
        label: parsedBody.data.label,
        status: parsedBody.data.status,
        priority: parsedBody.data.priority,
        aiPriority: parsedBody.data.aiPriority,
        userPriority: userPriority(parsedBody.data.priority),
        dueOfDate: parsedBody.data.dueOfDate,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a task
const deleteTaskSchema = z.object({
  id: z.string().min(1, { message: 'Task ID is required' }),
  title: z.string().optional(),
  userId: z.string(),
});

const deleteManyTasksSchema = z.array(z.object({
  id: z.string().min(1, { message: 'Task ID is required' }),
  title: z.string().optional(),
  userId: z.string(),
}));

export async function DELETE(req: NextRequest) {
  try {
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

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (verifyToken.exp && Date.now() >= verifyToken.exp * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    if (verifyToken.name !== globalSettings[0].app.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validating token
    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // const url = new URL(req.url);
    // const taskId = url.pathname.split('/').pop();
    const body = await req.json();

    if (Array.isArray(body)) {
      const parsedBody = deleteManyTasksSchema.safeParse(body);

      if (!parsedBody.success) {
        return NextResponse.json(
          { error: 'Invalid tasks data', details: parsedBody.error.errors },
          { status: 400 }
        );
      }

      const deleteTasks = await prisma.task.deleteMany({
        where: { id: { in: parsedBody.data.map((task) => task.id) } },
      });
      return NextResponse.json(deleteTasks, { status: 200 });
    }

    // const body = await req.json();
    const parsedBody = deleteTaskSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid task data', details: parsedBody.error.errors },
        { status: 400 }
      );
    }

    const deleteTask = await prisma.task.delete({
      where: { id: parsedBody.data.id },
    });
    return NextResponse.json(deleteTask, { status: 200 });

  } catch (error) {
    console.error('Error deleting task:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}