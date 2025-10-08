import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { initDraftMode } from '../draft-mode';

export const enableRouteHandler = async (req: NextRequest) => {
  const referrer = req.headers.get('referer');
  const draftMode = initDraftMode();

  if (!referrer) {
    return Response.json({ message: 'Referrer not found' }, { status: 400 });
  }

  const referrerUrl = new URL(referrer);
  const storyblokRelease = referrerUrl.searchParams.get('_storyblok_release');
  const storyblokCv = referrerUrl.searchParams.get('_storyblok_tk[timestamp]');

  await draftMode.enable({
    release: storyblokRelease ?? undefined,
    cv: storyblokCv ?? undefined,
  });

  return redirect(`${referrerUrl.pathname}${referrerUrl.search}`);
};
