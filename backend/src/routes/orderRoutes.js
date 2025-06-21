import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  updateOrderPaymentMethod,
  cancelOrder,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       description: Quantity to order (must be greater than 0)
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - name
 *                   - phone
 *                   - address
 *                   - city
 *                   - postalCode
 *                   - county
 *                   - country
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Full name of the recipient
 *                   phone:
 *                     type: string
 *                     description: Contact phone number
 *                   address:
 *                     type: string
 *                     description: Street address
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   county:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [PayPal, "Cash on Delivery"]
 *                 description: Payment method for the order
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                 shippingAddress:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *                     county:
 *                       type: string
 *                     country:
 *                       type: string
 *                 paymentMethod:
 *                   type: string
 *                 subtotal:
 *                   type: number
 *                 tax:
 *                   type: number
 *                 shipping:
 *                   type: number
 *                 total:
 *                   type: number
 *                 isPaid:
 *                   type: boolean
 *                 isDelivered:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       400:
 *         description: Invalid order data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin
 */
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Get dashboard statistics (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin
 */
router.route('/stats').get(protect, admin, getDashboardStats);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged in user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Not authorized
 */
router.route('/myorders').get(protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.route('/:id').get(protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Update order to paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentResult:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   status:
 *                     type: string
 *                   update_time:
 *                     type: string
 *                   email_address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.route('/:id/pay').put(protect, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Update order to delivered (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order marked as delivered
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not admin
 *       404:
 *         description: Order not found
 */
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

/**
 * @swagger
 * /api/orders/{id}/payment-method:
 *   put:
 *     summary: Update order payment method
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.route('/:id/payment-method').put(protect, updateOrderPaymentMethod);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.route('/:id/cancel').put(protect, cancelOrder);

export default router;