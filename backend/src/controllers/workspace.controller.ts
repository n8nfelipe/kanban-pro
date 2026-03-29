import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        boards: true
      }
    });
    res.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};
