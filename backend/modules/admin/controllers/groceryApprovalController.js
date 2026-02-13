import { asyncHandler } from '../../../shared/middleware/asyncHandler.js';
import { successResponse, errorResponse } from '../../../shared/utils/response.js';
import Menu from '../../restaurant/models/Menu.js';
import Restaurant from '../../restaurant/models/Restaurant.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * Get all pending grocery approval requests
 * GET /api/admin/grocery-approvals
 * This uses the same Menu model but filters by restaurant platform type
 */
export const getPendingGroceryApprovals = asyncHandler(async (req, res) => {
  try {
    // Get restaurants that are grocery stores (you may need to add a platform field to Restaurant model)
    // For now, we'll use the same Menu model but you can filter by restaurant type if needed
    const menus = await Menu.find({ isActive: true })
      .populate({
        path: 'restaurant',
        select: 'name restaurantId platform',
        match: { platform: 'grocery' } // Filter by platform if it exists
      })
      .lean();

    // Filter out menus where restaurant is null (due to populate match)
    const validMenus = menus.filter(menu => menu.restaurant);

    const pendingRequests = [];

    // Iterate through all menus and extract pending items
    for (const menu of validMenus) {
      if (!menu.restaurant) continue;

      // Check items in sections
      for (const section of menu.sections || []) {
        for (const item of section.items || []) {
          if (item.approvalStatus === 'pending') {
            pendingRequests.push({
              _id: item.id,
              id: item.id,
              itemName: item.name,
              category: item.category || '',
              restaurantId: menu.restaurant.restaurantId,
              restaurantName: menu.restaurant.name,
              restaurantMongoId: menu.restaurant._id,
              sectionName: section.name,
              sectionId: section.id,
              price: item.price,
              foodType: item.foodType,
              description: item.description,
              image: item.image || (item.images && item.images[0]) || '',
              images: Array.isArray(item.images) && item.images.length > 0 
                ? item.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
                : [],
              requestedAt: item.requestedAt || menu.createdAt,
              item: item // Full item data
            });
          }
        }

        // Check items in subsections
        for (const subsection of section.subsections || []) {
          for (const item of subsection.items || []) {
            if (item.approvalStatus === 'pending') {
              pendingRequests.push({
                _id: item.id,
                id: item.id,
                itemName: item.name,
                category: item.category || '',
                restaurantId: menu.restaurant.restaurantId,
                restaurantName: menu.restaurant.name,
                restaurantMongoId: menu.restaurant._id,
                sectionName: section.name,
                sectionId: section.id,
                subsectionName: subsection.name,
                subsectionId: subsection.id,
                price: item.price,
                foodType: item.foodType,
                description: item.description,
                image: item.image || (item.images && item.images[0]) || '',
                images: Array.isArray(item.images) && item.images.length > 0 
                  ? item.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
                  : [],
                requestedAt: item.requestedAt || menu.createdAt,
                item: item // Full item data
              });
            }
          }
        }
      }

      // Check add-ons
      for (const addon of menu.addons || []) {
        if (addon.approvalStatus === 'pending') {
          pendingRequests.push({
            _id: addon.id,
            id: addon.id,
            itemName: addon.name,
            category: 'Add-on',
            type: 'addon', // Mark as addon
            restaurantId: menu.restaurant.restaurantId,
            restaurantName: menu.restaurant.name,
            restaurantMongoId: menu.restaurant._id,
            price: addon.price,
            description: addon.description,
            image: addon.image || (addon.images && addon.images[0]) || '',
            images: Array.isArray(addon.images) && addon.images.length > 0 
              ? addon.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
              : [],
            requestedAt: addon.requestedAt || menu.createdAt,
            item: addon // Full addon data
          });
        }
      }
    }

    // Sort by requested date (newest first)
    pendingRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

    logger.info(`Fetched ${pendingRequests.length} pending grocery approval requests`);

    return successResponse(res, 200, 'Pending grocery approvals retrieved successfully', {
      requests: pendingRequests,
      total: pendingRequests.length
    });
  } catch (error) {
    logger.error(`Error fetching pending grocery approvals: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to fetch pending grocery approvals');
  }
});

/**
 * Approve a grocery item
 * POST /api/admin/grocery-approvals/:id/approve
 * Uses the same logic as food approval but for grocery items
 */
export const approveGroceryItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const menus = await Menu.find({ isActive: true }).lean();
    let foundItem = null;
    let foundMenu = null;
    let foundSection = null;
    let foundSubsection = null;
    let itemIndex = -1;
    let isAddon = false;

    // Search for the item/addon across all menus
    for (const menu of menus) {
      // Check add-ons first
      itemIndex = (menu.addons || []).findIndex(addon => addon.id === id);
      if (itemIndex !== -1) {
        foundItem = menu.addons[itemIndex];
        foundMenu = menu;
        isAddon = true;
        break;
      }

      // Check items in sections
      for (const section of menu.sections || []) {
        itemIndex = section.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          foundItem = section.items[itemIndex];
          foundMenu = menu;
          foundSection = section;
          break;
        }

        for (const subsection of section.subsections || []) {
          itemIndex = subsection.items.findIndex(item => item.id === id);
          if (itemIndex !== -1) {
            foundItem = subsection.items[itemIndex];
            foundMenu = menu;
            foundSection = section;
            foundSubsection = subsection;
            break;
          }
        }
        if (foundItem) break;
      }
      if (foundItem) break;
    }

    if (!foundItem) {
      return errorResponse(res, 404, 'Grocery item or add-on not found');
    }

    if (foundItem.approvalStatus === 'approved') {
      return errorResponse(res, 400, 'Grocery item is already approved');
    }

    // Update the item's approval status
    const menu = await Menu.findById(foundMenu._id);
    if (!menu) {
      return errorResponse(res, 404, 'Menu not found');
    }

    // Handle add-on approval
    if (isAddon) {
      const addonIndex = menu.addons.findIndex(a => String(a.id) === String(id));
      if (addonIndex !== -1) {
        const addon = menu.addons[addonIndex];
        addon.approvalStatus = 'approved';
        addon.approvedAt = new Date();
        addon.approvedBy = adminId;
        addon.rejectionReason = '';
        
        menu.markModified(`addons.${addonIndex}`);
        menu.markModified('addons');
        await menu.save();
        
        return successResponse(res, 200, 'Grocery add-on approved successfully', {
          addon: {
            id: addon.id,
            name: addon.name,
            approvalStatus: addon.approvalStatus,
            approvedAt: addon.approvedAt
          }
        });
      }
      return errorResponse(res, 404, 'Add-on not found in menu');
    }

    // Find and update the item directly in the document
    let itemUpdated = false;
    
    for (let sectionIndex = 0; sectionIndex < menu.sections.length; sectionIndex++) {
      const section = menu.sections[sectionIndex];
      
      if (String(section.id) !== String(foundSection.id)) {
        continue;
      }
      
      if (foundSubsection) {
        const subsectionIndex = section.subsections.findIndex(s => String(s.id) === String(foundSubsection.id));
        if (subsectionIndex !== -1) {
          const subsection = section.subsections[subsectionIndex];
          const itemIndex = subsection.items.findIndex(i => String(i.id) === String(id));
          if (itemIndex !== -1) {
            const item = subsection.items[itemIndex];
            item.approvalStatus = 'approved';
            item.approvedAt = new Date();
            item.approvedBy = adminId;
            item.rejectionReason = '';
            itemUpdated = true;
            
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}.items.${itemIndex}`);
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}.items`);
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}`);
            menu.markModified(`sections.${sectionIndex}.subsections`);
            menu.markModified(`sections.${sectionIndex}`);
            menu.markModified('sections');
            break;
          }
        }
      } else {
        const itemIndex = section.items.findIndex(i => String(i.id) === String(id));
        if (itemIndex !== -1) {
          const item = section.items[itemIndex];
          item.approvalStatus = 'approved';
          item.approvedAt = new Date();
          item.approvedBy = adminId;
          item.rejectionReason = '';
          itemUpdated = true;
          
          menu.markModified(`sections.${sectionIndex}.items.${itemIndex}`);
          menu.markModified(`sections.${sectionIndex}.items`);
          menu.markModified(`sections.${sectionIndex}`);
          menu.markModified('sections');
          break;
        }
      }
    }

    if (!itemUpdated) {
      return errorResponse(res, 404, 'Grocery item not found in menu');
    }

    await menu.save();
    
    const savedMenu = await Menu.findById(foundMenu._id).lean();
    const savedItem = savedMenu.sections
      .flatMap(s => [
        ...(s.items || []),
        ...(s.subsections || []).flatMap(sub => sub.items || [])
      ])
      .find(i => String(i.id) === String(id));
    
    if (!savedItem || savedItem.approvalStatus !== 'approved') {
      return errorResponse(res, 500, 'Failed to update approval status in database');
    }

    logger.info(`Grocery item approved: ${id}`, {
      approvedBy: adminId,
      itemName: foundItem.name,
      restaurantId: foundMenu.restaurant
    });

    return successResponse(res, 200, 'Grocery item approved successfully', {
      itemId: id,
      itemName: savedItem.name,
      approvalStatus: savedItem.approvalStatus,
      approvedAt: savedItem.approvedAt,
      approvedBy: savedItem.approvedBy,
      restaurantId: foundMenu.restaurant,
      message: 'Grocery item has been approved and is now visible to users (if toggle is ON)'
    });
  } catch (error) {
    logger.error(`Error approving grocery item: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to approve grocery item');
  }
});

/**
 * Reject a grocery item
 * POST /api/admin/grocery-approvals/:id/reject
 */
export const rejectGroceryItem = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user._id;

    if (!reason || !reason.trim()) {
      return errorResponse(res, 400, 'Rejection reason is required');
    }

    const menus = await Menu.find({ isActive: true }).lean();
    let foundItem = null;
    let foundMenu = null;
    let foundSection = null;
    let foundSubsection = null;
    let isAddon = false;

    // Search for the item/addon across all menus
    for (const menu of menus) {
      const addonIndex = (menu.addons || []).findIndex(addon => addon.id === id);
      if (addonIndex !== -1) {
        foundItem = menu.addons[addonIndex];
        foundMenu = menu;
        isAddon = true;
        break;
      }

      for (const section of menu.sections || []) {
        const itemIndex = section.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          foundItem = section.items[itemIndex];
          foundMenu = menu;
          foundSection = section;
          break;
        }

        for (const subsection of section.subsections || []) {
          const itemIndex = subsection.items.findIndex(item => item.id === id);
          if (itemIndex !== -1) {
            foundItem = subsection.items[itemIndex];
            foundMenu = menu;
            foundSection = section;
            foundSubsection = subsection;
            break;
          }
        }
        if (foundItem) break;
      }
      if (foundItem) break;
    }

    if (!foundItem) {
      return errorResponse(res, 404, 'Grocery item or add-on not found');
    }

    if (foundItem.approvalStatus === 'rejected') {
      return errorResponse(res, 400, 'Grocery item is already rejected');
    }

    const menu = await Menu.findById(foundMenu._id);
    if (!menu) {
      return errorResponse(res, 404, 'Menu not found');
    }

    // Handle add-on rejection
    if (isAddon) {
      const addonIndex = menu.addons.findIndex(a => String(a.id) === String(id));
      if (addonIndex !== -1) {
        const addon = menu.addons[addonIndex];
        addon.approvalStatus = 'rejected';
        addon.rejectionReason = reason.trim();
        addon.rejectedAt = new Date();
        addon.approvedBy = adminId;
        addon.approvedAt = null;
        
        menu.markModified(`addons.${addonIndex}`);
        menu.markModified('addons');
        await menu.save();
        
        return successResponse(res, 200, 'Grocery add-on rejected successfully', {
          addon: {
            id: addon.id,
            name: addon.name,
            approvalStatus: addon.approvalStatus,
            rejectedAt: addon.rejectedAt,
            rejectionReason: addon.rejectionReason
          }
        });
      }
      return errorResponse(res, 404, 'Add-on not found in menu');
    }

    // Find and update the item directly in the document
    let itemUpdated = false;
    
    for (let sectionIndex = 0; sectionIndex < menu.sections.length; sectionIndex++) {
      const section = menu.sections[sectionIndex];
      
      if (String(section.id) !== String(foundSection.id)) {
        continue;
      }
      
      if (foundSubsection) {
        const subsectionIndex = section.subsections.findIndex(s => String(s.id) === String(foundSubsection.id));
        if (subsectionIndex !== -1) {
          const subsection = section.subsections[subsectionIndex];
          const itemIndex = subsection.items.findIndex(i => String(i.id) === String(id));
          if (itemIndex !== -1) {
            const item = subsection.items[itemIndex];
            item.approvalStatus = 'rejected';
            item.rejectionReason = reason.trim();
            item.rejectedAt = new Date();
            item.approvedBy = adminId;
            item.approvedAt = null;
            itemUpdated = true;
            
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}.items.${itemIndex}`);
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}.items`);
            menu.markModified(`sections.${sectionIndex}.subsections.${subsectionIndex}`);
            menu.markModified(`sections.${sectionIndex}.subsections`);
            menu.markModified(`sections.${sectionIndex}`);
            menu.markModified('sections');
            break;
          }
        }
      } else {
        const itemIndex = section.items.findIndex(i => String(i.id) === String(id));
        if (itemIndex !== -1) {
          const item = section.items[itemIndex];
          item.approvalStatus = 'rejected';
          item.rejectionReason = reason.trim();
          item.rejectedAt = new Date();
          item.approvedBy = adminId;
          item.approvedAt = null;
          itemUpdated = true;
          
          menu.markModified(`sections.${sectionIndex}.items.${itemIndex}`);
          menu.markModified(`sections.${sectionIndex}.items`);
          menu.markModified(`sections.${sectionIndex}`);
          menu.markModified('sections');
          break;
        }
      }
    }

    if (!itemUpdated) {
      return errorResponse(res, 404, 'Grocery item not found in menu');
    }

    await menu.save();
    
    const savedMenu = await Menu.findById(foundMenu._id).lean();
    const savedItem = savedMenu.sections
      .flatMap(s => [
        ...(s.items || []),
        ...(s.subsections || []).flatMap(sub => sub.items || [])
      ])
      .find(i => String(i.id) === String(id));
    
    if (!savedItem || savedItem.approvalStatus !== 'rejected') {
      return errorResponse(res, 500, 'Failed to update rejection status in database');
    }

    logger.info(`Grocery item rejected: ${id}`, {
      rejectedBy: adminId,
      itemName: foundItem.name,
      reason: reason.trim(),
      restaurantId: foundMenu.restaurant
    });

    return successResponse(res, 200, 'Grocery item rejected successfully', {
      itemId: id,
      itemName: savedItem.name,
      approvalStatus: savedItem.approvalStatus,
      rejectionReason: savedItem.rejectionReason,
      rejectedAt: savedItem.rejectedAt,
      restaurantId: foundMenu.restaurant,
      message: 'Grocery item has been rejected and will not be visible to users'
    });
  } catch (error) {
    logger.error(`Error rejecting grocery item: ${error.message}`, { error: error.stack });
    return errorResponse(res, 500, 'Failed to reject grocery item');
  }
});
