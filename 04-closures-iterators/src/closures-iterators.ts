import { List, node, empty } from "../include/lists.js";

export interface MyIterator<T> {
  hasNext: () => boolean;
  next: () => T;
}

export function composeList<T>(lst: List<(n: T) => T>): (n: T) => T {
  return (n: T): T => lst.reduce((acc, e) => e(acc), n);
}

export function composeFunctions<T>(fns: ((x: T) => T)[]): (x: T) => T[] {
  // return (v: T): T[] => fns.map(x => (v = x(v)));
  return (v: T): T[] => fns.reduce((acc, x, i) => acc.concat(x(acc[i])), [v]);
}

export function composeBinary<T, U>(funArr: ((arg1: T, arg2: U) => T)[]): (a: U) => (x: T) => T {
  return (a: U) =>
    (x: T): T =>
      funArr.reduce((acc, fn) => fn(acc, a), x);

  // return funArr.reduce((acc, fn) => {
  //   return (a1, a2) => {
  //     return acc(fn(a1, a2), a2);
  //   }
  // })
}

export function enumRatios(): () => number {
  let count = 1;
  let num = 1,
    den = 1;
  // let sum = 2;
  // let index = 0;
  const values = new Set();

  return () => {
    let newNum = num-- / den++;
    while (values.has(newNum) || num < 0) {
      newNum = num <= 0 ? ((num = ++count), (den = 1), num-- / den++) : num-- / den++;
    }
    values.add(newNum);
    return newNum;
  };

  // const values = new Set<string>();
  // return () => {
  //     while (values.has(`${num}/${den}`) || num <= 0) {
  //         if (num <= 1) {
  //             num = ++count;
  //             den = 1;
  //         } else {
  //             num--;
  //             den++;
  //         }
  //     }
  //     values.add(`${num}/${den}`);
  //     return num-- / den++;
  // };

  // return () => NaN;
  // return () => {
  //   let number;
  //   do {
  //     if (index >= sum - 1) {
  //       sum++;
  //       index = 0;
  //     }

  //     const num = sum - index - 1;
  //     const den = index + 1;
  //     index++;

  //     number = num / den;
  //   } while (values.has(number));
  //   values.add(number);
  //   return number;
  // };
}

export function _cycleArr<T>(arr: T[][]): MyIterator<T> {
  // let elementIndex = 0;
  // return {
  //   hasNext: () => arr.some(e => e.length > elementIndex),
  //   next: () => {
  //     while (elementIndex >= arr[index].length) {
  //       index++;
  //     }
  //     const num = arr[index][elementIndex];
  //     if (++index >= arr.length) {
  //       index = 0;
  //       elementIndex++;
  //     }
  //     return num;
  //   },
  // };

  // return {
  //   hasNext: () => false,
  //   next: () => {
  //     throw 0;
  //   },
  // };

  let index = 0;
  const newArr = arr;
  return {
    hasNext: () => newArr.some(e => e.length > 0),
    next: () => {
      while (newArr[index].length < 1) {
        index = index < newArr.length - 1 ? ++index : 0;
      }
      const num = newArr[index].shift();
      if (num === undefined) {
        throw new Error("Iterator reached an empty array");
      }
      if (++index >= newArr.length) {
        index = 0;
      }
      return num;
    },
  };
}


export function cycleArr<T>(arr: T[][]): MyIterator<T> {
  let column = 0;
  let row = 0;
  const arr1 = arr.map(subArray => subArray.length);
  const maxLength = Math.max(...arr1); // finding the length of the longest sub-array
  let totalCount = 0;
  arr.forEach(a => totalCount += a.length);
  console.log(totalCount)
  let count = 0;

  return {
    hasNext: () => {
      // for (let c = column; c < maxLength; c++) {
      //   for (let r = 0; r < arr.length; r++) {
      //     if (c < arr[r].length) {
      //       return true;
      //     }
      //   }
      // }
      if (count < totalCount)
         return true;
      return false;
    },
    next: () => {
      while (column < maxLength) {
        while (row < arr.length) {
          if (column < arr[row].length) {
            const element = arr[row][column];
            row = row + 1;

            if (row >= arr.length) {
              column = column + 1;
              row = 0;
            }

            count++;
            return element;
          }
          row = row + 1;
        }

        column = column + 1;
        row = 0;
      }
      throw new Error("No more elements left");
    },
  };
}


export function dovetail<T>(lists: List<T>[]): MyIterator<T> {
  let index = 0;
  let count = 1;
  let counter = 1;
  const newList = lists;

  // return {
  //   hasNext: () => false,
  //   next: () => {
  //     throw 0;
  //   },
  // };

  return {
    hasNext: () => !newList.every(e => e.isEmpty()),
    next: () => {
      if (newList.every(e => e.isEmpty())) throw new Error("Empty lists");
      while (!newList[index] || newList[index].isEmpty()) {
        index = index < newList.length - 1 ? ++index : 0;
        counter++;
      }
      const num = newList[index].head();
      newList[index] = newList[index].tail().isEmpty()
        ? empty()
        : node(newList[index].tail().head(), newList[index].tail().tail());
      index++;
      if (++counter > count) {
        count = count < newList.length ? count + 1 : count;
        counter = 1;
        index = 0;
      }
      return num;
    },
  };
}
