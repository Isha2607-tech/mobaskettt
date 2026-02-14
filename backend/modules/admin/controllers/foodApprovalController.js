import mongoose from 'mongoose';
import winston from 'winston';
import { asyncHandler } from '../../../shared/middleware/asyncHandler.js';
import { successResponse, errorResponse } from '../../../shared/utils/response.js';
import Order from '../../order/models/Order.js';
import Restaurant from '../../restaurant/models/Restaurant.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const resolveOrderById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    const byMongoId = await Order.findById(id);
    if (byMongoId) return byMongoId;
  }

  return Order.findOne({ orderId: id });
};

const mapOrderToApprovalRow = (order) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const firstImage = items.find((item) => item?.image)?.image || '';
  const images = items.map((item) => item?.image).filter(Boolean);

  return {
    _id: order._id,
    id: order.orderId,
    orderMongoId: order._id,
    orderId: order.orderId,
    itemName: items.map((item) => item.name).filter(Boolean).join(', ') || 'Order items',
    category: 'Order',
    restaurantId: order.restaurantId || '',
    restaurantName: order.restaurantName || '',
    customerName: order.userId?.name || order.userId?.fullName || '',
    customerPhone: order.userId?.phone || '',
    sectionName: `${items.length} item(s)`,
    price: Number(order.pricing?.total || 0),
    requestedAt: order.createdAt,
    description: order.note || '',
    image: firstImage,
    images,
    orderStatus: order.status,
    paymentMethod: order.payment?.method || '',
    paymentStatus: order.payment?.status || '',
    item: {
      quantity: items.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
      items
    },
    order
  };
};

/**
 * Get all pending successful orders for admin approval
 * GET /api/admin/food-approvals
 */
export const getPendingFoodApprovals = asyncHandler(async (req, res) => {
  try {
    const { search = '', limit = 200, platform } = req.query;
    const normalizedPlatform = platform === 'mogrocery' ? 'mogrocery' : (platform === 'mofood' ? 'mofood' : null);

    const baseQuery = {
      status: 'confirmed',
      $or: [
        { 'adminApproval.status': 'pending' },
        { 'adminApproval.status': { $exists: false } },
        { adminApproval: { $exists: false } }
      ]
    };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      baseQuery.$and = [{
        $or: [
          { orderId: regex },
          { restaurantName: regex },
          { restaurantId: regex },
          { 'items.name': regex }
        ]
      }];
    }

    const orders = await Order.find(baseQuery)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 200, 500))
      .populate('userId', 'name fullName phone')
      .lean();

    let filteredOrders = orders;
    if (normalizedPlatform) {
      const restaurantIds = [...new Set(
        orders
          .map((o) => o.restaurantId)
          .filter((id) => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id))
      )];

      if (restaurantIds.length === 0) {
        filteredOrders = [];
      } else {
        const restaurants = await Restaurant.find({
          _id: { $in: restaurantIds },
          platform: normalizedPlatform
        }).select('_id platform').lean();

        const allowedRestaurantIdSet = new Set(restaurants.map((r) => String(r._id)));
        filteredOrders = orders.filter((o) => allowedRestaurantIdSet.has(String(o.restaurantId)));
      }
    }

    const requests = filteredOrders.map(mapOrderToApprovalRow);

    logger.info(`Fetched ${requests.length} pending order approvals`);

    return successResponse(res, 200, 'Pending order approvals retrieved successfully', {
      requests,
      total: requests.length
    });
  } catch (error) {
    logger.error(`Error fetching pending order approvals: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to fetch pending order approvals');
  }
});

/**
 * Approve an order
 * POST /api/admin/food-approvals/:id/approve
 */
export const approveFoodItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?._id || req.admin?._id;

    const order = await resolveOrderById(id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.status === 'cancelled') {
      return errorResponse(res, 400, 'Cannot approve a cancelled order');
    }

    if (order.adminApproval?.status === 'approved') {
      return errorResponse(res, 400, 'Order is already approved');
    }

    order.adminApproval = {
      status: 'approved',
      reason: '',
      reviewedAt: new Date(),
      reviewedBy: adminId || null
    };

    await order.save();

    logger.info(`Order approved by admin: ${order.orderId}`, {
      orderId: order.orderId,
      approvedBy: adminId || null
    });

    return successResponse(res, 200, 'Order approved successfully', {
      orderId: order.orderId,
      orderMongoId: order._id,
      approvalStatus: order.adminApproval.status,
      approvedAt: order.adminApproval.reviewedAt
    });
  } catch (error) {
    logger.error(`Error approving order: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to approve order');
  }
});

/**
 * Reject an order
 * POST /api/admin/food-approvals/:id/reject
 */
export const rejectFoodItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user?._id || req.admin?._id;

    if (!reason || !reason.trim()) {
      return errorResponse(res, 400, 'Rejection reason is required');
    }

    const order = await resolveOrderById(id);
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.adminApproval?.status === 'rejected' || order.status === 'cancelled') {
      return errorResponse(res, 400, 'Order is already rejected/cancelled');
    }

    order.adminApproval = {
      status: 'rejected',
      reason: reason.trim(),
      reviewedAt: new Date(),
      reviewedBy: adminId || null
    };

    order.status = 'cancelled';
    order.cancelledBy = 'admin';
    order.cancellationReason = reason.trim();
    order.cancelledAt = new Date();

    await order.save();

    // For paid orders, calculate refund details (actual refund processing remains admin-controlled flow).
    if (order.payment?.method === 'razorpay' || order.payment?.method === 'wallet') {
      try {
        const { calculateCancellationRefund } = await import('../../order/services/cancellationRefundService.js');
        await calculateCancellationRefund(order._id, reason.trim());
      } catch (refundError) {
        logger.error(`Failed refund calculation after admin rejection for ${order.orderId}: ${refundError.message}`);
      }
    }

    logger.info(`Order rejected by admin: ${order.orderId}`, {
      orderId: order.orderId,
      rejectedBy: adminId || null,
      reason: reason.trim()
    });

    return successResponse(res, 200, 'Order rejected successfully', {
      orderId: order.orderId,
      orderMongoId: order._id,
      approvalStatus: order.adminApproval.status,
      rejectedAt: order.adminApproval.reviewedAt,
      rejectionReason: order.adminApproval.reason
    });
  } catch (error) {
    logger.error(`Error rejecting order: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to reject order');
  }
});
