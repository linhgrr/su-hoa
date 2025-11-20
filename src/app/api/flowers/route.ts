import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Flower from '@/models/Flower';
import '@/models/Material'; // Register Material model
import { calculateBaseCost } from '@/utils/calculateBaseCost';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  let filter = {};
  if (query) {
    filter = { name: { $regex: query, $options: 'i' } };
  }

  const flowers = await Flower.find(filter).populate('recipe.material');
  return NextResponse.json(flowers);
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Auto-calculate base cost if recipe is provided
    if (body.recipe && body.recipe.length > 0) {
      body.baseCost = await calculateBaseCost(body.recipe);
    }
    
    const flower = await Flower.create(body);
    return NextResponse.json(flower, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
