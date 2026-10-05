import sequelize from '../config/db.js';
import { StockRequest } from '../models/stockRequestModel.js';
import { Stock } from '../models/stockModel.js';
import User from '../models/User.js';

// Get requests filtered by user role and district
export const getStockRequests = async (req, res) => {
  try {
    const user = req.user; // Set by auth middleware
    let filter = {};

    if (user.role === 'STOCKHOLDER') {
      filter = { district: user.district };
    } else if (user.role === 'FRANCHISE') {
      filter = { franchise_id: user.id };
    }

    const requests = await StockRequest.findAll({
      where: filter,
      include: [
        { model: Stock, as: 'stock' },
        { 
          model: User, 
          as: 'franchise', 
          attributes: ['id', 'name', 'email', 'mobile', 'district', 'area', 'businessType'] 
        },
        { 
          model: User, 
          as: 'stockholder', 
          attributes: ['id', 'name', 'email', 'mobile', 'district'] 
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a stock request routed to the same district Stockholder
export const createStockRequest = async (req, res) => {
  try {
    const franchiseId = req.user.id;
    const { stockId, requestedCount, notes } = req.body;

    if (!stockId || !requestedCount) {
      return res.status(400).json({ success: false, message: 'Stock item and count are required.' });
    }

    // 1. Fetch current Franchise details including businessType
    const franchise = await User.findByPk(franchiseId);
    if (!franchise || !franchise.district) {
      return res.status(400).json({ success: false, message: 'Franchise district location is not defined.' });
    }

    // 2. Find the Stockholder for the same district
    const stockholder = await User.findOne({
      where: {
        role: 'STOCKHOLDER',
        district: franchise.district,
        isActive: true,
      },
    });

    if (!stockholder) {
      return res.status(404).json({
        success: false,
        message: `No active Stockholder found for district: ${franchise.district}`,
      });
    }

    // 3. Create the stock request (franchise_id links directly to User model)
    const newRequest = await StockRequest.create({
      franchise_id: franchise.id,
      stockholder_id: stockholder.id,
      district: franchise.district,
      stock_id: parseInt(stockId, 10),
      requested_count: parseInt(requestedCount, 10),
      notes: notes || '',
    });

    const fullRequest = await StockRequest.findByPk(newRequest.id, {
      include: [
        { model: Stock, as: 'stock' },
        { model: User, as: 'franchise', attributes: ['id', 'name', 'email', 'mobile', 'district', 'area', 'businessType'] },
        { model: User, as: 'stockholder', attributes: ['id', 'name', 'email', 'mobile'] },
      ],
    });

    return res.status(201).json({ success: true, data: fullRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update request status (Approved/Rejected) and deduct stock
export const updateRequestStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await StockRequest.findByPk(id, { transaction });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Stock request not found.' });
    }

    if (request.status !== 'PENDING') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    if (status === 'APPROVED') {
      const stock = await Stock.findByPk(request.stock_id, { transaction });

      if (!stock) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: 'Associated stock item not found.' });
      }

      if (stock.count < request.requested_count) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory! Available: ${stock.count}, Requested: ${request.requested_count}`,
        });
      }

      stock.count -= request.requested_count;
      await stock.save({ transaction });
    }

    request.status = status;
    await request.save({ transaction });

    await transaction.commit();
    return res.status(200).json({ success: true, message: `Request ${status.toLowerCase()} successfully!`, data: request });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};