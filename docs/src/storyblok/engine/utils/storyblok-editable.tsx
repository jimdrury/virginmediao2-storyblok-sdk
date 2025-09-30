import type { BlokType } from '@virginmediao2/storyblok-sdk/src';

type StoryblokEditableProps = Partial<BlokType>;

export const storyblokEditable = (blok: StoryblokEditableProps) => {
  if (typeof blok !== 'object' || !blok._editable) {
    return {};
  }

  const options = JSON.parse(
    blok._editable.replace(/^<!--#storyblok#/, '').replace(/-->$/, ''),
  );

  return {
    'data-blok-c': JSON.stringify(options),
    'data-blok-uid': `${options.id}-${options.uid}`,
  };
};
