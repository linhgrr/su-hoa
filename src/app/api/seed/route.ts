import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await dbConnect();
  
  try {
    const email = 'admin@flower.shop';
    const password = 'admin123';
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin account already exists', email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({ 
      message: 'Admin created successfully', 
      email, 
      password 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
