import mongoose from 'mongoose';
import GroceryCategory from '../models/GroceryCategory.js';
import GrocerySubcategory from '../models/GrocerySubcategory.js';
import GroceryProduct from '../models/GroceryProduct.js';
import GroceryPlan from '../models/GroceryPlan.js';

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const normalizeSubcategoryIds = (subcategoryIds) => {
  if (!Array.isArray(subcategoryIds)) {
    return [];
  }

  const unique = new Set();
  subcategoryIds.forEach((id) => {
    if (isValidObjectId(id)) {
      unique.add(id.toString());
    }
  });

  return Array.from(unique);
};

const normalizePlanProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map((item) => ({
      name: (item?.name || '').toString().trim(),
      qty: (item?.qty || '').toString().trim(),
    }))
    .filter((item) => item.name && item.qty);
};

export const getCategories = async (req, res) => {
  try {
    const { section, includeSubcategories, activeOnly = 'true' } = req.query;
    const filter = {};

    if (activeOnly !== 'false') {
      filter.isActive = true;
    }

    if (section) {
      filter.section = section;
    }

    const categories = await GroceryCategory.find(filter).sort({ section: 1, order: 1, name: 1 }).lean();

    if (includeSubcategories !== 'true') {
      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    }

    const categoryIds = categories.map((category) => category._id);
    const subcategories = await GrocerySubcategory.find({
      category: { $in: categoryIds },
      isActive: true,
    })
      .sort({ order: 1, name: 1 })
      .lean();

    const subcategoriesByCategoryId = new Map();
    subcategories.forEach((subcategory) => {
      const categoryId = subcategory.category.toString();
      if (!subcategoriesByCategoryId.has(categoryId)) {
        subcategoriesByCategoryId.set(categoryId, []);
      }
      subcategoriesByCategoryId.get(categoryId).push(subcategory);
    });

    const categoriesWithSubcategories = categories.map((category) => ({
      ...category,
      subcategories: subcategoriesByCategoryId.get(category._id.toString()) || [],
    }));

    return res.status(200).json({
      success: true,
      count: categoriesWithSubcategories.length,
      data: categoriesWithSubcategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch grocery categories',
      error: error.message,
    });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const { categoryId, activeOnly = 'true' } = req.query;
    const filter = {};

    if (activeOnly !== 'false') {
      filter.isActive = true;
    }

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categoryId',
        });
      }
      filter.category = categoryId;
    }

    const subcategories = await GrocerySubcategory.find(filter)
      .populate('category', 'name slug section')
      .sort({ order: 1, name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: subcategories.length,
      data: subcategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch grocery subcategories',
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { categoryId, subcategoryId, limit, activeOnly = 'true' } = req.query;
    const filter = {};

    if (activeOnly !== 'false') {
      filter.isActive = true;
    }

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categoryId',
        });
      }
      filter.category = categoryId;
    }

    if (subcategoryId) {
      if (!isValidObjectId(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subcategoryId',
        });
      }
      filter.$or = [{ subcategories: subcategoryId }, { subcategory: subcategoryId }];
    }

    const parsedLimit = Number.parseInt(limit, 10);
    const query = GroceryProduct.find(filter)
      .populate('category', 'name slug section')
      .populate('subcategories', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ order: 1, createdAt: -1 });

    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      query.limit(parsedLimit);
    }

    const products = await query.lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch grocery products',
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const category = await GroceryCategory.findById(id).lean();
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch category', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, image = '', description = '', section = 'Grocery & Kitchen', order = 0, isActive = true } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const normalizedSlug = slugify(slug || name);
    const existing = await GroceryCategory.findOne({ slug: normalizedSlug }).lean();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category slug already exists' });
    }

    const category = await GroceryCategory.create({
      name: name.trim(),
      slug: normalizedSlug,
      image,
      description,
      section,
      order: Number(order) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const update = { ...req.body };
    if (update.slug || update.name) {
      update.slug = slugify(update.slug || update.name);
      const existing = await GroceryCategory.findOne({ slug: update.slug, _id: { $ne: id } }).lean();
      if (existing) {
        return res.status(409).json({ success: false, message: 'Category slug already exists' });
      }
    }

    const category = await GroceryCategory.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const [subcategoryCount, productCount] = await Promise.all([
      GrocerySubcategory.countDocuments({ category: id }),
      GroceryProduct.countDocuments({ category: id }),
    ]);

    if (subcategoryCount > 0 || productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with linked subcategories or products',
      });
    }

    const category = await GroceryCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
};

