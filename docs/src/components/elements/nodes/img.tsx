import type { ComponentProps, FC } from 'react';

type ImgProps = Omit<ComponentProps<'img'>, 'className'>;

export const Img: FC<ImgProps> = (props) => (
  // biome-ignore lint/performance/noImgElement: used within rich text resolver
  <img
    src={props.src}
    alt={props.alt}
    className="text-2xl font-bold"
    {...props}
  />
);
