import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Material from '@/models/Material';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const material = await Material.findById(params.id);
  if (!material) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }
  return NextResponse.json(material);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const material = await Material.findByIdAndUpdate(params.id, body, { new: true });
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const material = await Material.findByIdAndDelete(params.id);
  if (!material) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Material deleted' });
}
