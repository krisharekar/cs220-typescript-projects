// import assert from "assert";
import { Observable } from "../include/observable.js";
import { classifyObservables, obsStrCond, statefulObserver, classifyTypeObservables } from "./observables.js";

describe("classifyObservables", () => {
  // More tests go here.
  it("updates observables correctly", () => {
    const o1 = new Observable<number>(),
      o2 = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o1, o2]);

    const negativeVals: number[] = [];
    const oddVals: number[] = [];
    const restVals: number[] = [];

    negative.subscribe(x => negativeVals.push(x));
    odd.subscribe(x => oddVals.push(x));
    rest.subscribe(x => restVals.push(x));

    o1.update(-3); // negative + odd
    o2.update(2); // rest
    o1.update(5); // odd
    o2.update(0); // rest
    o1.update(-4); // negative
    o2.update(-7); // negative + odd

    expect(negativeVals).toEqual([-3, -4, -7]);
    expect(oddVals).toEqual([-3, 5, -7]);
    expect(restVals).toEqual([2, 0]);
  });
});

describe("obsStrCond", () => {
  // More tests go here.
  it("should update observers according to condition", () => {
    const o = new Observable<string>();
    const f = (s: string) => s.includes("A");
    const result = obsStrCond([(s: string) => s.toUpperCase(), (s: string) => s.slice(0, 3)], f, o);
    const output: string[] = [];
    result.subscribe(val => {
      output.push(val);
    });

    o.update("apple");
    o.update("fruit");
    o.update("a");

    expect(output).toEqual(["APP", "fruit", "A"]);
  });
});

describe("statefulObserver", () => {
  // More tests go here.
  it("should update when current value is divisible by previous", () => {
    const o = new Observable<number>();
    const result = statefulObserver(o);

    const output: number[] = [];

    result.subscribe(val => {
      output.push(val);
    });

    o.update(3);
    o.update(6);
    o.update(4);
    o.update(8);
    o.update(5);
    o.update(10);

    expect(output).toEqual([6, 8, 10]);
  });
});

describe("classifyTypeObservables", () => {
  it("should update by type", () => {
    const str1 = new Observable<string>();
    const num1 = new Observable<number>();
    const bool1 = new Observable<boolean>();
    const str2 = new Observable<string>();
    const num2 = new Observable<number>();

    const result = classifyTypeObservables([str1, num1, bool1, str2, num2]);
    const strOutput: string[] = [];
    const numOutput: number[] = [];
    const boolOutput: boolean[] = [];

    result.string.subscribe(val => strOutput.push(val));
    result.number.subscribe(val => numOutput.push(val));
    result.boolean.subscribe(val => boolOutput.push(val));

    str1.update("apple");
    num1.update(42);
    bool1.update(true);
    str2.update("fruit");
    num2.update(100);
    bool1.update(false);

    expect(strOutput).toEqual(["apple", "fruit"]);
    expect(numOutput).toEqual([42, 100]);
    expect(boolOutput).toEqual([true, false]);
  });
});
