import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Worker script endpoint is working.' });
} 