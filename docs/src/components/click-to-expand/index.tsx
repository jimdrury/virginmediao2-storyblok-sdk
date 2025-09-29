'use client';

import clsx from 'clsx';
import { type FC, type ReactNode, useCallback, useState } from 'react';
import { useMeasure } from 'react-use';

import styles from './click-to-expand.module.css';

export interface ClickToExpandProps {
  children: ReactNode;
  expandedDefault?: boolean;
}

export const ClickToExpand: FC<ClickToExpandProps> = ({
  children,
  expandedDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expandedDefault);
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const [containerHeight, setContainerHeight] = useState(110);

  const handleClick = useCallback(() => {
    setIsExpanded(true);
    setContainerHeight(height);
  }, [height]);

  return (
    <div
      className={clsx({
        [styles['click-to-expand']]: true,
        [styles['click-to-expand--expanded']]: isExpanded,
      })}
    >
      <div className={styles['click-to-expand__control']}>
        <button type="button" onClick={handleClick}>
          Expand
        </button>
      </div>
      <div
        className={styles['click-to-expand__content']}
        style={{ height: `${containerHeight}px` }}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  );
};
