import { cookies, draftMode } from 'next/headers';

export enum COOKIE {
  STORYBLOK_RELEASE = '_storyblok_release',
  STORYBLOK_CV = '_storyblok_cv',
  STORYBLOK_PRERENDER_BYPASS = '__prerender_bypass',
}

interface EnableDraftModeParams {
  release?: string;
  cv?: string;
}

export const enableDraftMode = async ({
  release,
  cv,
}: EnableDraftModeParams) => {
  const cookieStore = await cookies();
  const draft = await draftMode();
  draft.enable();
  const cookie = cookieStore.get(COOKIE.STORYBLOK_PRERENDER_BYPASS);

  if (release) {
    cookieStore.set({
      name: COOKIE.STORYBLOK_RELEASE,
      value: release,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }

  if (cv) {
    cookieStore.set({
      name: COOKIE.STORYBLOK_CV,
      value: cv,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }

  if (cookie) {
    cookieStore.set({
      name: COOKIE.STORYBLOK_PRERENDER_BYPASS,
      value: cookie?.value,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
    });
  }
};

export const getDraftMode = async () => {
  const draft = await draftMode();

  if (!draft.isEnabled) {
    return {
      isEnabled: false,
      from_release: undefined,
      cv: undefined,
    };
  }

  const cookieStore = await cookies();
  const release = cookieStore.get(COOKIE.STORYBLOK_RELEASE)?.value;
  const cv = cookieStore.get(COOKIE.STORYBLOK_CV)?.value;

  return {
    isEnabled: true,
    from_release: release ? +release : 0,
    cv: cv ? +cv : Date.now(),
  };
};

export const disableDraftMode = async () => {
  const cookieStore = await cookies();
  const draft = await draftMode();
  draft.disable();

  cookieStore.set({
    name: COOKIE.STORYBLOK_RELEASE,
    value: '',
    expires: 0,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  cookieStore.set({
    name: COOKIE.STORYBLOK_CV,
    value: '',
    expires: 0,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });

  cookieStore.set({
    name: COOKIE.STORYBLOK_PRERENDER_BYPASS,
    value: '',
    expires: 0,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  });
};
