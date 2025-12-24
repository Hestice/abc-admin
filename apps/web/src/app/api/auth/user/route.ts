import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        { error: { message: error.message, status: 401 } },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: user ?? null });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : 'Failed to get user',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
