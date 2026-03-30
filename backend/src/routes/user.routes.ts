import { Router } from 'express';
import { getUsers, getUserById, updateUser, getWorkspaceMembers } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getUsers);
router.get('/workspace/:workspaceId/members', authMiddleware, getWorkspaceMembers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);

export default router;
