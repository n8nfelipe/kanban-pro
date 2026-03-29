const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create users using id as the unique key for upsert
  const users = [
    { id: 'user-jd', email: 'john@example.com', name: 'John Doe', password: 'password123' },
    { id: 'user-al', email: 'alice@example.com', name: 'Alice Lee', password: 'password123' },
    { id: 'user-mr', email: 'mike@example.com', name: 'Mike Ross', password: 'password123' },
    { id: 'user-sc', email: 'sarah@example.com', name: 'Sarah Connor', password: 'password123' },
  ];

  const createdUsers = {};
  for (const u of users) {
    createdUsers[u.id] = await prisma.user.upsert({
      where: { id: u.id },
      update: { email: u.email, name: u.name },
      create: u,
    });
  }

  const userMap = {
    'JD': 'user-jd',
    'AL': 'user-al',
    'MR': 'user-mr',
    'SC': 'user-sc',
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

  // 3. Boards
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
        ownerId: 'user-jd',
      },
    });

    // Clean existing cards and columns for the board
    await prisma.card.deleteMany({ where: { column: { boardId: b.id } } });
    await prisma.column.deleteMany({ where: { boardId: b.id } });

    for (const col of b.columns) {
      const createdCol = await prisma.column.create({
        data: {
          title: col.title,
          order: col.order,
          boardId: b.id,
        }
      });

      for (const card of col.cards) {
        await prisma.card.create({
          data: {
            title: card.title,
            description: card.description,
            priority: card.priority,
            order: card.order,
            startDate: card.startDate ? new Date(card.startDate) : null,
            dueDate: card.dueDate ? new Date(card.dueDate) : null,
            columnId: createdCol.id,
            assigneeId: userMap[card.assigneeId] || null,
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
