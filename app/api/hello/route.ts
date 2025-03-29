import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from Perfect Year API!',
    timestamp: new Date().toISOString()
  });
} y