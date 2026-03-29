import { Router } from 'express';
import { getWorkspaces } from '../controllers/workspace.controller';

const router = Router();

router.get('/', getWorkspaces);

export default router;
