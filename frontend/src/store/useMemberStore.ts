import { create } from 'zustand';
import api from '@/services/api';

interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count?: {
    cards: number;
    boards: number;
    ownedBoards: number;
  };
}

interface MemberState {
  members: Member[];
  loading: boolean;
  fetchMembers: (workspaceId: string) => Promise<void>;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  loading: false,

  fetchMembers: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/api/users/workspace/${workspaceId}/members`);
      set({ members: res.data, loading: false });
    } catch (err) {
      console.error('Error fetching members:', err);
      set({ loading: false });
    }
  },
}));
