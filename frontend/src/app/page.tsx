'use client';

import React, { useEffect } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { useBoardStore } from '@/store/useBoardStore';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { fetchBoard, board, loading } = useBoardStore();
  const { activeBoardId } = useAppStore();

  useEffect(() => {
    // When activeBoardId changes in the app store, fetch that board data
    if (activeBoardId) {
      fetchBoard(activeBoardId);
    }
  }, [activeBoardId, fetchBoard]);

  if (loading || !board) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading board...</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <KanbanBoard />
    </div>
  );
}
