import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .populate('parent')
    .populate('children');
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('parent')
    .populate('children');

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate('parent')
    .populate('children');

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, slug, parent } = req.body;

  const categoryExists = await Category.findOne({ slug });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this slug already exists');
  }

  const category = await Category.create({
    name,
    description,
    slug,
    parent: parent || null,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, slug, parent } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    // Check if new slug is unique (if changed)
    if (slug && slug !== category.slug) {
      const slugExists = await Category.findOne({ slug });
      if (slugExists) {
        res.status(400);
        throw new Error('Category with this slug already exists');
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.slug = slug || category.slug;
    category.parent = parent || category.parent;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Check if category has children
    const hasChildren = await Category.exists({ parent: category._id });
    if (hasChildren) {
      res.status(400);
      throw new Error('Cannot delete category with subcategories');
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};