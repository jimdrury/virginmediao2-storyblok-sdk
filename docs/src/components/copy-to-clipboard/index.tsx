'use client';

import { announce } from '@react-aria/live-announcer';
import { type FC, useState } from 'react';
import { FaCheck, FaCopy, FaTriangleExclamation } from 'react-icons/fa6';

export interface CopyToClipboardProps {
  content: string;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ content }) => {
  const [state, setState] = useState<'info' | 'error' | 'success'>('info');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(
      () => {
        setState('success');
        announce('Copied to clipboard');

        setTimeout(() => {
          setState('info');
        }, 1000);
      },
      () => {
        setState('error');
        announce('Error copying to clipboard');
        setTimeout(() => {
          setState('info');
        }, 1000);
      },
    );
  };

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm btn-circle"
      onClick={() => copyToClipboard()}
    >
      {state === 'success' && <FaCheck />}
      {state === 'error' && <FaTriangleExclamation />}
      {state === 'info' && <FaCopy />}
      <span className="sr-only">Copy to clipboard</span>
    </button>
  );
};
