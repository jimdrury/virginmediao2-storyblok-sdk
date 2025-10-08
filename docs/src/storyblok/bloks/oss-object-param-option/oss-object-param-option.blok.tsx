import type { BlokType } from '@virginmediao2/storyblok-sdk';
import { CodeMark } from '@/components/elements';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';

interface LocalProps {
  isLast?: boolean;
}

export type OssObjectParamOptionBlok =
  BlokType<OSS_BLOK.OBJECT_PARAM_OPTION> & {
    title: string;
    description: Array<BlokType>;
  };

export const OssObjectParamOption: BC<OssObjectParamOptionBlok, LocalProps> = ({
  blok: { title, description, ...blok },
  context: { isLast },
  StoryblokComponent,
}) => (
  <>
    <dt
      className="pr-3 border-r-1 border-base-300 min-w-[100px]"
      {...storyblokEditable(blok)}
    >
      <CodeMark>{title}</CodeMark>
    </dt>

    {description.length > 0 && (
      <dd className="flex flex-col gap-y-3" {...storyblokEditable(blok)}>
        {description.map((blok) => (
          <StoryblokComponent key={blok._uid} blok={blok} />
        ))}
      </dd>
    )}

    {!isLast && <hr className="border-base-300 col-span-2" />}
  </>
);
