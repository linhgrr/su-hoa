import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Flower from '@/models/Flower';
import '@/models/Material'; // Register Material model
import { calculateBaseCost } from '@/utils/calculateBaseCost';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  
  let filter = {};
  if (query) {
    filter = { name: { $regex: query, $options: 'i' } };
  }

  const flowers = await Flower.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('recipe.material');
    
  const total = await Flower.countDocuments(filter);

  return NextResponse.json({
    data: flowers,
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
