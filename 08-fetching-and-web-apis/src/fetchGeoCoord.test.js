import { jest } from "@jest/globals";
import assert from "assert";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchGeoCoord", () => {
  // TODO
  it("follows type specification", () => {
    const promise = fetchGeoCoord("umass");

    return promise.then(result => {
      assert(typeof result === "object");
      assert(Object.keys(result).length === 3);
      assert(result.lon !== undefined);
      assert(result.lat !== undefined);
      assert(typeof result.importances === "object");
      assert(result.importances.length > 0);
    });
  });

  it("returns an error with statusText", () => {
    fetchMock.enableMocks();

    fetchMock.mockResponse("", {
      status: 500,
      statusText: "Some error message",
    });

    return expect(fetchGeoCoord("umass")).rejects.toThrow("Error in response: Some error message");
  });

  it("returns an error with no results", () => {
    fetchMock.enableMocks();

    fetchMock.mockResponse("", {
      status: 500,
      statusText: "Some error message",
    });

    return expect(fetchGeoCoord("umass")).rejects.toThrow("Error in response: Some error message");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("locationImportantEnough", () => {
  // TODO
  beforeEach(() => fetchMock.enableMocks());
  it("resolves to true", async () => {
    const resp = [
      {
        lat: "42.386969300000004",
        lon: "-72.53018467326824",
        importances: [
          0.19063313124322892, 0.14120352802992042, 0.20786843973778904, 0.15865083797115767, 0.16228119269431385,
        ],
      },
    ];
    fetchMock.mockResponse(JSON.stringify(resp));
    return expect(locationImportantEnough("umass", 0.2)).resolves.toBe(true);
  });

  it("resolves to false", async () => {
    const resp = [
      {
        lat: "42.386969300000004",
        lon: "-72.53018467326824",
        importances: [
          0.19063313124322892, 0.14120352802992042, 0.20786843973778904, 0.15865083797115767, 0.16228119269431385,
        ],
      },
    ];
    fetchMock.mockResponse(JSON.stringify(resp));
    return expect(locationImportantEnough("umass", 0.21)).resolves.toBe(false);
  });

  it("resolves to false if exactly at threshold", async () => {
    const resp = [
      {
        lat: "42.386969300000004",
        lon: "-72.53018467326824",
        importances: [
          0.19063313124322892, 0.14120352802992042, 0.20786843973778904, 0.15865083797115767, 0.16228119269431385,
        ],
      },
    ];
    fetchMock.mockResponse(JSON.stringify(resp));
    return expect(locationImportantEnough("umass", 0.20786843973778904)).resolves.toBe(false);
  });

  it("rejects if fetchGeoCoord throws", () => {
    fetchMock.mockRejectOnce(new Error("Some error"));
    return expect(locationImportantEnough("nowhere", 0.5)).rejects.toThrow("Some error");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
