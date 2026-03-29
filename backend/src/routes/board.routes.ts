import { Router } from 'express';
import { getBoards, createBoard, getBoardDetails, createColumn, createCard, updateCardOrder, updateCardColumn, updateCardFull } from '../controllers/board.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// router.use(authMiddleware); // Temporarily removing auth for frontend connection test

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoardDetails);

router.post('/:id/columns', createColumn);
router.post('/columns/:columnId/cards', createCard);

router.put('/cards/:cardId/order', updateCardOrder);
router.put('/cards/:cardId/move', updateCardColumn);
router.put('/cards/:cardId', updateCardFull);

export default router;
