import { create } from 'zustand';
import api from '../services/api';

interface BoardState {
  board: any | null;
  loading: boolean;
  fetchBoard: (boardId: string) => Promise<void>;
  moveCard: (cardId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  loading: false,
  fetchBoard: async (boardId) => {
    set({ loading: true });
    const res = await api.get(`/boards/${boardId}`);
    set({ board: res.data, loading: false });
  },
  moveCard: (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    const { board } = get();
    if (!board) return;

    const newColumns = [...board.columns];
    const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
    const destCol = newColumns.find((c) => c.id === destColumnId);

    if (!sourceCol || !destCol) return;

    const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);
    destCol.cards.splice(destIndex, 0, movedCard);

    set({ board: { ...board, columns: newColumns } });
  },
}));
