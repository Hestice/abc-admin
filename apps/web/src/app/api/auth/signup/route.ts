import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, options } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required', status: 400 } },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: options || {},
    });

    if (error) {
      return NextResponse.json(
        { error: { message: error.message, status: 400 } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type,
            user: data.session.user,
          }
        : null,
    });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to sign up',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
