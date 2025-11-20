import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FixedExpense from '@/models/FixedExpense';

export async function GET(request: Request) {
  await dbConnect();
  const expenses = await FixedExpense.find().sort({ createdAt: -1 });
  return NextResponse.json(expenses);
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
