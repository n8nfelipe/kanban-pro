import { LayoutGrid, Layers, Star, PenTool, Image as ImageIcon, Send, Megaphone } from 'lucide-react';

export const mockUsers = {
  JD: { id: 'user-jd', name: 'John Doe', initials: 'JD', color: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
  AL: { id: 'user-al', name: 'Alice Lee', initials: 'AL', color: 'linear-gradient(135deg,#a78bfa,#ec4899)' },
  MR: { id: 'user-mr', name: 'Mike Ross', initials: 'MR', color: 'linear-gradient(135deg,#34d399,#059669)' },
  SC: { id: 'user-sc', name: 'Sarah Connor', initials: 'SC', color: 'linear-gradient(135deg,#f472b6,#fb7185)' },
};

export const MOCK_WORKSPACES = [
  { id: 'w1', name: 'Engineering', icon: '⬡', accent: '#38bdf8', rgb: '56,189,248', count: 12 },
  { id: 'w2', name: 'Marketing',   icon: '◈', accent: '#a78bfa', rgb: '167,139,250', count: 5  },
  { id: 'w3', name: 'Design',      icon: '◎', accent: '#34d399', rgb: '52,211,153',  count: 8  },
];

export const MOCK_BOARDS_LIST = [
  // Engineering Boards
  { id: 'b1', workspaceId: 'w1', name: 'Sprint Backlog', icon: LayoutGrid, tag: 'ACTIVE' },
  { id: 'b2', workspaceId: 'w1', name: 'Product Roadmap', icon: Layers, tag: null },
  { id: 'b3', workspaceId: 'w1', name: 'Q2 Milestones', icon: Star, tag: null },
  // Marketing Boards
  { id: 'b4', workspaceId: 'w2', name: 'Ad Campaigns', icon: Megaphone, tag: 'LIVE' },
  { id: 'b5', workspaceId: 'w2', name: 'Content Calendar', icon: Send, tag: null },
  // Design Boards
  { id: 'b6', workspaceId: 'w3', name: 'UI Overhaul', icon: PenTool, tag: 'ACTIVE' },
  { id: 'b7', workspaceId: 'w3', name: 'Design System', icon: ImageIcon, tag: null },
];

export const MOCK_BOARDS_DATA: Record<string, any> = {
  // Engineering: Sprint Backlog
  'b1': {
    id: 'b1', name: 'Sprint Backlog',
    columns: [
      { id: 'c1', title: 'Backlog', order: 0, cards: [
        { id: 'card-1', title: 'Implement JWT Auth', description: 'Setup backend routes and middleware', priority: 'high', order: 0, startDate: '2026-03-25', dueDate: '2026-03-30', assignee: mockUsers.JD },
        { id: 'card-2', title: 'Design System Tokens', description: 'Define colors and spacing', priority: 'medium', order: 1, startDate: '2026-03-28', dueDate: '2026-04-05', assignee: mockUsers.AL },
      ]},
      { id: 'c2', title: 'To Do', order: 1, cards: [
        { id: 'card-3', title: 'Socket.io Integration', description: 'Real-time updates for drag and drop', priority: 'urgent', order: 0, startDate: '2026-03-29', dueDate: '2026-04-02', assignee: mockUsers.MR },
      ]},
      { id: 'c3', title: 'In Progress', order: 2, cards: [
        { id: 'card-4', title: 'Next.js Boilerplate', description: 'Configure app router and tailwind', priority: 'low', order: 0, startDate: '2026-03-20', dueDate: '2026-03-22', assignee: mockUsers.JD },
      ]},
      { id: 'c4', title: 'Done', order: 3, cards: [
        { id: 'card-5', title: 'Database Schema', description: 'Define models in Prisma', priority: 'medium', order: 0, startDate: '2026-03-22', dueDate: '2026-03-25', assignee: mockUsers.AL },
      ]}
    ]
  },
  // Engineering: Product Roadmap
  'b2': {
    id: 'b2', name: 'Product Roadmap',
    columns: [
      { id: 'c1', title: 'Q2 Planning', order: 0, cards: [
        { id: 'card-r1', title: 'Mobile App Beta', description: 'Release early access for iOS', priority: 'urgent', order: 0, startDate: '2026-04-01', dueDate: '2026-05-15', assignee: mockUsers.JD },
      ]},
      { id: 'c2', title: 'Q3 Goals', order: 1, cards: [
        { id: 'card-r2', title: 'AI Assistant Integration', description: 'Embed generative tools into the editor', priority: 'high', order: 0, startDate: '2026-06-01', dueDate: '2026-08-30', assignee: mockUsers.SC },
        { id: 'card-r3', title: 'Multi-region Deployment', description: 'Scale database across EU and US', priority: 'medium', order: 1, startDate: '2026-07-01', dueDate: '2026-09-01', assignee: mockUsers.AL },
      ]},
    ]
  },
  // Engineering: Q2 Milestones
  'b3': {
    id: 'b3', name: 'Q2 Milestones',
    columns: [
      { id: 'c1', title: 'April', order: 0, cards: [
        { id: 'card-m1', title: 'Serverless Migration', description: 'Move microservices to Lambda', priority: 'high', order: 0, startDate: '2026-04-05', dueDate: '2026-04-20', assignee: mockUsers.MR },
      ]}
    ]
  },
  // Marketing: Ad Campaigns
  'b4': {
    id: 'b4', name: 'Ad Campaigns',
    columns: [
      { id: 'c1', title: 'Ideation', order: 0, cards: [
        { id: 'card-mkt1', title: 'Summer Sale Promo', description: 'Draft copy for IG and TikTok', priority: 'medium', order: 0, startDate: '2026-03-28', dueDate: '2026-04-10', assignee: mockUsers.SC },
      ]},
      { id: 'c2', title: 'Active', order: 1, cards: [
        { id: 'card-mkt2', title: 'B2B LinkedIn Outreach', description: 'Running ads for enterprise tier', priority: 'urgent', order: 0, startDate: '2026-03-15', dueDate: '2026-04-15', assignee: mockUsers.AL },
      ]}
    ]
  },
  // Marketing: Content Calendar
  'b5': {
    id: 'b5', name: 'Content Calendar',
    columns: [
      { id: 'c1', title: 'Drafts', order: 0, cards: [
        { id: 'card-mkt3', title: 'Blog: Top 10 Kanban Tips', description: 'SEO focused article', priority: 'low', order: 0, startDate: '2026-04-01', dueDate: '2026-04-05', assignee: mockUsers.SC },
      ]}
    ]
  },
  // Design: UI Overhaul
  'b6': {
    id: 'b6', name: 'UI Overhaul',
    columns: [
      { id: 'c1', title: 'Wireframes', order: 0, cards: [
        { id: 'card-dsg1', title: 'Settings Page Revamp', description: 'Create dark mode variations', priority: 'high', order: 0, startDate: '2026-03-26', dueDate: '2026-03-29', assignee: mockUsers.MR },
      ]},
      { id: 'c2', title: 'Review', order: 1, cards: [
        { id: 'card-dsg2', title: 'New Logo Options', description: 'Review iterations with CEO', priority: 'urgent', order: 0, startDate: '2026-03-28', dueDate: '2026-03-31', assignee: mockUsers.MR },
      ]}
    ]
  },
  // Design: Design System
  'b7': {
    id: 'b7', name: 'Design System',
    columns: [
      { id: 'c1', title: 'Components', order: 0, cards: [
        { id: 'card-dsg3', title: 'Button Variants', description: 'Primary, Ghost, Icon buttons states', priority: 'medium', order: 0, startDate: '2026-03-10', dueDate: '2026-03-20', assignee: mockUsers.AL },
      ]}
    ]
  }
};
