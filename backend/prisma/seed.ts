import { PrismaClient } from '@prisma/client';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      id: 'user-jd',
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      id: 'user-al',
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice Lee',
    },
  });

  const mike = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      id: 'user-mr',
      email: 'mike@example.com',
      password: 'password123',
      name: 'Mike Ross',
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      id: 'user-sc',
      email: 'sarah@example.com',
      password: 'password123',
      name: 'Sarah Connor',
    },
  });

  const userMap: Record<string, string> = {
    'JD': user.id,
    'AL': alice.id,
    'MR': mike.id,
    'SC': sarah.id,
  };

  // 2. Definir Workspaces
  const workspaces = [
    { id: 'w1', name: 'Engineering', icon: '⬡', accent: '#38bdf8', rgb: '56,189,248' },
    { id: 'w2', name: 'Marketing',   icon: '◈', accent: '#a78bfa', rgb: '167,139,250' },
    { id: 'w3', name: 'Design',      icon: '◎', accent: '#34d399', rgb: '52,211,153' },
  ];

  for (const ws of workspaces) {
    await prisma.workspace.upsert({
      where: { id: ws.id },
      update: ws,
      create: ws,
    });
  }

  // 3. Definir Boards, Columns e Cards
  const boardsData = [
    {
      id: 'b1', workspaceId: 'w1', name: 'Sprint Backlog', icon: 'LayoutGrid', tag: 'ACTIVE',
      columns: [
        { title: 'Backlog', order: 0, cards: [
          { title: 'Implement JWT Auth', description: 'Setup backend routes and middleware', priority: 'high', order: 0, startDate: '2026-03-25', dueDate: '2026-03-30', assigneeId: 'JD' },
          { title: 'Design System Tokens', description: 'Define colors and spacing', priority: 'medium', order: 1, startDate: '2026-03-28', dueDate: '2026-04-05', assigneeId: 'AL' },
        ]},
        { title: 'To Do', order: 1, cards: [
          { title: 'Socket.io Integration', description: 'Real-time updates for drag and drop', priority: 'urgent', order: 0, startDate: '2026-03-29', dueDate: '2026-04-02', assigneeId: 'MR' },
        ]},
        { title: 'In Progress', order: 2, cards: [
          { title: 'Next.js Boilerplate', description: 'Configure app router and tailwind', priority: 'low', order: 0, startDate: '2026-03-20', dueDate: '2026-03-22', assigneeId: 'JD' },
        ]},
        { title: 'Done', order: 3, cards: [
          { title: 'Database Schema', description: 'Define models in Prisma', priority: 'medium', order: 0, startDate: '2026-03-22', dueDate: '2026-03-25', assigneeId: 'AL' },
        ]}
      ]
    },
    {
      id: 'b4', workspaceId: 'w2', name: 'Ad Campaigns', icon: 'Megaphone', tag: 'LIVE',
      columns: [
        { title: 'Ideation', order: 0, cards: [
          { title: 'Summer Sale Promo', description: 'Draft copy for IG and TikTok', priority: 'medium', order: 0, startDate: '2026-03-28', dueDate: '2026-04-10', assigneeId: 'SC' },
        ]},
        { title: 'Active', order: 1, cards: [
          { title: 'B2B LinkedIn Outreach', description: 'Running ads for enterprise tier', priority: 'urgent', order: 0, startDate: '2026-03-15', dueDate: '2026-04-15', assigneeId: 'AL' },
        ]}
      ]
    },
    {
      id: 'b6', workspaceId: 'w3', name: 'UI Overhaul', icon: 'PenTool', tag: 'ACTIVE',
      columns: [
        { title: 'Wireframes', order: 0, cards: [
          { title: 'Settings Page Revamp', description: 'Create dark mode variations', priority: 'high', order: 0, startDate: '2026-03-26', dueDate: '2026-03-29', assigneeId: 'MR' },
        ]},
        { title: 'Review', order: 1, cards: [
          { title: 'New Logo Options', description: 'Review iterations with CEO', priority: 'urgent', order: 0, startDate: '2026-03-28', dueDate: '2026-03-31', assigneeId: 'MR' },
        ]}
      ]
    }
  ];

  for (const b of boardsData) {
    await prisma.board.upsert({
      where: { id: b.id },
      update: {
        name: b.name,
        icon: b.icon,
        tag: b.tag,
        workspaceId: b.workspaceId,
      },
      create: {
        id: b.id,
        name: b.name,
        icon: b.icon,
        tag: b.tag,
        workspaceId: b.workspaceId,
        ownerId: user.id,
      },
    });

    for (const col of b.columns) {
      const createdCol = await prisma.column.create({
        data: {
          title: col.title,
          order: col.order,
          boardId: b.id,
        }
      });

      for (const card of col.cards) {
        const assigneeId = card.assigneeId as string;
        await prisma.card.create({
          data: {
            title: card.title,
            description: card.description,
            priority: card.priority,
            order: card.order,
            startDate: card.startDate ? new Date(card.startDate) : null,
            dueDate: card.dueDate ? new Date(card.dueDate) : null,
            columnId: createdCol.id,
            assigneeId: userMap[assigneeId] || null,
          }
        });
      }
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
