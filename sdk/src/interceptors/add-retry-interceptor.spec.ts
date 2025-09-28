import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addRetryInterceptor } from './add-retry-interceptor';

// Mock axios
vi.mock('axios');

describe('addRetryInterceptor', () => {
  let mockAxiosInstance: {
    interceptors: {
      response: {
        use: ReturnType<typeof vi.fn>;
      };
    };
    request: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockAxiosInstance = {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
      request: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add response interceptor with default options', () => {
    addRetryInterceptor(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should add response interceptor with custom options', () => {
    const options = { baseDelay: 100, maxDelay: 5000 };

    addRetryInterceptor(mockAxiosInstance, options);

    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should pass through successful responses', () => {
    addRetryInterceptor(mockAxiosInstance);

    const [successHandler] =
      mockAxiosInstance.interceptors.response.use.mock.calls[0];
    const mockResponse = { data: { test: 'data' } };

    const result = successHandler(mockResponse);

    expect(result).toBe(mockResponse);
  });

  it('should not retry non-429 errors', async () => {
    addRetryInterceptor(mockAxiosInstance);

    const [, errorHandler] =
      mockAxiosInstance.interceptors.response.use.mock.calls[0];
    const error = {
      response: { status: 500 },
      config: {},
    };

    await expect(errorHandler(error)).rejects.toBe(error);
    expect(mockAxiosInstance.request).not.toHaveBeenCalled();
  });

  it('should retry 429 errors with exponential backoff', async () => {
    addRetryInterceptor(mockAxiosInstance, { baseDelay: 50, maxDelay: 200 });

    const [, errorHandler] =
      mockAxiosInstance.interceptors.response.use.mock.calls[0];
    const error = {
      response: { status: 429 },
      config: {},
    };

    const _retryPromise = errorHandler(error);

    // Fast-forward time to trigger retry
    await vi.advanceTimersByTimeAsync(100);

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(error.config);
  });

  it('should stop retrying when max delay is reached', async () => {
    addRetryInterceptor(mockAxiosInstance, { baseDelay: 100, maxDelay: 200 });

    const [, errorHandler] =
      mockAxiosInstance.interceptors.response.use.mock.calls[0];
    const error = {
      response: { status: 429 },
      config: { __retryCount: 10 }, // High retry count to exceed max delay
    };

    await expect(errorHandler(error)).rejects.toBe(error);
    expect(mockAxiosInstance.request).not.toHaveBeenCalled();
  });
});
