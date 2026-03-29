import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBoards = async (req: any, res: Response) => {
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: req.userId },
        { members: { some: { id: req.userId } } }
      ]
    }
  });
  res.json(boards);
};

export const createBoard = async (req: any, res: Response) => {
  const { name, description } = req.body;
  const board = await prisma.board.create({
    data: {
      name,
      description,
      ownerId: req.userId,
      columns: {
        create: [
          { title: 'To Do', order: 0 },
          { title: 'In Progress', order: 1 },
          { title: 'Done', order: 2 }
        ]
      }
    }
  });
  res.status(201).json(board);
};

export const getBoardDetails = async (req: any, res: Response) => {
  const board = await prisma.board.findUnique({
    where: { id: req.params.id },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          cards: { orderBy: { order: 'asc' } }
        }
      }
    }
  });
  res.json(board);
};

export const createColumn = async (req: Request, res: Response) => {
  const { title, order } = req.body;
  const column = await prisma.column.create({
    data: {
      title,
      order: Number(order),
      boardId: req.params.id as string
    }
  });
  res.status(201).json(column);
};

export const createCard = async (req: Request, res: Response) => {
  const { title, description, order, priority } = req.body;
  const card = await prisma.card.create({
    data: {
      title,
      description,
      order: Number(order),
      priority,
      columnId: req.params.columnId as string
    }
  });
  res.status(201).json(card);
};

export const updateCardOrder = async (req: Request, res: Response) => {
  const { order } = req.body;
  const card = await prisma.card.update({
    where: { id: req.params.cardId as string },
    data: { order: Number(order) }
  });
  res.json(card);
};

export const updateCardColumn = async (req: Request, res: Response) => {
  const { columnId, order } = req.body;
  const card = await prisma.card.update({
    where: { id: req.params.cardId as string },
    data: { 
      columnId: columnId as string, 
      order: Number(order) 
    }
  });
  res.json(card);
};
