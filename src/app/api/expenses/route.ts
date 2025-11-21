import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FixedExpense from '@/models/FixedExpense';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const expenses = await FixedExpense.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await FixedExpense.countDocuments();

  return NextResponse.json({
    data: expenses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const expense = await FixedExpense.create(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await FixedExpense.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
