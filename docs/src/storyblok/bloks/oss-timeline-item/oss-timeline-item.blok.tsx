import type { BlokType } from '@virginmediao2/storyblok-sdk';
import clsx from 'clsx';
import { FaDotCircle } from 'react-icons/fa';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';
import { type Colors, coerceBgColor } from '@/storyblok/utils/coerce-colour';

interface OssTimelineItemContext {
  timelineFirst: boolean;
  timelineLast: boolean;
}

export type OssTimelineItemBlok = BlokType<OSS_BLOK.TIMELINE_ITEM> & {
  title: string;
  content: Array<BlokType>;
  line_color: Colors;
};

export const OssTimelineItem: BC<
  OssTimelineItemBlok,
  OssTimelineItemContext
> = ({
  blok: { title, content, line_color, ...blok },
  context: { timelineFirst, timelineLast },
  StoryblokComponent,
}) => (
  <li className="mr-2" {...storyblokEditable(blok)}>
    {!timelineFirst && <hr className={coerceBgColor(line_color)} aria-hidden />}
    <div className="timeline-middle ">
      <FaDotCircle size={24} />
    </div>
    <div
      className={clsx(
        'timeline-end timeline-box',
        'flex flex-col gap-4',
        'm-4.5 py-4 max-w-[calc(100%-4px)]',
        'text-md',
        { 'mb-0': timelineLast },
      )}
    >
      {content.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} />
      ))}
    </div>
    {!timelineLast && <hr className={coerceBgColor(line_color)} aria-hidden />}
  </li>
);
