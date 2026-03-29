import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    socket.on('join-board', (boardId: string) => {
      socket.join(boardId);
      console.log(`📌 User joined board: ${boardId}`);
    });

    socket.on('card-moved', (data: { boardId: string; cardId: string; columnId: string; order: number }) => {
      socket.to(data.boardId).emit('card-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('👤 User disconnected');
    });
  });
};
