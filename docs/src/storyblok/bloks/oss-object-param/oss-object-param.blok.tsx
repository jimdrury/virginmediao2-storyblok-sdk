import type { BlokType } from '@virginmediao2/storyblok-sdk';
import { CodeMark } from '@/components/elements';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

export type OssObjectParamOptionBlok =
  BlokType<OSS_BLOK.OBJECT_PARAM_OPTION> & {
    title: string;
    type: string;
    callout: [BlokType];
    description: Array<BlokType>;
    options: Array<BlokType>;
  };

export const OssObjectParamOption: BC<OssObjectParamOptionBlok> = ({
  blok: { callout, title, type, description, options, ...blok },
  StoryblokComponent,
}) => (
  <div
    className="border-1 border-base-300 bg-base-200 p-3 py-4 flex flex-col gap-3 rounded-xl"
    {...storyblokEditable(blok)}
  >
    <div className="flex flex-row gap-x-2 -mb-1">
      <span className="text-md font-mono font-bold">{title}</span>
      <CodeMark>{type}</CodeMark>
    </div>

    {description.length > 0 && (
      <div className="flex flex-col gap-y-3">
        {description.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      </div>
    )}

    {options.length > 0 && (
      <dl className="gap-3 p-3 grid grid-cols-[max-content_1fr] border-1 border-base-300 rounded-lg bg-base-100">
        {options.map((blok, index) => (
          <StoryblokComponent
            key={blok._uid}
            blok={blok}
            isLast={index === options.length - 1}
          />
        ))}
      </dl>
    )}

    {callout.length > 0 && (
      <aside className="flex flex-col gap-y-3">
        {callout.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      </aside>
    )}
  </div>
);
