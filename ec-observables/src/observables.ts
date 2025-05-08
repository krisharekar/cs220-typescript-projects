import { Observable } from "../include/observable.js";

// Extra Credit Functions

export function classifyObservables(obsArr: Observable<number>[]): {
  negative: Observable<number>;
  odd: Observable<number>;
  rest: Observable<number>;
} {
  // TODO: Implement this function
  const negativeObs = new Observable<number>(),
    oddObs = new Observable<number>(),
    restObs = new Observable<number>();
  obsArr.forEach(obs => {
    obs.subscribe(x => {
      if (x < 0) negativeObs.update(x);
      if (Math.abs(x % 2) === 1) oddObs.update(x);
      if (x >= 0 && Math.abs(x % 2) !== 1) restObs.update(x);
    });
  });
  return { negative: negativeObs, odd: oddObs, rest: restObs };
}

export function obsStrCond(
  funcArr: ((arg1: string) => string)[],
  f: (arg1: string) => boolean,
  o: Observable<string>
): Observable<string> {
  // TODO: Implement this function
  const result = new Observable<string>();
  o.subscribe(x => {
    const newStr = funcArr.reduce((acc, fn) => fn(acc), x);
    f(newStr) ? result.update(newStr) : result.update(x);
  });
  return result;
}

export function statefulObserver(o: Observable<number>): Observable<number> {
  // TODO: Implement this function
  const result = new Observable<number>();
  let prev: number | null = null;
  o.subscribe(x => {
    if (prev !== null && prev !== 0 && x % prev === 0) result.update(x);
    prev = x;
  });
  return result;
}

// Optional Additional Practice

export function classifyTypeObservables(obsArr: (Observable<string> | Observable<number> | Observable<boolean>)[]): {
  string: Observable<string>;
  number: Observable<number>;
  boolean: Observable<boolean>;
} {
  // TODO: Implement this function
  const strObs = new Observable<string>(),
    numObs = new Observable<number>(),
    boolObs = new Observable<boolean>();
  obsArr.forEach(obs => {
    obs.subscribe(x => {
      if (typeof x === "string") strObs.update(x);
      else if (typeof x === "number") numObs.update(x);
      else if (typeof x === "boolean") boolObs.update(x);
    });
  });
  return { string: strObs, number: numObs, boolean: boolObs };
}

// export function mergeMax(o1: Observable<number>, o2: Observable<number>): Observable<{ obs: number; v: number }> {
//   // TODO: Implement this function
//   let max = -Infinity;
//   const result = new Observable<{ obs: number; v: number }>();
//   const updateResult = (obs: number, v: number) => {
//     if (v >= max) result.update({ obs, v });
//     max = v;
//   };
//   o1.subscribe(x => updateResult(1, x));
//   o2.subscribe(x => updateResult(2, x));
//   return result;
// }

// export function merge(o1: Observable<string>, o2: Observable<string>): Observable<string> {
//   // TODO: Implement this function
//   const result = new Observable<string>();
//   const fn = (x: string) => result.update(x);
//   o1.subscribe(fn);
//   o2.subscribe(fn);
//   return result;
// }

// export class GreaterAvgObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   greaterAvg(): Observable<number> {
//     // TODO: Implement this method
//     let prev = -Infinity;
//     let last = -Infinity;
//     const r = new Observable<number>();
//     this.subscribe(x => {
//       const avg = (prev + last) / 2;
//       if (x >= avg * 1.5) r.update(x);
//       prev = last;
//       last = x;
//     });
//     return r;
//   }
// }

// export class SignChangeObservable extends Observable<number> {
//   constructor() {
//     super();
//   }

//   signChange(): Observable<number> {
//     // TODO: Implement this method
//     let prev = 0;
//     const r = new Observable<number>();
//     this.subscribe(x => {
//       if (x !== 0 && x * prev <= 0) r.update(x);
//       prev = x;
//     });
//     return r;
//   }
// }

// /**
//  * This function shows how the class you created above could be used.
//  * @param numArr Array of numbers
//  * @param f Observer function
//  */
// export function usingSignChange(numArr: number[], f: Observer<number>) {
//   // TODO: Implement this function
//   const obs = new SignChangeObservable();
//   const r = obs.signChange();
//   r.subscribe(f);
//   numArr.forEach(x => obs.update(x));
// }
