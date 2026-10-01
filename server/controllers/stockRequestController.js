import sequelize from '../config/db.js';
import { StockRequest } from '../models/stockRequestModel.js';
import { Stock } from '../models/stockModel.js';

// Get all requests (for Stockholder view)
export const getStockRequests = async (req, res) => {
  try {
    const requests = await StockRequest.findAll({
      include: [{ model: Stock, as: 'stock' }],
      order: [['created_at', 'DESC']],
    });
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a request (for Franchise)
export const createStockRequest = async (req, res) => {
  try {
    const { franchiseName, stockId, requestedCount, notes } = req.body;

    if (!franchiseName || !stockId || !requestedCount) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    const newRequest = await StockRequest.create({
      franchise_name: franchiseName,
      stock_id: stockId,
      requested_count: parseInt(requestedCount, 10),
      notes: notes || '',
    });

    const fullRequest = await StockRequest.findByPk(newRequest.id, {
      include: [{ model: Stock, as: 'stock' }],
    });

    return res.status(201).json({ success: true, data: fullRequest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update status and reduce stock count if approved
export const updateRequestStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const request = await StockRequest.findByPk(id, { transaction });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Stock request not found.' });
    }

    // Check if request was already processed
    if (request.status !== 'PENDING') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    // If approving, reduce inventory count
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
          message: `Insufficient stock! Requested: ${request.requested_count}, Available: ${stock.count}` 
        });
      }

      // Deduct requested count from current inventory count
      stock.count = stock.count - request.requested_count;
      await stock.save({ transaction });
    }

    // Update request status
    request.status = status;
    await request.save({ transaction });

    // Commit changes
    await transaction.commit();

    return res.status(200).json({ 
      success: true, 
      message: `Stock request ${status.toLowerCase()} successfully!`, 
      data: request 
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};