import type { FC } from 'react';

type EmojiProps = {
  name?: string;
  emoji?: string;
  fallbackImage?: string;
  children?: React.ReactNode;
};

export const Emoji: FC<EmojiProps> = ({
  name,
  emoji,
  fallbackImage,
  children,
}) => {
  if (emoji) {
    return <span>{emoji}</span>;
  }

  if (fallbackImage) {
    return (
      // biome-ignore lint/performance/noImgElement: used for emoji fallback
      <img src={fallbackImage} alt={name || 'emoji'} className="inline-block" />
    );
  }

  return <span>{children}</span>;
};
