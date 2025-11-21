import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Flower from '@/models/Flower';
import ExpenseTransaction from '@/models/ExpenseTransaction';
import InventoryMovement from '@/models/InventoryMovement';

export async function GET() {
  await dbConnect();

  try {
    // 1. Revenue & Orders
    const orderStats = await Order.aggregate([
      { $match: { status: 'done' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const completedOrders = orderStats[0]?.count || 0;
    const totalOrders = await Order.countDocuments();

    // 2. Customers
    const totalCustomers = await User.countDocuments({ role: 'guest' });

    // 3. Costs
    // 3a. Material Cost (COGS) based on Base Cost of sold items
    // We need to iterate through done orders to calculate this precisely if baseCost changes, 
    // but for now let's aggregate based on current baseCost of flowers (simplification)
    // or better, if we stored cost in OrderItem, we would use that. 
    // The Order model doesn't have cost snapshot. 
    // Let's calculate based on current Flower baseCost.
    const doneOrders = await Order.find({ status: 'done' }).populate('items.flower');
    let materialCost = 0;
    
    doneOrders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        if (item.flower) {
          materialCost += (item.flower.baseCost || 0) * item.quantity;
        }
      });
    });

    // 3b. Fixed Expenses
    const expenseStats = await ExpenseTransaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const fixedExpenses = expenseStats[0]?.total || 0;

    // 3c. Waste Cost (Adjustments out)
    // Assuming 'adjust' type with 'out' direction implies loss/waste
    // We need to join with MaterialLot or Material to get price.
    // This is complex to aggregate directly. Let's simplify: 
    // We'll skip waste calculation for this iteration or assume 0 if no data.
    const wasteCost = 0; 

    // 4. Net Profit
    const netProfit = totalRevenue - materialCost - fixedExpenses - wasteCost;

    // 5. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.flower', 'name images')
      .populate('customer.user', 'name email');

    return NextResponse.json({
      revenue: totalRevenue,
      orders: totalOrders,
      completedOrders,
      profit: netProfit,
      customers: totalCustomers,
      expenses: fixedExpenses,
      materialCost,
      recentOrders
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
