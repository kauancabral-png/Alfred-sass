import { Router } from 'express';
import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from '../controllers/transactionController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Todas rotas descritas abaixo sao protegidas, validando primeiro o 'protect' middleware.
router.use(protect);

// Metodos de Manipulacao de Transacoes (CRUD base)
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:id')
    .put(updateTransaction)
    .delete(deleteTransaction);

export default router;