export const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory id' });
    }

    const subcategory = await GrocerySubcategory.findById(id).populate('category', 'name slug').lean();
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    return res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subcategory', error: error.message });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const { category, name, slug, image = '', description = '', order = 0, isActive = true } = req.body;
    if (!category || !name) {
      return res.status(400).json({ success: false, message: 'Category and name are required' });
    }
    if (!isValidObjectId(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const categoryExists = await GroceryCategory.findById(category).lean();
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const normalizedSlug = slugify(slug || name);
    const existing = await GrocerySubcategory.findOne({ category, slug: normalizedSlug }).lean();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Subcategory slug already exists in this category' });
    }

    const subcategory = await GrocerySubcategory.create({
      category,
      name: name.trim(),
      slug: normalizedSlug,
      image,
      description,
      order: Number(order) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({ success: true, data: subcategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create subcategory', error: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory id' });
    }

    const existingSubcategory = await GrocerySubcategory.findById(id).lean();
    if (!existingSubcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    const update = { ...req.body };
    const categoryId = update.category || existingSubcategory.category?.toString();
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    if (update.slug || update.name) {
      update.slug = slugify(update.slug || update.name || existingSubcategory.name);
      const duplicate = await GrocerySubcategory.findOne({
        category: categoryId,
        slug: update.slug,
        _id: { $ne: id },
      }).lean();
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Subcategory slug already exists in this category' });
      }
    }

    const subcategory = await GrocerySubcategory.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update subcategory', error: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subcategory id' });
    }

    const linkedProducts = await GroceryProduct.countDocuments({
      $or: [{ subcategories: id }, { subcategory: id }],
    });
    if (linkedProducts > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete subcategory linked to products',
      });
    }

    const subcategory = await GrocerySubcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    return res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete subcategory', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await GroceryProduct.findById(id)
      .populate('category', 'name slug section')
      .populate('subcategories', 'name slug')
      .populate('subcategory', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      category,
      subcategories = [],
      name,
      slug,
      images = [],
      description = '',
      mrp,
      sellingPrice,
      unit = '',
      isActive = true,
      inStock = true,
      stockQuantity = 0,
      order = 0,
    } = req.body;

    if (!category || !name || mrp === undefined || sellingPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Category, name, mrp and sellingPrice are required',
      });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const categoryExists = await GroceryCategory.findById(category).lean();
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const normalizedSubcategories = normalizeSubcategoryIds(subcategories);
    if (normalizedSubcategories.length > 0) {
      const subcategoryCount = await GrocerySubcategory.countDocuments({
        _id: { $in: normalizedSubcategories },
        category,
      });
      if (subcategoryCount !== normalizedSubcategories.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more subcategories are invalid for this category',
        });
      }
    }

    const normalizedSlug = slugify(slug || name);
    const existing = await GroceryProduct.findOne({ slug: normalizedSlug }).lean();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }

    const product = await GroceryProduct.create({
      category,
      subcategories: normalizedSubcategories,
      // keep first value in legacy field for old consumers
      subcategory: normalizedSubcategories[0] || null,
      name: name.trim(),
      slug: normalizedSlug,
      images: Array.isArray(images) ? images : [],
      description,
      mrp,
      sellingPrice,
      unit,
      isActive: Boolean(isActive),
      inStock: Boolean(inStock),
      stockQuantity: Number(stockQuantity) || 0,
      order: Number(order) || 0,
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const existingProduct = await GroceryProduct.findById(id).lean();
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const update = { ...req.body };
    const categoryId = update.category || existingProduct.category?.toString();
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    if (update.slug || update.name) {
      update.slug = slugify(update.slug || update.name || existingProduct.name);
      const duplicate = await GroceryProduct.findOne({ slug: update.slug, _id: { $ne: id } }).lean();
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Product slug already exists' });
      }
    }

    if (update.subcategories !== undefined) {
      const normalizedSubcategories = normalizeSubcategoryIds(update.subcategories);
      if (normalizedSubcategories.length > 0) {
        const subcategoryCount = await GrocerySubcategory.countDocuments({
          _id: { $in: normalizedSubcategories },
          category: categoryId,
        });
        if (subcategoryCount !== normalizedSubcategories.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more subcategories are invalid for this category',
          });
        }
      }

      update.subcategories = normalizedSubcategories;
      update.subcategory = normalizedSubcategories[0] || null;
    }

    const product = await GroceryProduct.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await GroceryProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const { activeOnly = 'true' } = req.query;
    const filter = {};
    if (activeOnly !== 'false') {
      filter.isActive = true;
    }

    const plans = await GroceryPlan.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch grocery plans',
      error: error.message,
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid plan id' });
    }

    const plan = await GroceryPlan.findById(id).lean();
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch plan', error: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const {
      key,
      name,
      description = '',
      itemsLabel = '',
      productCount = 0,
      deliveries = 0,
      frequency = '',
      price,
      durationDays,
      iconKey = 'zap',
      color = 'bg-emerald-500',
      headerColor = 'bg-emerald-500',
      popular = false,
      benefits = [],
      products = [],
      vegProducts = [],
      nonVegProducts = [],
      order = 0,
      isActive = true,
    } = req.body;

    if (!name || price === undefined || durationDays === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, price and durationDays are required',
      });
    }

    const normalizedKey = slugify(key || name);
    const exists = await GroceryPlan.findOne({ key: normalizedKey }).lean();
    if (exists) {
      return res.status(409).json({ success: false, message: 'Plan key already exists' });
    }

    const normalizedProducts = normalizePlanProducts(products);
    const normalizedVegProducts = normalizePlanProducts(vegProducts);
    const normalizedNonVegProducts = normalizePlanProducts(nonVegProducts);
    const mergedProducts =
      normalizedProducts.length > 0 ? normalizedProducts : [...normalizedVegProducts, ...normalizedNonVegProducts];

    const plan = await GroceryPlan.create({
      key: normalizedKey,
      name: name.trim(),
      description,
      itemsLabel,
      productCount: Number(productCount) || 0,
      deliveries: Number(deliveries) || 0,
      frequency,
      price: Number(price),
      durationDays: Number(durationDays),
      iconKey,
      color,
      headerColor,
      popular: Boolean(popular),
      benefits: Array.isArray(benefits) ? benefits.filter(Boolean) : [],
      products: mergedProducts,
      vegProducts: normalizedVegProducts,
      nonVegProducts: normalizedNonVegProducts,
      order: Number(order) || 0,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create plan', error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid plan id' });
    }

    const existing = await GroceryPlan.findById(id).lean();
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const update = { ...req.body };
    if (update.key || update.name) {
      update.key = slugify(update.key || update.name || existing.name);
      const duplicate = await GroceryPlan.findOne({ key: update.key, _id: { $ne: id } }).lean();
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Plan key already exists' });
      }
    }

    if (update.price !== undefined) update.price = Number(update.price);
    if (update.durationDays !== undefined) update.durationDays = Number(update.durationDays);
    if (update.productCount !== undefined) update.productCount = Number(update.productCount) || 0;
    if (update.deliveries !== undefined) update.deliveries = Number(update.deliveries) || 0;
    if (update.order !== undefined) update.order = Number(update.order) || 0;
    if (update.products !== undefined) update.products = normalizePlanProducts(update.products);
    if (update.vegProducts !== undefined) update.vegProducts = normalizePlanProducts(update.vegProducts);
    if (update.nonVegProducts !== undefined) update.nonVegProducts = normalizePlanProducts(update.nonVegProducts);

    if (update.vegProducts !== undefined || update.nonVegProducts !== undefined) {
      const nextVegProducts = update.vegProducts ?? normalizePlanProducts(existing.vegProducts);
      const nextNonVegProducts = update.nonVegProducts ?? normalizePlanProducts(existing.nonVegProducts);

      if (update.products === undefined || update.products.length === 0) {
        update.products = [...nextVegProducts, ...nextNonVegProducts];
      }
    }

    const plan = await GroceryPlan.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update plan', error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid plan id' });
    }

    const plan = await GroceryPlan.findByIdAndDelete(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    return res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete plan', error: error.message });
  }
};
