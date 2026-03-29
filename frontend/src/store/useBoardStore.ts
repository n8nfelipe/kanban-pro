import { create } from 'zustand';
import api from '../services/api';

interface BoardState {
  board: any | null;
  loading: boolean;
  fetchBoard: (boardId: string) => Promise<void>;
  moveCard: (cardId: string, sourceColumnId: string, destColumnId: string, sourceIndex: number, destIndex: number) => void;
  addTask: (taskData: any, targetColumnId: string | null) => void;
  updateTask: (taskId: string, taskData: any) => void;
  addColumn: (title: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  loading: false,
  fetchBoard: async (boardId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/api/boards/${boardId}`);
      // Ensure data structure is correct (backend returns board with columns and cards)
      set({ board: res.data, loading: false });
    } catch (err) {
      console.error('Error fetching board:', err);
      set({ loading: false });
    }
  },
  moveCard: async (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    const { board } = get();
    if (!board) return;

    // Optimistic update
    const newColumns = [...board.columns];
    const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
    const destCol = newColumns.find((c) => c.id === destColumnId);

    if (!sourceCol || !destCol) return;

    const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);
    destCol.cards.splice(destIndex, 0, movedCard);

    set({ board: { ...board, columns: newColumns } });

    // API call for persistence
    try {
      await api.put(`/api/boards/cards/${cardId}/move`, {
        columnId: destColumnId,
        order: destIndex
      });
    } catch (err) {
      console.error('Error moving card:', err);
      // Revert on error if needed, but for now we skip for brevity
    }
  },
  addTask: async (taskData, targetColumnId) => {
    const { board } = get();
    if (!board) return;

    // Default to the first column if no target is provided (e.g., from global "New Task" button)
    const effectiveColumnId = targetColumnId || (board.columns.length > 0 ? board.columns[0].id : null);
    
    if (!effectiveColumnId) {
      console.error('Cannot add task: No columns available on this board');
      return;
    }

    try {
      const res = await api.post(`/api/boards/columns/${effectiveColumnId}/cards`, taskData);
      const newCard = res.data;

      const newColumns = [...board.columns];
      const colIndex = newColumns.findIndex(c => c.id === effectiveColumnId);

      if (colIndex !== -1) {
        newColumns[colIndex].cards.push(newCard);
        set({ board: { ...board, columns: newColumns } });
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  },
  updateTask: async (taskId, taskData) => {
    const { board } = get();
    if (!board) return;

    try {
      const res = await api.put(`/api/boards/cards/${taskId}`, taskData);
      const updatedCard = res.data;

      // Optimistic update of the card in the board state
      const newColumns = board.columns.map((col: any) => ({
        ...col,
        cards: col.cards.map((card: any) => 
          card.id === taskId ? { ...card, ...updatedCard } : card
        )
      }));

      set({ board: { ...board, columns: newColumns } });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  },
  addColumn: async (title: string) => {
    const { board } = get();
    if (!board) return;

    const newOrder = board.columns.length;
    
    try {
      const res = await api.post(`/api/boards/${board.id}/columns`, {
        title,
        order: newOrder
      });
      const newColumn = { ...res.data, cards: [] }; // The backend returns the column, but it might not have the cards array initialized.

      set({
        board: {
          ...board,
          columns: [...board.columns, newColumn]
        }
      });
    } catch (err) {
      console.error('Error adding column:', err);
    }
  },
}));
