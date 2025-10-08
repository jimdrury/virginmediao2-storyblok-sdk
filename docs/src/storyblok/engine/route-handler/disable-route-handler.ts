import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { initDraftMode } from '../draft-mode';

export const disableRouteHandler = async (req: NextRequest) => {
  const referrer = req.headers.get('referer');
  const draftMode = initDraftMode();

  if (!referrer) {
    return Response.json({ message: 'Referrer not found' }, { status: 400 });
  }

  await draftMode.disable();
  const referrerUrl = new URL(referrer);
  return redirect(`${referrerUrl.pathname}${referrerUrl.search}`);
};
