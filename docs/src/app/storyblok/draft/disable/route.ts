import { revalidatePath } from 'next/cache';
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const referrer = req.headers.get('referer');

  if (!referrer) {
    return Response.json({ message: 'Referrer not found' }, { status: 400 });
  }

  const draft = await draftMode();
  draft.disable();

  // As draftMode cant always be reverted, we need to update the cookie to expire immediately
  const cookieStore = await cookies();
  cookieStore.set({
    name: '__prerender_bypass',
    value: '',
    expires: 0,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  revalidatePath('/', 'layout');
  const referrerUrl = new URL(referrer);
  return redirect(`${referrerUrl.pathname}${referrerUrl.search}`);
};
