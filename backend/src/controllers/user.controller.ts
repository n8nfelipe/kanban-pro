import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        boards: {
          select: {
            id: true,
            name: true,
          },
        },
        cards: {
          select: {
            id: true,
            title: true,
            column: {
              select: {
                title: true,
                board: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId as string;

    // Get all users who have cards or are owners of boards in this workspace
    const members = await prisma.user.findMany({
      where: {
        OR: [
          {
            ownedBoards: {
              some: { workspaceId },
            },
          },
          {
            boards: {
              some: { workspaceId },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            cards: true,
            boards: true,
            ownedBoards: true,
          },
        },
      },
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    res.status(500).json({ error: 'Failed to fetch workspace members' });
  }
};
