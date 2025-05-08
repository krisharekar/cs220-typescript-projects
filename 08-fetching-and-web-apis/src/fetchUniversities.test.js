import { jest } from "@jest/globals";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

fetchMock.enableMocks();

describe("fetchUniversities", () => {
  // Mocking the fetch function to simulate API responses
  test("correctly fetches and returns university names", async () => {
    const mockResponse = [{ name: "Harvard University" }, { name: "MIT" }, { name: "Stanford University" }];
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetchUniversities("uni");
    expect(result).toEqual(["Harvard University", "MIT", "Stanford University"]);
  });

  test("returns empty array if response is not an array", async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const result = await fetchUniversities("invalid");
    expect(result).toEqual([]);
  });

  test("handles HTTP errors", async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404, statusText: "Not Found" });

    await expect(fetchUniversities("unknown")).rejects.toThrow("Not Found");
  });
});

describe("universityNameLengthOrderAscending", () => {
  // Mocking the fetch function to simulate API responses
  test("returns true when universities are in ascending name length order", async () => {
    const mockResponse = [{ name: "MIT" }, { name: "Harvard" }, { name: "Stanford University" }];
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await universityNameLengthOrderAscending("ordered");
    expect(result).toBe(true);
  });

  test("returns false when universities are not in ascending name length order", async () => {
    const mockResponse = [{ name: "Stanford University" }, { name: "MIT" }, { name: "Harvard" }];
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await universityNameLengthOrderAscending("unordered");
    expect(result).toBe(false);
  });

  test("handles empty arrays", async () => {
    const mockResponse = [{}];
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await universityNameLengthOrderAscending("unordered");
    expect(result).toBe(true);
  });

  test("handles fetchUniversities errors", async () => {
    fetchMock.resetMocks();
    fetchMock.mockRejectOnce(new Error("Network Error"));

    await expect(universityNameLengthOrderAscending("error")).rejects.toThrow("Network Error");
  });
});
