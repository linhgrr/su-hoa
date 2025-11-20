import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MaterialLot from '@/models/MaterialLot';
import InventoryMovement from '@/models/InventoryMovement';
import Flower from '@/models/Flower';
import { calculateBaseCost } from '@/utils/calculateBaseCost';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const lots = await MaterialLot.find({ material: id }).sort({ expireDate: 1 });
  return NextResponse.json(lots);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const lot = await MaterialLot.create({
      ...body,
      material: id,
      quantityRemain: body.quantityImport, // Initial remain = import
    });

    // Log inventory movement
    await InventoryMovement.create({
      type: 'in',
      material: id,
      lot: lot._id,
      quantity: body.quantityImport,
      reason: 'Import new lot',
      reference: lot._id,
      referenceModel: 'MaterialLot',
    });

    // Recalculate base cost for all flowers using this material
    const affectedFlowers = await Flower.find({
      'recipe.material': id,
    });

    for (const flower of affectedFlowers) {
      const newBaseCost = await calculateBaseCost(flower.recipe);
      if (flower.baseCost !== newBaseCost) {
        flower.baseCost = newBaseCost;
        await flower.save();
      }
    }

    return NextResponse.json(lot, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
