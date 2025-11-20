import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Flower from '@/models/Flower';
import '@/models/Material'; // Register Material model
import { calculateBaseCost } from '@/utils/calculateBaseCost';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const flower = await Flower.findById(id).populate('recipe.material');
  if (!flower) {
    return NextResponse.json({ error: 'Flower not found' }, { status: 404 });
  }
  return NextResponse.json(flower);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Auto-calculate base cost if recipe is being updated
    if (body.recipe && body.recipe.length > 0) {
      body.baseCost = await calculateBaseCost(body.recipe);
    }
    
    const flower = await Flower.findByIdAndUpdate(id, body, { new: true }).populate('recipe.material');
    if (!flower) {
      return NextResponse.json({ error: 'Flower not found' }, { status: 404 });
    }
    return NextResponse.json(flower);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const flower = await Flower.findByIdAndDelete(id);
  if (!flower) {
    return NextResponse.json({ error: 'Flower not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Flower deleted' });
}
