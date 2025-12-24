import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // First verify the user is authenticated (this contacts Supabase Auth server)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        session: null,
        user: null,
      });
    }

    // Then get the session for the access token
    // We still need the session for the access_token, but we use the verified user from getUser()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        { error: { message: sessionError.message, status: 401 } },
        { status: 401 }
      );
    }

    // Return session with verified user (from getUser() not from getSession())
    return NextResponse.json({
      session: session
        ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            user: user, // Use verified user from getUser()
          }
        : null,
      user: user, // Use verified user from getUser()
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error ? error.message : 'Failed to get session',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}
