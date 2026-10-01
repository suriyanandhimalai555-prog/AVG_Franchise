import { StockModel } from '../models/stockModel.js';

export const getStocks = async (req, res) => {
  try {
    const stocks = await StockModel.getAll();
    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stocks',
      error: error.message,
    });
  }
};

export const createStock = async (req, res) => {
  try {
    const { stockName, singleStockWeight, count } = req.body;

    // Validation
    if (!stockName || !singleStockWeight || !count) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Stock Name, Weight, Count) are required.',
      });
    }

    if (Number(singleStockWeight) <= 0 || Number(count) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Weight and count must be positive numbers.',
      });
    }

    const newStock = await StockModel.create({
      stockName,
      singleStockWeight: parseFloat(singleStockWeight),
      count: parseInt(count, 10),
    });

    return res.status(201).json({
      success: true,
      message: 'Stock updated successfully',
      data: newStock,
    });
  } catch (error) {
    console.error('Error creating stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save stock entry',
      error: error.message,
    });
  }
};