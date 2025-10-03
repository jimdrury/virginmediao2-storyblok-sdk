import type { BlokType } from '@virginmediao2/storyblok-sdk';
import clsx from 'clsx';
import type { OSS_BLOK } from '@/storyblok/bloks';
import { type BC, storyblokEditable } from '@/storyblok/engine';
import type { OssTimelineItemBlok } from '../oss-timeline-item';

export type OssTimelineBlok = BlokType<OSS_BLOK.TIMELINE> & {
  content: Array<OssTimelineItemBlok>;
  snap_icon: boolean;
};

export const OssTimeline: BC<OssTimelineBlok> = ({
  blok: { content, snap_icon, ...blok },
  StoryblokComponent,
}) => (
  <ul
    className={clsx('timeline timeline-vertical timeline-compact', {
      'timeline-snap-icon': snap_icon,
    })}
    {...storyblokEditable(blok)}
  >
    {content.map((blok, index) => (
      <StoryblokComponent
        key={blok._uid}
        blok={blok}
        timelineFirst={index === 0}
        timelineLast={index === content.length - 1}
        timelinePrevColor={
          index > 0 ? content[index - 1].line_color : 'default'
        }
      />
    ))}
  </ul>
);
