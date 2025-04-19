import Order from '../models/order.model.js';
import { Stock } from '../models/stock.model.js';
import { createOrderSchema } from '../dto/order.dto.js';

export const createOrder = async (req, res) => {
    try {
        const validatedData = createOrderSchema.parse(req.body);
        
        // Calculate final total from items
        const calculatedFinalTotal = validatedData.items.reduce(
            (sum, item) => sum + item.total,
            0
        );

        // Verify that the provided finalTotal matches the calculated total
        if (calculatedFinalTotal !== validatedData.finalTotal) {
            return res.status(400).json({
                success: false,
                message: "Final total does not match the sum of item totals"
            });
        }

        // Validate items against stock and check quantities
        for (const item of validatedData.items) {
            const stockItem = await Stock.findOne({ productName: item.itemName });
            
            if (!stockItem) {
                return res.status(400).json({
                    success: false,
                    message: `Item "${item.itemName}" not found in stock`
                });
            }

            if (stockItem.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient quantity for item "${item.itemName}". Available: ${stockItem.quantity}`
                });
            }

            if (stockItem.price !== item.price) {
                return res.status(400).json({
                    success: false,
                    message: `Price mismatch for item "${item.itemName}". Current price: ${stockItem.price}`
                });
            }
        }

        // Create the order
        const order = new Order(validatedData);
        await order.save();

        // Update stock quantities
        for (const item of validatedData.items) {
            await Stock.findOneAndUpdate(
                { productName: item.itemName },
                { $inc: { quantity: -item.quantity } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
}; 