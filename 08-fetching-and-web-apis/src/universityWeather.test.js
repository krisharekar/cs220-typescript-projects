import { jest } from "@jest/globals";
import { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";
import assert from "assert";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(40 * SECOND);

async function testType(fetcher) {
  const result = await fetcher();

  expect(typeof result).toBe("object");
  expect(result).toHaveProperty("totalAverage");
  expect(typeof result.totalAverage).toBe("number");

  const keys = Object.keys(result).filter(key => key !== "totalAverage");
  expect(keys.length).toBeGreaterThan(0);

  keys.forEach(key => {
    expect(typeof result[key]).toBe("number");
  });
}

async function testTotalAverage(fetcher) {
  const result = await fetcher();

  const keys = Object.keys(result).filter(key => key !== "totalAverage");
  const temps = keys.map(key => result[key]);

  const expectedAverage = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  expect(result.totalAverage).toBeCloseTo(expectedAverage, 2);
}

async function testNameInclusion(fetcher, matchString) {
  const result = await fetcher();
  const keys = Object.keys(result);

  const matchingKeys = keys.filter(key => key.includes(matchString));
  expect(matchingKeys.length).toBeGreaterThan(0);
}

async function testEmpty(fetcher) {
  fetchMock.enableMocks();
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

  await expect(fetcher()).rejects.toThrow("No results found for query.");

  fetchMock.disableMocks();
}
describe("fetchUMichWeather", () => {
  // TODO
  it("should return correct types", () => testType(fetchUMichWeather));
  it("should throw an error if no universities are found", () => testEmpty(fetchUMichWeather));
  it("solves totalAverage from university temperature", () => testTotalAverage(fetchUMichWeather));
  it("includes universities matching University of Michigan in result", () =>
    testNameInclusion(fetchUMichWeather, "University of Michigan"));
});

describe("fetchUMassWeather", () => {
  // TODO
  it("should return correct types", () => testType(fetchUMassWeather));
  it("should throw an error if no universities are found", () => testEmpty(fetchUMassWeather));
  it("solves totalAverage from university temperature", () => testTotalAverage(fetchUMassWeather));
  it("includes universities matching University of Massachusetts in result", () =>
    testNameInclusion(fetchUMassWeather, "University of Massachusetts"));
});

describe("fetchUniversityWeather", () => {
  // TODO
  it("should reject with an error if no universities are found", async () => {
    await expect(fetchUniversityWeather("no university like this exists")).rejects.toThrow(
      "No results found for query."
    );
  });

  it("should return correct types", async () => {
    const result = await fetchUniversityWeather("University of Michigan");

    assert(typeof result === "object");

    const keys = Object.keys(result);
    assert(keys.length > 1);

    for (const key of keys) {
      assert.strictEqual(typeof result[key], "number");
    }
  });

  it("should return correct averages", async () => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    fetchMock.mockResponses(
      [
        JSON.stringify([{ name: "University One" }, { name: "University Two" }, { name: "University Three" }]),
        { status: 200 },
      ],
      [JSON.stringify([{ lat: 0, lon: 0, importances: [1] }]), { status: 200 }],
      [JSON.stringify({ hourly: { time: ["t1", "t2", "t3"], temperature_2m: [40, 60, 80] } }), { status: 200 }],
      [JSON.stringify([{ lat: 0, lon: 0, importances: [1] }]), { status: 200 }],
      [JSON.stringify({ hourly: { time: ["t1", "t2", "t3"], temperature_2m: [30, 40, 50] } }), { status: 200 }],
      [JSON.stringify([{ lat: 0, lon: 0, importances: [1] }]), { status: 200 }],
      [JSON.stringify({ hourly: { time: ["t1", "t2", "t3"], temperature_2m: [55, 50, 45] } }), { status: 200 }]
    );

    const result = await fetchUniversityWeather("university");

    assert.deepStrictEqual(result, {
      totalAverage: 50,
      "University One": 60,
      "University Two": 40,
      "University Three": 50,
    });

    fetchMock.disableMocks();
  });
});
