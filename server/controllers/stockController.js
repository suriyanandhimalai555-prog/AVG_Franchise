import { StockModel } from '../models/stockModel.js';

// Fetch stocks based on user role and district
export const getStocks = async (req, res) => {
  try {
    const user = req.user;
    
    // Pass user context so model can filter by district/user ID
    const stocks = await StockModel.getAll(user);
    
    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stocks',
      error: error.message,
    });
  }
};

// Super Admin Controller: Fetch all stocks across all branches/districts
export const getAllBranchStocks = async (req, res) => {
  try {
    const user = req.user;

    // Optional Super Admin check
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super Admin permissions required.',
      });
    }

    const allStocks = await StockModel.getAllGlobal();
    
    return res.status(200).json({
      success: true,
      data: allStocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve global inventory data',
      error: error.message,
    });
  }
};

// Upsert / Create Stock
export const createStock = async (req, res) => {
  try {
    const { stockName, singleStockWeight, count } = req.body;
    const user = req.user;

    if (!stockName || singleStockWeight === undefined || count === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Stock Name, Weight, Count) are required.',
      });
    }

    const weightNum = parseFloat(singleStockWeight);
    const countNum = parseInt(count, 10);

    const updatedStock = await StockModel.upsert({
      stockName: stockName.trim(),
      singleStockWeight: weightNum,
      count: countNum,
      totalWeight: weightNum * countNum,
      district: user.district || 'Unassigned',
      state: user.state || '',
      userId: user.id,
      branchName: user.name || user.branchName || 'Branch Main',
    });

    return res.status(201).json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedStock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save stock entry',
      error: error.message,
    });
  }
};