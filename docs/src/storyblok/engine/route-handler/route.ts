import type { NextRequest } from 'next/server';
import { disableRouteHandler } from './disable-route-handler';
import { enableRouteHandler } from './enable-route-handler';

interface GetProps {
  params: Promise<{ storyblok: string[] }>;
}

export const GET = async (req: NextRequest, props: GetProps) => {
  const params = await props.params;

  const [route, method] = params.storyblok;

  if (route === 'draft' && method === 'enable') {
    return enableRouteHandler(req);
  }

  if (route === 'draft' && method === 'disable') {
    return disableRouteHandler(req);
  }

  return Response.json({ params }, { status: 404 });
};
