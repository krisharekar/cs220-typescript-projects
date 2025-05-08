// import { assert } from "console";
import { sempty, snode, Stream, to } from "../include/stream.js";
import {
  addSeries,
  applySeries,
  coeff,
  derivSeries,
  evalSeries,
  expSeries,
  prodSeries,
  recurSeries,
} from "./series.js";
import assert from "assert";

function expectStreamToBe<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);

    s = s.tail();
  }

  expect(s.isEmpty()).toBe(true);
}

function expectInfStreamToBe<T>(s: Stream<T>, a: T[]) {
  for (const element of a) {
    expect(s.isEmpty()).toBe(false);
    expect(s.head()).toBe(element);

    s = s.tail();
  }
}

describe("addSeries", () => {
  it("adds simple streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 5);
    const c = addSeries(a, b);

    expectStreamToBe(c, [2, 4, 6, 8, 10]);
  });

  it("adds different length streams together", () => {
    // Open `include/stream.ts` to learn how to use `to`
    // 1 -> 2 -> 3 -> 4 -> 5
    const a = to(1, 5);
    const b = to(1, 7);
    const c = addSeries(a, b);

    expectStreamToBe(c, [2, 4, 6, 8, 10, 6, 7]);
  });
});

describe("prodSeries", () => {
  // More tests for prodSeries go here
  it("multiplies streams together", () => {
    const a = to(1, 3);
    const b = snode(2, () => snode(6, () => snode(9, () => sempty())));
    const c = prodSeries(a, b);

    expectStreamToBe(c, [2, 10, 27, 36, 27]);
  });

  it("multiplies different length streams together", () => {
    const a = to(1, 3);
    const b = snode(2, () => sempty());
    const c = prodSeries(b, a);

    expectStreamToBe(c, [2, 4, 6]);
  });

  it("handles empty stream", () => {
    const a = to(1, 3);
    const b = sempty<number>();
    const c = prodSeries(a, b);

    expectStreamToBe(c, []);
  });
});

describe("derivSeries", () => {
  // More tests for derivSeries go here
  it("handles multi element stream", () => {
    const a = to(1, 3);
    const c = derivSeries(a);

    expectStreamToBe(c, [2, 6]);
  });

  it("handles single element stream", () => {
    const a = snode(3, () => sempty());
    const c = derivSeries(a);

    expectStreamToBe(c, [0]);
  });

  it("handles empty stream", () => {
    const a: Stream<number> = sempty();
    const c = derivSeries(a);

    expectStreamToBe(c, []);
  });
});

describe("coeff", () => {
  // More tests for coeff go here
  it("handles multi element stream", () => {
    const a = to(1, 5);
    const c = coeff(a, 3);

    assert.deepEqual(c, [1, 2, 3, 4]); //1+2x+3x^2+4x^3
  });

  it("handles empty", () => {
    const a: Stream<number> = sempty();
    const c = coeff(a, 3);

    assert.deepEqual(c, []);
  });
});

describe("evalSeries", () => {
  // More tests for evalSeries go here
  it("handles multi element stream", () => {
    const a = to(1, 5);
    const c = evalSeries(a, 3);

    assert.deepEqual(c(2), 49);
  });

  it("handles empty", () => {
    const a: Stream<number> = sempty();
    const c = evalSeries(a, 3);

    assert.deepEqual(c(2), 0);
  });
});

describe("applySeries", () => {
  // More tests for applySeries go here
  it("generates correct infinite stream", () => {
    const c = applySeries(c => c + 1, 1);

    expectInfStreamToBe(c, [1, 2, 3, 4]);
  });
});

describe("expSeries", () => {
  // More tests for expSeries go here
  it("generates correct taylor series", () => {
    const c = expSeries();

    expectInfStreamToBe(c, [1, 1, 1 / 2, 1 / 6]);
  });
});

describe("recurSeries", () => {
  // More tests for recurSeries go here
  it("handles multi element stream", () => {
    const c = recurSeries([1, 2, 4], [1, 2, 4]);
    //n=0
    //a3 = 1 + 4 + 16 = 21
    //n=1
    //a4 = 2 + 8 + 84 = 94
    expectInfStreamToBe(c, [1, 2, 4, 21, 94]);
  });
});
