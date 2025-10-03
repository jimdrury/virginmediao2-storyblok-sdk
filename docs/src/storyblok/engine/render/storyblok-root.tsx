import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import type { FC } from 'react';
import type {
  BC,
  StoryblokComponentProps,
  StoryblokEngineProps,
  StoryblokRootProps,
} from '../engine.interface';

export const initStoryblokRoot = ({ components }: StoryblokEngineProps) => {
  const StoryblokRoot: FC<StoryblokRootProps> = ({ story, ...rootProps }) => {
    const StoryblokComponent: FC<StoryblokComponentProps> = ({
      blok,
      ...localProps
    }) => {
      const Component = components[blok.component] as BC<BlokType>;

      if (!Component) {
        return <h1>Component {blok.component} not found</h1>;
      }

      return (
        <Component
          blok={blok}
          StoryblokComponent={StoryblokComponent}
          context={{
            story,
            ...rootProps,
            ...localProps,
          }}
        />
      );
    };

    return <StoryblokComponent blok={story.content} />;
  };

  return StoryblokRoot;
};
