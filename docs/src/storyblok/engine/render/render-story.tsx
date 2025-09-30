import type {
  StoryblokComponent,
  StoryblokStory,
} from '@virginmediao2/storyblok-sdk/src';
import type { FC } from 'react';
import type {
  BC,
  RenderComponentProps,
  StoryblokEngineProps,
} from '../engine.interface';

export interface RenderStoryProps {
  story: StoryblokStory<StoryblokComponent>;
}

export const initRenderStory = ({ components }: StoryblokEngineProps) => {
  const RenderComponent: FC<RenderComponentProps> = ({ blok }) => {
    const Component = components[blok.component] as BC<StoryblokComponent>;

    if (!Component) {
      return <h1>Component {blok.component} not found</h1>;
    }

    return <Component blok={blok} RenderComponent={RenderComponent} />;
  };

  const RenderStory: FC<RenderStoryProps> = ({ story }) => {
    return <RenderComponent blok={story.content} />;
  };

  return RenderStory;
};
