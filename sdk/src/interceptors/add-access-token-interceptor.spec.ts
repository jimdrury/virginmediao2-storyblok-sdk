import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addAccessTokenInterceptor } from './add-access-token-interceptor';

describe('addAccessTokenInterceptor', () => {
  let mockAxiosInstance: {
    interceptors: {
      request: {
        use: ReturnType<typeof vi.fn>;
      };
    };
  };
  const mockToken = 'test-access-token';

  beforeEach(() => {
    vi.clearAllMocks();

    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    };
  });

  it('should add request interceptor', () => {
    addAccessTokenInterceptor(mockAxiosInstance, mockToken);

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should add token to request config', () => {
    addAccessTokenInterceptor(mockAxiosInstance, mockToken);

    const [requestHandler] =
      mockAxiosInstance.interceptors.request.use.mock.calls[0];
    const config = { params: { existing: 'param' } };

    const result = requestHandler(config);

    expect(result.params).toEqual({
      existing: 'param',
      token: mockToken,
    });
  });

  it('should add token to empty params', () => {
    addAccessTokenInterceptor(mockAxiosInstance, mockToken);

    const [requestHandler] =
      mockAxiosInstance.interceptors.request.use.mock.calls[0];
    const config = {};

    const result = requestHandler(config);

    expect(result.params).toEqual({
      token: mockToken,
    });
  });

  it('should handle request errors', async () => {
    addAccessTokenInterceptor(mockAxiosInstance, mockToken);

    const [, errorHandler] =
      mockAxiosInstance.interceptors.request.use.mock.calls[0];
    const error = new Error('Request error');

    await expect(() => errorHandler(error)).rejects.toBe(error);
  });
});
