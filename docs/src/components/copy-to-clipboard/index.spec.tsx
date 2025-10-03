import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyToClipboard } from './index';

// Mock @react-aria/live-announcer
vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
}));

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

describe('CopyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders copy button', () => {
    render(<CopyToClipboard content="test content" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();
  });

  it('copies content to clipboard on click', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyToClipboard content="test content" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockWriteText).toHaveBeenCalledWith('test content');
  });

  it('shows success state after successful copy', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyToClipboard content="test content" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      // The success icon should be visible
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('shows error state after failed copy', async () => {
    mockWriteText.mockRejectedValue(new Error('Copy failed'));

    render(<CopyToClipboard content="test content" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      // The error icon should be visible
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });
});
