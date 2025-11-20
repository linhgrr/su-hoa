import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Flower from '@/models/Flower';
import MaterialLot from '@/models/MaterialLot';
import InventoryMovement from '@/models/InventoryMovement';
import mongoose from 'mongoose';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { status } = await request.json();
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);
    if (!order) throw new Error('Order not found');

    if (status === 'confirmed' && order.status === 'pending') {
      // Deduct inventory (FEFO)
      for (const item of order.items) {
        const flower = await Flower.findById(item.flower).session(session);
        for (const recipeItem of flower.recipe) {
          const totalNeeded = recipeItem.quantity * item.quantity;
          let remainingNeeded = totalNeeded;

          const lots = await MaterialLot.find({
            material: recipeItem.material,
            quantityRemain: { $gt: 0 }
          }).sort({ expireDate: 1 }).session(session);

          for (const lot of lots) {
            if (remainingNeeded <= 0) break;
            
            const deduct = Math.min(lot.quantityRemain, remainingNeeded);
            lot.quantityRemain -= deduct;
            await lot.save({ session });
            
            remainingNeeded -= deduct;

            await InventoryMovement.create([{
              type: 'out',
              material: recipeItem.material,
              lot: lot._id,
              quantity: deduct,
              reason: `Order ${order.code || order._id}`,
              reference: order._id,
              referenceModel: 'Order'
            }], { session });
          }

          if (remainingNeeded > 0) {
            throw new Error(`Not enough stock for material ${recipeItem.material}`);
          }
        }
      }
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save({ session });

    await session.commitTransaction();
    return NextResponse.json(order);
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Order status update error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update order status',
      details: error.toString()
    }, { status: 400 });
  } finally {
    session.endSession();
  }
}
