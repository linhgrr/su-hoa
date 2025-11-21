import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Material from '@/models/Material';

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

  const materials = await Material.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Material.countDocuments(filter);

  return NextResponse.json({
    data: materials,
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
    const material = await Material.create(body);
    return NextResponse.json(material, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
