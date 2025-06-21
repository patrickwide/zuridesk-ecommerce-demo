import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  // Validation
  if (!orderItems?.length) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Validate shipping address
  const requiredFields = ['name', 'phone', 'address', 'city', 'postalCode', 'county', 'country'];
  const missingFields = requiredFields.filter(field => !shippingAddress?.[field]);
  if (missingFields.length) {
    res.status(400);
    throw new Error(`Missing required shipping fields: ${missingFields.join(', ')}`);
  }

  try {
    const enrichedItems = [];
    let subtotal = 0;

    // Validate and update products atomically
    for (const item of orderItems) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        throw new Error('Invalid order item: Each item must have a product ID and quantity > 0');
      }

      // Find and update product stock atomically
      const product = await Product.findOneAndUpdate(
        { 
          _id: item.product,
          countInStock: { $gte: item.quantity }
        },
        { $inc: { countInStock: -item.quantity } },
        { 
          new: true,
          runValidators: true
        }
      );

      if (!product) {
        // If any product update fails, rollback previous updates
        for (const prevItem of enrichedItems) {
          await Product.findByIdAndUpdate(
            prevItem.product,
            { $inc: { countInStock: prevItem.quantity } }
          );
        }
        throw new Error(`Insufficient stock for product ID: ${item.product}`);
      }

      // Enrich order item with product details
      const enrichedItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      };

      enrichedItems.push(enrichedItem);
      subtotal += product.price * item.quantity;
    }

    // Calculate totals
    const tax = subtotal * 0.16; // 16% tax
    const shipping = subtotal > 100 ? 0 : 250; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create the order
    const order = new Order({
      user: req.user._id,
      orderItems: enrichedItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      isPaid: false,
      isDelivered: false,
      status: 'Processing'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email _id');

  if (!order) {
    res.status(404);
    throw new Error('Order not found. It may have been deleted or the ID is incorrect.');
  }

  // Make sure the user is either an admin or the order owner
  // Compare string versions of IDs to ensure proper comparison
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to view this order.');
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate order ownership
  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('This order has already been paid for');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found. It may have been deleted or the ID is incorrect.');
  }

  if (order.isDelivered) {
    res.status(400);
    throw new Error('This order has already been marked as delivered.');
  }

  if (!order.isPaid) {
    res.status(400);
    throw new Error('Order cannot be marked as delivered until it has been paid.');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'Delivered';

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { search, status, period } = req.query;
  
  // Base query - always filter by current user
  let query = { user: req.user._id };
  
  // Add status filter if provided
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Add date filter based on period
  if (period) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(period));
    query.createdAt = { $gte: date };
  }
  
  // Add search filter if provided
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      // Only search text fields with regex
      { 'orderItems.name': searchRegex },
      { 'shippingAddress.name': searchRegex },
      { 'shippingAddress.address': searchRegex },
      { 'shippingAddress.city': searchRegex },
      { 'shippingAddress.county': searchRegex }
    ];
  }

  const orders = await Order.find(query).sort({ createdAt: -1 });
  
  if (orders.length === 0) {
    return res.json({ 
      orders: [],
      message: "No orders found matching your criteria."
    });
  }
  
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const { search, status, paymentStatus } = req.query;
  
  // Base query
  let query = {};
  
  // Add status filter if provided
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Add payment status filter
  if (paymentStatus && paymentStatus !== 'all') {
    query.isPaid = paymentStatus === 'Paid';
  }
  
  // Add search filter if provided
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { 'orderItems.name': searchRegex },
      { 'shippingAddress.name': searchRegex },
      { 'shippingAddress.address': searchRegex },
      { 'shippingAddress.city': searchRegex },
      { 'shippingAddress.county': searchRegex }
    ];
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 }) // Sort by latest first
    .select('-__v') // Exclude version field
    .lean(); // Convert to plain objects for better performance
  
  if (orders.length === 0) {
    return res.json({ 
      orders: [],
      message: "No orders found matching your criteria."
    });
  }
  
  // Format dates for consistency
  const formattedOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt?.toISOString(),
    paidAt: order.paidAt?.toISOString(),
    deliveredAt: order.deliveredAt?.toISOString(),
  }));
  
  res.json(formattedOrders);
});

// @desc    Update order payment method
// @route   PUT /api/orders/:id/payment-method
// @access  Private
const updateOrderPaymentMethod = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate order ownership
  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Cannot change payment method after payment is made');
  }

  order.paymentMethod = req.body.paymentMethod;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Validate order ownership
  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  // Cannot cancel if already paid
  if (order.isPaid) {
    res.status(400);
    throw new Error('Cannot cancel paid orders');
  }

  // Cannot cancel if shipped or delivered
  if (order.status === 'Shipped' || order.status === 'Delivered') {
    res.status(400);
    throw new Error('Cannot cancel orders that have been shipped or delivered');
  }

  order.status = 'Cancelled';
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get dashboard statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get current date and date 30 days ago for comparison
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Current period stats
  const currentPeriodOrders = await Order.find({
    createdAt: { $gte: thirtyDaysAgo },
    status: { $ne: 'Cancelled' }
  });

  // Previous period stats for comparison
  const previousPeriodOrders = await Order.find({
    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    status: { $ne: 'Cancelled' }
  });

  // Active users count (users who placed orders in last 30 days)
  const activeUsers = await Order.distinct('user', {
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Calculate current period metrics
  const currentTotalSales = currentPeriodOrders.reduce((sum, order) => sum + order.total, 0);
  const currentOrderCount = currentPeriodOrders.length;
  const currentAverageOrderValue = currentOrderCount > 0 ? currentTotalSales / currentOrderCount : 0;

  // Calculate previous period metrics for comparison
  const previousTotalSales = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
  const previousOrderCount = previousPeriodOrders.length;
  const previousAverageOrderValue = previousOrderCount > 0 ? previousTotalSales / previousOrderCount : 0;

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  const stats = {
    totalSales: {
      value: currentTotalSales,
      change: calculatePercentageChange(currentTotalSales, previousTotalSales)
    },
    totalOrders: {
      value: currentOrderCount,
      change: calculatePercentageChange(currentOrderCount, previousOrderCount)
    },
    averageOrderValue: {
      value: currentAverageOrderValue,
      change: calculatePercentageChange(currentAverageOrderValue, previousAverageOrderValue)
    },
    activeUsers: {
      value: activeUsers.length,
      change: calculatePercentageChange(activeUsers.length, previousPeriodOrders.length)
    },
    recentOrders: recentOrders.map(order => ({
      id: order._id,
      customer: order.user.name,
      date: order.createdAt,
      total: order.total,
      status: order.status
    }))
  };

  res.json(stats);
});

export {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderPaymentMethod,
  cancelOrder,
  getDashboardStats,
};