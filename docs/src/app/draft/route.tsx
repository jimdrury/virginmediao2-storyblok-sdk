import { draftMode } from 'next/headers';

export const GET = async () => {
  const draft = await draftMode();
  draft.enable();

  return Response.json({ message: 'Draft mode enabled' });
};
