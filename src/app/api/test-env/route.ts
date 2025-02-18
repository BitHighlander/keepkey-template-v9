import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAuthPassword: !!process.env.AUTH_PASSWORD,
    authPasswordValue: process.env.AUTH_PASSWORD,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  })
} 