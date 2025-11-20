import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Material from '@/models/Material';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  let filter = {};
  if (query) {
    filter = { name: { $regex: query, $options: 'i' } };
  }

  const materials = await Material.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(materials);
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
