import mongoose from 'mongoose';

/**
 * This script drops the old order code index and recreates it properly
 * Run this once to fix the duplicate key error
 */
async function fixOrderIndex() {
  try {
    // Connect directly to MongoDB
    const MONGODB_URI = "mongodb+srv://nhatquangpx:8sotamnhe@gymmanagement.8jghrjf.mongodb.net/flower_shop?retryWrites=true&w=majority";
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const ordersCollection = db?.collection('orders');
    
    if (!ordersCollection) {
      throw new Error('Orders collection not found');
    }

    console.log('Checking existing indexes...');
    const indexes = await ordersCollection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Drop the problematic index
    try {
      await ordersCollection.dropIndex('orders_order_code_key');
      console.log('✅ Dropped old index: orders_order_code_key');
    } catch (error: any) {
      if (error.code === 27) { // 27 = IndexNotFound
        console.log('⚠️  Index orders_order_code_key does not exist');
      } else {
        console.log('Error dropping orders_order_code_key:', error.message);
      }
    }

    // Try dropping by field name as well
    try {
      await ordersCollection.dropIndex('code_1');
      console.log('✅ Dropped old index: code_1');
    } catch (error: any) {
      if (error.code === 27) {
        console.log('⚠️  Index code_1 does not exist');
      } else {
        console.log('Error dropping code_1:', error.message);
      }
    }

    // Create the new sparse index
    await ordersCollection.createIndex({ code: 1 }, { unique: true, sparse: true });
    console.log('✅ Created new sparse index on code field');

    console.log('\n✅ Index fix completed successfully!');
    console.log('You can now restart your server and create orders.');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixOrderIndex();
