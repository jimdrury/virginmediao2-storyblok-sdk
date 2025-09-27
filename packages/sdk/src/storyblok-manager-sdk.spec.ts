import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoryblokManagerSdk } from "./storyblok-manager-sdk";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

// Mock the interceptor utilities
vi.mock("./interceptors");

describe("StoryblokManagerSdk", () => {
  let sdk: StoryblokManagerSdk;
  let mockAxiosInstance: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    request: ReturnType<typeof vi.fn>;
    interceptors: {
      request: {
        use: ReturnType<typeof vi.fn>;
      };
      response: {
        use: ReturnType<typeof vi.fn>;
      };
    };
    defaults: {
      headers: Record<string, unknown>;
    };
  };
  const mockPersonalAccessToken = "test-personal-access-token";
  const mockOAuthToken = "test-oauth-token";

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
      defaults: {
        headers: {},
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as ReturnType<typeof axios.create>);
  });

  describe("constructor", () => {
    it("should create SDK instance with personal access token", () => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });

      expect(sdk).toBeInstanceOf(StoryblokManagerSdk);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://mapi.storyblok.com/v1",
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: mockPersonalAccessToken,
        },
      });
    });

    it("should create SDK instance with OAuth token", () => {
      sdk = new StoryblokManagerSdk({
        oauthToken: mockOAuthToken,
      });

      expect(sdk).toBeInstanceOf(StoryblokManagerSdk);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://mapi.storyblok.com/v1",
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockOAuthToken}`,
        },
      });
    });

    it("should throw error when no token is provided", () => {
      expect(() => {
        new StoryblokManagerSdk({});
      }).toThrow("Either personalAccessToken or oauthToken must be provided");
    });

    it("should use custom baseURL when provided", () => {
      const customBaseURL = "https://custom-mapi.example.com";
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
        baseURL: customBaseURL,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: customBaseURL,
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: mockPersonalAccessToken,
        },
      });
    });

    it("should use custom timeout when provided", () => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
        timeout: 5000,
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://mapi.storyblok.com/v1",
        timeout: 5000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: mockPersonalAccessToken,
        },
      });
    });
  });

  describe("interceptors", () => {
    beforeEach(() => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });
    });

    it("should expose axios interceptors", () => {
      expect(sdk.interceptors).toBe(mockAxiosInstance.interceptors);
    });
  });

  describe("getSpace", () => {
    beforeEach(() => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });
    });

    it("should fetch space information", async () => {
      const mockResponse = {
        data: {
          space: {
            id: 123,
            name: "Test Space",
            domain: "test.storyblok.com",
            plan: "starter",
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getSpace();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/spaces/me");
      expect(result).toBe(mockResponse);
    });
  });

  describe("story management", () => {
    beforeEach(() => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });
    });

    it("should fetch stories from management API", async () => {
      const spaceId = 123;
      const mockResponse = {
        data: {
          stories: [{ id: 1, name: "Test Story" }],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getStories(spaceId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/stories`, {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it("should fetch stories with parameters", async () => {
      const spaceId = 123;
      const params = { page: 2, search: "test" };

      await sdk.getStories(spaceId, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/stories`, {
        params,
      });
    });

    it("should fetch a single story", async () => {
      const spaceId = 123;
      const storyId = 456;
      const mockResponse = {
        data: {
          story: { id: storyId, name: "Test Story" },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getStory(spaceId, storyId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/stories/${storyId}`);
      expect(result).toBe(mockResponse);
    });

    it("should create a new story", async () => {
      const spaceId = 123;
      const storyData = {
        name: "New Story",
        slug: "new-story",
        content: { title: "Hello World" },
      };
      const mockResponse = {
        data: {
          story: { id: 789, ...storyData },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await sdk.createStory(spaceId, storyData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/spaces/${spaceId}/stories`, {
        story: storyData,
      });
      expect(result).toBe(mockResponse);
    });

    it("should update an existing story", async () => {
      const spaceId = 123;
      const storyId = 456;
      const storyData = {
        name: "Updated Story",
        content: { title: "Updated Title" },
      };
      const mockResponse = {
        data: {
          story: { id: storyId, ...storyData },
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await sdk.updateStory(spaceId, storyId, storyData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/spaces/${spaceId}/stories/${storyId}`, {
        story: storyData,
      });
      expect(result).toBe(mockResponse);
    });

    it("should delete a story", async () => {
      const spaceId = 123;
      const storyId = 456;
      const mockResponse = {
        data: {
          story: { id: storyId, name: "Deleted Story" },
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await sdk.deleteStory(spaceId, storyId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        `/spaces/${spaceId}/stories/${storyId}`
      );
      expect(result).toBe(mockResponse);
    });

    it("should publish a story", async () => {
      const spaceId = 123;
      const storyId = 456;
      const mockResponse = {
        data: {
          story: { id: storyId, name: "Published Story" },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.publishStory(spaceId, storyId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/spaces/${spaceId}/stories/${storyId}/publish`
      );
      expect(result).toBe(mockResponse);
    });

    it("should unpublish a story", async () => {
      const spaceId = 123;
      const storyId = 456;
      const mockResponse = {
        data: {
          story: { id: storyId, name: "Unpublished Story" },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.unpublishStory(spaceId, storyId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/spaces/${spaceId}/stories/${storyId}/unpublish`
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("component management", () => {
    beforeEach(() => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });
    });

    it("should fetch components", async () => {
      const spaceId = 123;
      const mockResponse = {
        data: {
          components: [{ id: 1, name: "page" }],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getComponents(spaceId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/components`);
      expect(result).toBe(mockResponse);
    });

    it("should fetch a single component", async () => {
      const spaceId = 123;
      const componentId = 456;
      const mockResponse = {
        data: {
          component: { id: componentId, name: "page" },
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getComponent(spaceId, componentId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/spaces/${spaceId}/components/${componentId}`
      );
      expect(result).toBe(mockResponse);
    });

    it("should create a new component", async () => {
      const spaceId = 123;
      const componentData = {
        name: "new_component",
        display_name: "New Component",
        schema: { title: { type: "text" } },
      };
      const mockResponse = {
        data: {
          component: { id: 789, ...componentData },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await sdk.createComponent(spaceId, componentData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/spaces/${spaceId}/components`, {
        component: componentData,
      });
      expect(result).toBe(mockResponse);
    });

    it("should update an existing component", async () => {
      const spaceId = 123;
      const componentId = 456;
      const componentData = {
        display_name: "Updated Component",
        schema: { title: { type: "textarea" } },
      };
      const mockResponse = {
        data: {
          component: { id: componentId, ...componentData },
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await sdk.updateComponent(spaceId, componentId, componentData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        `/spaces/${spaceId}/components/${componentId}`,
        {
          component: componentData,
        }
      );
      expect(result).toBe(mockResponse);
    });

    it("should delete a component", async () => {
      const spaceId = 123;
      const componentId = 456;
      const mockResponse = {
        data: {
          component: { id: componentId, name: "deleted_component" },
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await sdk.deleteComponent(spaceId, componentId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        `/spaces/${spaceId}/components/${componentId}`
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe("asset management", () => {
    beforeEach(() => {
      sdk = new StoryblokManagerSdk({
        personalAccessToken: mockPersonalAccessToken,
      });
    });

    it("should upload an asset", async () => {
      const spaceId = 123;
      const file = new Blob(["test content"], { type: "text/plain" });
      const filename = "test.txt";
      const mockResponse = {
        data: {
          id: 789,
          filename,
          public_url: "https://example.com/test.txt",
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await sdk.uploadAsset(spaceId, file, filename);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        `/spaces/${spaceId}/assets`,
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      expect(result).toBe(mockResponse);
    });

    it("should upload an asset with options", async () => {
      const spaceId = 123;
      const file = new Blob(["test content"], { type: "text/plain" });
      const filename = "test.txt";
      const options = {
        alt: "Test image",
        title: "Test Title",
        copyright: "Test Copyright",
        source: "Test Source",
      };

      await sdk.uploadAsset(spaceId, file, filename, options);

      expect(mockAxiosInstance.post).toHaveBeenCalled();
    });

    it("should fetch assets", async () => {
      const spaceId = 123;
      const mockResponse = {
        data: {
          assets: [{ id: 1, filename: "test.jpg" }],
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await sdk.getAssets(spaceId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/assets`, {
        params: undefined,
      });
      expect(result).toBe(mockResponse);
    });

    it("should fetch assets with parameters", async () => {
      const spaceId = 123;
      const params = { page: 2, search: "test" };

      await sdk.getAssets(spaceId, params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/spaces/${spaceId}/assets`, {
        params,
      });
    });

    it("should delete an asset", async () => {
      const spaceId = 123;
      const assetId = 456;
      const mockResponse = {
        data: {
          id: assetId,
          filename: "deleted.jpg",
        },
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await sdk.deleteAsset(spaceId, assetId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/spaces/${spaceId}/assets/${assetId}`);
      expect(result).toBe(mockResponse);
    });
  });
});
