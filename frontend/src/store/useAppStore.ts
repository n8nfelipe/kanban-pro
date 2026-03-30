import { create } from 'zustand';
import api from '../services/api';

export type MainAppView = 'Kanban' | 'Team' | 'Inbox' | 'Settings';
export type KanbanTab = 'Board' | 'List' | 'Timeline' | 'Analytics';

interface AppState {
  activeWorkspaceId: string;
  activeBoardId: string;
  mainAppView: MainAppView;
  kanbanActiveTab: KanbanTab;
  workspacesConfig: any[];
  boardsList: any[];
  isNewTaskModalOpen: boolean;
  newTaskTargetColumnId: string | null;
  editTaskId: string | null;
  isNewBoardModalOpen: boolean;
  searchQuery: string;
  
  fetchWorkspaces: () => Promise<void>;
  setWorkspace: (id: string) => void;
  setBoard: (id: string) => void;
  setMainView: (view: MainAppView) => void;
  setKanbanTab: (tab: KanbanTab) => void;
  openNewTaskModal: (colId?: string, taskId?: string) => void;
  closeNewTaskModal: () => void;
  openNewBoardModal: () => void;
  closeNewBoardModal: () => void;
  addBoard: (boardData: any) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeWorkspaceId: '',
  activeBoardId: '',     
  mainAppView: 'Kanban',
  kanbanActiveTab: 'Board',
  workspacesConfig: [],
  boardsList: [],
  isNewTaskModalOpen: false,
  newTaskTargetColumnId: null,
  editTaskId: null,
  isNewBoardModalOpen: false,
  searchQuery: '',

  fetchWorkspaces: async () => {
    try {
      const res = await api.get('/api/workspaces');
      const data = res.data;
      
      if (data && Array.isArray(data) && data.length > 0) {
        const firstWs = data[0];
        const allBoards = data.flatMap((w: any) => w.boards || []);
        
        set({
          workspacesConfig: data,
          boardsList: allBoards,
          activeWorkspaceId: firstWs.id,
          activeBoardId: firstWs.boards && firstWs.boards[0] ? firstWs.boards[0].id : '',
          mainAppView: 'Kanban'
        });
      }
    } catch(err) {
      console.error('Error fetching workspaces:', err);
    }
  },

  setWorkspace: (id) => {
    const state = get();
    const firstBoard = state.boardsList.find(b => b.workspaceId === id);
    set({ 
      activeWorkspaceId: id, 
      activeBoardId: firstBoard ? firstBoard.id : '',
      mainAppView: 'Kanban' 
    });
  },
  
  setBoard: (id) => set({ activeBoardId: id, mainAppView: 'Kanban' }),
  setMainView: (view) => set({ mainAppView: view }),
  setKanbanTab: (tab) => set({ kanbanActiveTab: tab, mainAppView: 'Kanban' }),
  openNewTaskModal: (colId, taskId) => set({ isNewTaskModalOpen: true, newTaskTargetColumnId: colId || null, editTaskId: taskId || null }),
  closeNewTaskModal: () => set({ isNewTaskModalOpen: false, newTaskTargetColumnId: null, editTaskId: null }),
  openNewBoardModal: () => set({ isNewBoardModalOpen: true }),
  closeNewBoardModal: () => set({ isNewBoardModalOpen: false }),
  addBoard: async (boardData) => {
    const state = get();
    try {
      const response = await api.post('/boards', {
        ...boardData,
        workspaceId: state.activeWorkspaceId
      });
      const newBoard = response.data; // Assuming axios-like response
      
      set({
        boardsList: [...state.boardsList, newBoard],
        activeBoardId: newBoard.id,
        isNewBoardModalOpen: false,
        mainAppView: 'Kanban'
      });
    } catch(err) {
      console.error(err);
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
