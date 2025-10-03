import { Suspense } from 'react';
import type { StoryblokEngineProps } from '../engine.interface';
import { ServerToolbar } from './toolbar-server';

export const initStoryblokToolbar = (options: StoryblokEngineProps) => () => (
  <Suspense>
    <ServerToolbar {...options} />
  </Suspense>
);
