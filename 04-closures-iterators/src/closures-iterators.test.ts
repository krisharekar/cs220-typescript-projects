import assert from "assert";
import { arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import { composeList, composeFunctions, composeBinary, enumRatios, cycleArr, dovetail } from "./closures-iterators.js";

describe("composeList", () => {
  // Tests for composeList go here
  it("should return correct value", () => {
    const fn0 = (n: number) => n * 2;
    const fn1 = (n: number) => n * 3;
    const lst = arrayToList([fn0, fn1]);
    const n = composeList(lst)(2);
    assert.deepEqual(n, 12);
  });

  it("should handle empty list", () => {
    const lst = arrayToList([]);
    const n = composeList(lst)(2);
    assert.deepEqual(n, 2);
  });
});

describe("composeFunctions", () => {
  it("should return correct array", () => {
    const fn0 = (n: number) => n * 2;
    const fn1 = (n: number) => n * 3;
    const arr = [fn0, fn1];
    const newArr = composeFunctions(arr)(2);
    assert.deepEqual(newArr, [2, 4, 12]);
  });

  it("should handle empty array", () => {
    const newArr = composeFunctions([])(2);
    assert.deepEqual(newArr, [2]);
  });
});

describe("composeBinary", () => {
  // Tests for composeBinary go here
  it("should return correct value", () => {
    const fn0 = (n: number, m: number) => n * m;
    const fn1 = (n: number, m: number) => n + m;
    const arr = [fn0, fn1];
    const output = composeBinary(arr)(2)(3);
    assert.deepEqual(output, 8);
  });

  it("should handle empty array", () => {
    const output = composeBinary([])(2)(3);
    assert.deepEqual(output, 3);
  });
});

describe("enumRatios", () => {
  // Tests for enumRatios go here
  it("should return correct value", () => {
    const fn = enumRatios();
    const arr = [];
    // for (let i = 0; i < 10; i++) console.log(fn());
    for (let i = 0; i < 10; i++) arr.push(fn());
    assert.deepEqual(arr[0], 1);
    assert.deepEqual(arr[3], 3);
    assert.deepEqual(arr[7], 2 / 3);
  });
});

describe("cycleArr", () => {
  // Tests for cycleArr go here
  it("should return correct values", () => {
    const iter = cycleArr([
      [1, 2, 3],
      [4, 5],
      [6, 7, 8, 9],
    ]);
    const arr = [];
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 4, 6, 2, 5, 7, 3, 8, 9]);
  });

  it("should handle different length arrays", () => {
    const iter = cycleArr([[1, 2, 3, 4, 5, 6], [7], [8, 9]]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 7, 8, 2, 9, 3, 4, 5, 6]);
  });

  it("X", () => {
    const iter = cycleArr([[1], [], []]);
    // const arr = [];
    while (iter.hasNext()) console.log(iter.next());
    // while (iter.hasNext()) arr.push(iter.next());
    // assert.deepEqual(arr, [1, 7, 8, 2, 9, 3, 4, 5, 6]);
  });

  it("should handle empty arrays", () => {
    const iter = cycleArr([[1, 2, 3], [], [6, 7]]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 6, 2, 7, 3]);
  });

  it("should handle all empty arrays", () => {
    const iter = cycleArr([[], [], []]);
    const arr: number[] = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, []);
  });
});

describe("dovetail", () => {
  // Tests for dovetail go here
  it("should return correct values", () => {
    const l1 = arrayToList([1, 2, 3]);
    const l2 = arrayToList([4, 5]);
    const l3 = arrayToList([6, 7, 8, 9]);
    const iter = dovetail([l1, l2, l3]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 2, 4, 3, 5, 6, 7, 8, 9]);
  });

  it("should handle multiple empty lists at start", () => {
    const l1 = arrayToList([1, 2, 3, 4]);
    const l2 = arrayToList([]);
    const iter = dovetail([l2, l2, l2, l1]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 2, 3, 4]);
  });

  it("should handle multiple empty lists", () => {
    const l1 = arrayToList([1, 2, 3, 4]);
    const l2 = arrayToList([]);
    const l3 = arrayToList([]);
    const iter = dovetail([l1, l2, l3, l1]);
    const iter2 = dovetail([l1, l2, l3, l1]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    while (iter2.hasNext()) arr.push(iter2.next());
    assert.deepEqual(arr, [1, 2, 1, 3, 2, 4, 3, 4, 1, 2, 1, 3, 2, 4, 3, 4]);
  });

  it("should handle empty lists", () => {
    const l1 = arrayToList([1, 2, 3]);
    const l2 = arrayToList([]);
    const l3 = arrayToList([4, 5, 6, 7]);
    const iter = dovetail([l1, l2, l3]);
    const arr = [];
    // while (iter.hasNext()) console.log(iter.next());
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 2, 4, 3, 5, 6, 7]);
  });

  it("should handle lists of different lengths", () => {
    const l1 = arrayToList([1, 2, 3, 10, 11, 12, 13]);
    const l2 = arrayToList([4]);
    const l3 = arrayToList([5, 6, 7]);
    const iter = dovetail([l1, l2, l3]);
    const arr = [];
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 2, 4, 3, 5, 10, 6, 11, 7, 12, 13]);
  });

  it("should handle larger lists", () => {
    const l1 = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const l2 = arrayToList([10, 11]);
    const l3 = arrayToList([12, 13, 14, 15]);
    const iter = dovetail([l1, l2, l3]);
    const arr = [];
    while (iter.hasNext()) arr.push(iter.next());
    assert.deepEqual(arr, [1, 2, 10, 3, 11, 12, 4, 13, 5, 14, 6, 15, 7, 8, 9]);
  });
});
