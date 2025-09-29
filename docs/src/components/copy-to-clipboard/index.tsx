'use client';

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

        setTimeout(() => {
          setState('info');
        }, 1000);
      },
      () => {
        setState('error');
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
      aria-live="polite"
      aria-atomic="true"
    >
      {state === 'success' && (
        <>
          <span className="sr-only">Copied to clipboard</span>
          <FaCheck />
        </>
      )}
      {state === 'error' && (
        <>
          <span className="sr-only">Error copying to clipboard</span>
          <FaTriangleExclamation />
        </>
      )}
      {state === 'info' && (
        <>
          <span className="sr-only">Copy to clipboard</span>
          <FaCopy />
        </>
      )}
    </button>
  );
};
