import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

fetchMock.enableMocks();
const coords = { lat: 40, lon: 40 };
const setupMockResponse = (response, options = {}) => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify(response), options);
};

describe("fetchCurrentTemperature", () => {
  test("correctly fetches and gets temperature data", async () => {
    const mockResponse = {
      hourly: {
        time: ["2023-01-01T00:00", "2023-01-01T01:00", "2023-01-01T02:00"],
        temperature_2m: [72.5, 71.8, 70.3],
      },
    };

    setupMockResponse(mockResponse);

    const result = await fetchCurrentTemperature(coords);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("latitude=40");
    expect(fetchMock.mock.calls[0][0]).toContain("longitude=40");
    expect(fetchMock.mock.calls[0][0]).toContain("hourly=temperature_2m");
    expect(fetchMock.mock.calls[0][0]).toContain("temperature_unit=fahrenheit");

    expect(result).toEqual({
      time: ["2023-01-01T00:00", "2023-01-01T01:00", "2023-01-01T02:00"],
      temperature_2m: [72.5, 71.8, 70.3],
    });
  });

  test("handles HTTP error responses correctly", async () => {
    setupMockResponse({}, { status: 404, statusText: "Not Found" });
    await expect(fetchCurrentTemperature({ coords })).rejects.toThrow("Not Found");
  });

  test("handles network errors correctly", async () => {
    fetchMock.resetMocks();
    fetchMock.mockRejectOnce(new Error("Network Error"));

    await expect(fetchCurrentTemperature({ coords })).rejects.toThrow("Network Error");
  });
});
// TODO

describe("tempAvgAboveAtCoords", () => {
  // TODO
  test("returns true when average temperature is above", async () => {
    const mockResponse = {
      hourly: {
        time: ["2023-01-01T00:00", "2023-01-01T01:00"],
        temperature_2m: [75, 85],
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await tempAvgAboveAtCoords({ coords }, 70);

    expect(result).toBe(true);
  });

  test("returns false when average temperature is below", async () => {
    const mockResponse = {
      hourly: {
        time: ["2023-01-01T00:00", "2023-01-01T01:00", "2023-01-01T02:00"],
        temperature_2m: [60, 65, 70],
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await tempAvgAboveAtCoords({ coords }, 72);

    expect(result).toBe(false);
  });

  test("checks errors from fetchCurrentTemperature", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), {
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(tempAvgAboveAtCoords({ coords }, 70)).rejects.toThrow("Internal Server Error");
  });
});
