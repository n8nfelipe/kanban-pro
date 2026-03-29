'use client';

import React, { useEffect } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { useBoardStore } from '@/store/useBoardStore';

export default function Home() {
  const { fetchBoard, board } = useBoardStore();

  useEffect(() => {
    // Initializing with mock data for the demo if no board is loaded
    // In a real app, this would fetch from the API
    if (!board) {
      const mockBoard = {
        id: 'board-1',
        name: 'Sprint Backlog',
        columns: [
          {
            id: 'col-1',
            title: 'Backlog',
            order: 0,
            cards: [
              { id: 'card-1', title: 'Implement JWT Auth', description: 'Setup backend routes and middleware', priority: 'high', order: 0 },
              { id: 'card-2', title: 'Design System Tokens', description: 'Define colors and spacing', priority: 'medium', order: 1 },
            ]
          },
          {
            id: 'col-2',
            title: 'To Do',
            order: 1,
            cards: [
              { id: 'card-3', title: 'Socket.io Integration', description: 'Real-time updates for drag and drop', priority: 'urgent', order: 0 },
            ]
          },
          {
            id: 'col-3',
            title: 'In Progress',
            order: 2,
            cards: [
              { id: 'card-4', title: 'Next.js Boilerplate', description: 'Configure app router and tailwind', priority: 'low', order: 0 },
            ]
          },
          {
            id: 'col-4',
            title: 'Done',
            order: 3,
            cards: [
              { id: 'card-5', title: 'Database Schema', description: 'Define models in Prisma', priority: 'medium', order: 0 },
            ]
          }
        ]
      };
      
      // Manually setting mock board for immediate visual feedback
      useBoardStore.setState({ board: mockBoard });
    }
  }, [board]);

  return (
    <div className="h-full">
      <KanbanBoard />
    </div>
  );
}
