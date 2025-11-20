import MaterialLot from '@/models/MaterialLot';

interface RecipeItem {
  material: string;
  quantity: number;
}

/**
 * Calculate the base cost of a flower based on its recipe and material prices
 * Uses weighted average price from available material lots
 */
export async function calculateBaseCost(recipe: RecipeItem[]): Promise<number> {
  if (!recipe || recipe.length === 0) {
    return 0;
  }

  let totalCost = 0;

  for (const item of recipe) {
    // Get all available lots for this material (with remaining quantity > 0)
    const lots = await MaterialLot.find({
      material: item.material,
      quantityRemain: { $gt: 0 },
    });

    if (lots.length === 0) {
      // No lots available, use 0 cost for now
      continue;
    }

    // Calculate weighted average price
    let totalValue = 0;
    let totalQuantity = 0;

    for (const lot of lots) {
      totalValue += lot.importPrice * lot.quantityRemain;
      totalQuantity += lot.quantityRemain;
    }

    const avgPrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
    
    // Add cost for this material (avg price × quantity needed)
    totalCost += avgPrice * item.quantity;
  }

  return Math.round(totalCost); // Round to nearest integer
}
