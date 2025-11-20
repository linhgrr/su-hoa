import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Flower from '@/models/Flower';
import MaterialLot from '@/models/MaterialLot';
import InventoryMovement from '@/models/InventoryMovement';
import mongoose from 'mongoose';
import '@/models/User'; // Register User model

export async function GET(request: Request) {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).populate('items.flower');
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer || !body.customer.name || !body.customer.phone) {
      throw new Error('Customer name and phone are required');
    }
    
    if (!body.items || body.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    
    // Basic validation and stock check could go here
    // For now, we just create the order in 'pending' state
    
    const order = await Order.create([body], { session });

    await session.commitTransaction();
    return NextResponse.json(order[0], { status: 201 });
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create order',
      details: error.toString()
    }, { status: 400 });
  } finally {
    session.endSession();
  }
}
