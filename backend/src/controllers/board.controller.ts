import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBoards = async (req: any, res: Response) => {
  const userId = req.userId || 'user-jd'; // Fallback for open auth test
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { id: userId } } }
      ]
    }
  });
  res.json(boards);
};

export const createBoard = async (req: any, res: Response) => {
  const { name, description, workspaceId, icon, tag } = req.body;
  const userId = req.userId || 'user-jd'; // Fallback
  
  const board = await prisma.board.create({
    data: {
      name,
      description,
      workspaceId,
      icon,
      tag,
      ownerId: userId,
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
  const { title, description, order, priority, startDate, dueDate, assigneeId } = req.body;
  
  const data: any = {
    title,
    description: description || null,
    order: Number(order || 0),
    priority: priority || "medium",
    columnId: req.params.columnId as string,
  };

  if (startDate) data.startDate = new Date(startDate);
  if (dueDate) data.dueDate = new Date(dueDate);
  if (assigneeId && assigneeId !== 'none') data.assigneeId = assigneeId;

  const card = await prisma.card.create({ data });
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

export const updateCardFull = async (req: Request, res: Response) => {
  const { title, description, priority, startDate, dueDate, assigneeId } = req.body;
  
  const data: any = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description || null;
  if (priority !== undefined) data.priority = priority;

  if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
  if (assigneeId !== undefined) data.assigneeId = (assigneeId && assigneeId !== 'none') ? assigneeId : null;

  try {
    const card = await prisma.card.update({
      where: { id: req.params.cardId as string },
      data
    });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update card' });
  }
};
export const deleteCard = async (req: Request, res: Response) => {
  try {
    await prisma.card.delete({
      where: { id: req.params.cardId as string }
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
};
