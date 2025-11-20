import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    const uploadData = new FormData();
    uploadData.append('image', image);
    uploadData.append('key', apiKey!);

    const response = await axios.post('https://api.imgbb.com/1/upload', uploadData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.data && response.data.data.url) {
      return NextResponse.json({ url: response.data.data.url });
    } else {
      throw new Error('ImgBB response invalid');
    }
  } catch (error: any) {
    console.error('ImgBB Upload Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
