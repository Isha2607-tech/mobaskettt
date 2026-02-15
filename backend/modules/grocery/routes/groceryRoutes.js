import express from 'express';
import { authenticateAdmin } from '../../admin/middleware/adminAuth.js';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanOffers,
  getPlanOfferById,
  createPlanOffer,
  updatePlanOffer,
  deletePlanOffer,
  getPlanSubscriptions,
} from '../controllers/groceryController.js';

const router = express.Router();

// Categories
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', authenticateAdmin, createCategory);
router.put('/categories/:id', authenticateAdmin, updateCategory);
router.delete('/categories/:id', authenticateAdmin, deleteCategory);

// Subcategories
router.get('/subcategories', getSubcategories);
router.get('/subcategories/:id', getSubcategoryById);
router.post('/subcategories', authenticateAdmin, createSubcategory);
router.put('/subcategories/:id', authenticateAdmin, updateSubcategory);
router.delete('/subcategories/:id', authenticateAdmin, deleteSubcategory);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateAdmin, createProduct);
router.put('/products/:id', authenticateAdmin, updateProduct);
router.delete('/products/:id', authenticateAdmin, deleteProduct);

// Plans
router.get('/plans', getPlans);
router.get('/plans/:id', getPlanById);
router.post('/plans', authenticateAdmin, createPlan);
router.put('/plans/:id', authenticateAdmin, updatePlan);
router.delete('/plans/:id', authenticateAdmin, deletePlan);

// Plan Offers
router.get('/plan-offers', getPlanOffers);
router.get('/plan-offers/:id', getPlanOfferById);
router.post('/plan-offers', authenticateAdmin, createPlanOffer);
router.put('/plan-offers/:id', authenticateAdmin, updatePlanOffer);
router.delete('/plan-offers/:id', authenticateAdmin, deletePlanOffer);

// Plan Subscriptions (Admin)
router.get('/plan-subscriptions', authenticateAdmin, getPlanSubscriptions);

export default router;

