import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const referrer = req.headers.get('referer');

  if (!referrer) {
    return Response.json({ message: 'Referrer not found' }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  const cookieStore = await cookies();

  // draftMode will only set the cookie for the nextjs domain, we need to modify it to work within Storyblok.
  const cookie = cookieStore.get('__prerender_bypass');
  if (cookie) {
    cookieStore.set({
      name: '__prerender_bypass',
      value: cookie?.value,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }

  const referrerUrl = new URL(referrer);
  return redirect(`${referrerUrl.pathname}${referrerUrl.search}`);
};
