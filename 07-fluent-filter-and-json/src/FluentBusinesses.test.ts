import assert from "assert";
import { Business } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3.9,
    review_count: 30,
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
  },
];

const testData2: Business[] = [
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
    categories: ["sun", "hot"],
    hours: {
      Monday: "1-6",
      Friday: "1-2",
    },
    attributes: {
      Ambience: { calm: true },
    },
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Phoenix",
    state: "NC",
    stars: 3,
    review_count: 30,
    categories: ["cold"],
    hours: {
      Monday: "1-6",
      Sunday: "1-2",
    },
    attributes: {
      Ambience: { calm: false },
    },
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 2,
    review_count: 10,
    attributes: {
      Ambience: {},
    },
  },
];

const testData3: Business[] = [
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    categories: ["sun", "hot"],
    hours: {
      Monday: "1-6",
      Friday: "1-2",
    },
    attributes: {
      Ambience: { calm: true },
    },
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "AZ",
    categories: ["cold"],
    hours: {
      Monday: "1-6",
      Sunday: "1-2",
    },
  },
];

const testData4: Business[] = [
  { business_id: "1", name: "A", stars: 4, review_count: 10 },
  { business_id: "2", name: "B", review_count: 15 },
  { business_id: "3", name: "C", stars: 3, review_count: 20 },
];

const testData5: Business[] = [
  { business_id: "1", name: "A", stars: 4, review_count: 10 },
  { business_id: "2", name: "B", stars: 4 },
  { business_id: "3", name: "C", stars: 3, review_count: 15 },
];

const testData6: Business[] = [
  { business_id: "1", name: "A", stars: 3, review_count: 20 },
  { business_id: "2", name: "B", stars: 4, review_count: 15 },
  { business_id: "3", name: "C", stars: 5, review_count: 10 },
];

const testData7: Business[] = [
  { business_id: "1", name: "A", stars: 3, review_count: 20 },
  { business_id: "2", name: "B", stars: 4, review_count: 20 },
  { business_id: "3", name: "C", stars: 5, review_count: 10 },
];

const testData8: Business[] = [
  { business_id: "1", name: "A", review_count: 20 },
  { business_id: "2", name: "B", stars: 4, review_count: 20 },
  { business_id: "3", name: "C", stars: 5, review_count: 10 },
];

const testData9: Business[] = [
  { business_id: "1", name: "A", review_count: 20 },
  { business_id: "2", name: "B", review_count: 30 },
  { business_id: "3", name: "C", review_count: 20 },
];

const testData10: Business[] = [
  { business_id: "1", name: "A", stars: 5 },
  { business_id: "2", name: "B", stars: 4 },
  { business_id: "3", name: "C", stars: 5 },
];

const testData11: Business[] = [
  { business_id: "1", name: "A", stars: -5 },
  { business_id: "2", name: "B", stars: -4 },
  { business_id: "3", name: "C", stars: -5 },
];

const testData12: Business[] = [
  { business_id: "1", name: "A", stars: 5, review_count: 100 },
  { business_id: "2", name: "B", stars: 5, review_count: 100 },
  { business_id: "3", name: "C", stars: 4, review_count: 150 },
];

const testData13: Business[] = [
  { business_id: "1", name: "A", stars: 4, review_count: 50 },
  { business_id: "2", name: "B", stars: 4, review_count: 50 },
  { business_id: "3", name: "C", stars: 5, review_count: 40 },
];

describe("fromCityInState", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });

  it("filters correctly for same state but not city", () => {
    const list = new FluentBusinesses(testData3).fromCityInState("Phoenix", "AZ").getData();

    assert(list.length === 1);
    assert(list[0].name === "Beach Ventures Roofing");
  });

  it("filters correctly for same city but not state", () => {
    //imp
    const list = new FluentBusinesses(testData2).fromCityInState("Phoenix", "AZ").getData();

    assert(list.length === 1);
    assert(list[0].name === "Beach Ventures Roofing");
  });
});

describe("hasStarsGeq", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
});

describe("inCategory", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData2).inCategory("sun").getData();

    assert(list.length === 1);
    assert(list[0].name === "Beach Ventures Roofing");
  });
});

describe("hasHoursOnDays", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData2).hasHoursOnDays(["Monday", "Sunday"]).getData();

    assert(list.length === 1);
    assert(list[0].name === "Alpaul Automobile Wash");
  });

  it("handles empty days array", () => {
    const list = new FluentBusinesses(testData2).hasHoursOnDays([]).getData();
    assert(list.length === 2);
  });
});

describe("hasAmbience", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData2).hasAmbience("calm").getData();

    assert(list.length === 1);
    assert(list[0].name === "Beach Ventures Roofing");
  });
});

describe("bestPlace", () => {
  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });

  it("return first since both equal count", () => {
    const best = new FluentBusinesses(testData2).bestPlace();

    assert(best);
    assert(best.name === "Beach Ventures Roofing");
  });

  it("handle undefined", () => {
    const most = new FluentBusinesses(testData3).bestPlace();
    assert(!most);
  });

  it("treats undefined stars as lower", () => {
    const best = new FluentBusinesses(testData4).bestPlace();
    assert(best);
    assert(best.name === "A");
  });

  it("returns undefined for empty list", () => {
    const best = new FluentBusinesses([]).bestPlace();
    assert(!best);
  });

  it("handles undefined review count when stars tied", () => {
    const best = new FluentBusinesses(testData5).bestPlace();
    assert(best);
    assert(best.name === "A");
  });

  it("handles no stars with reviews", () => {
    const best = new FluentBusinesses(testData9).bestPlace();
    assert(!best);
  });

  it("handles negative stars", () => {
    const best = new FluentBusinesses(testData11).bestPlace();
    assert(best);
    assert(best.name === "B");
  });

  it("handles identical max stars and review counts", () => {
    const best = new FluentBusinesses(testData12).bestPlace();
    assert(best);
    assert(best.name === "A");
  });
});

describe("mostReviews", () => {
  it("break tie with review count", () => {
    const most = new FluentBusinesses(testData).mostReviews();

    assert(most);
    assert(most.name === "Beach Ventures Roofing");
  });

  it("return first since both equal count", () => {
    const most = new FluentBusinesses(testData2).mostReviews();

    assert(most);
    assert(most.name === "Beach Ventures Roofing");
  });

  it("handle undefined", () => {
    const most = new FluentBusinesses(testData3).mostReviews();
    assert(!most);
  });

  it("returns undefined for empty list", () => {
    const most = new FluentBusinesses([]).mostReviews();
    assert(!most);
  });

  it("returns highest review count regardless of stars", () => {
    const most = new FluentBusinesses(testData6).mostReviews();
    assert(most);
    assert(most.name === "A");
  });

  it("break tie with stars", () => {
    //imp
    const most = new FluentBusinesses(testData7).mostReviews();
    assert(most);
    assert(most.name === "B");
  });

  it("break tie with undefined stars", () => {
    const most = new FluentBusinesses(testData8).mostReviews();
    assert(most);
    assert(most.name === "B");
  });

  it("handles no reviews with stars", () => {
    const best = new FluentBusinesses(testData10).mostReviews();
    assert(!best);
  });

  it("handles identical max review counts and stars", () => {
    const most = new FluentBusinesses(testData13).mostReviews();
    assert(most);
    assert(most.name, "A");
  });
});
