import { List, node, empty, reverseList } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  // return reverseList(lst.reduce((acc, e) => {
  //   if (el < e)
  //     return node(e, node(el, acc));
  //   return node(e, acc);
  // }, empty()));

  if (lst.isEmpty() || el < lst.head()) return node(el, lst);
  return node(lst.head(), insertOrdered(lst.tail(), el));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  if (!Number.isInteger(n) || n < 1) return empty();
  let count = 0;
  return lst.reduce((acc, e) => {
    count++;
    if (count % n == 0) return node(e, acc);
    return acc;
  }, empty());
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  if (!Number.isInteger(n) || n < 1) return empty();
  let count = 0;
  return lst.filter(e => {
    if (!cond(e)) return false;
    count++;
    return count % n == 0;
  });
  // return reverseList(everyNRev(lst, n)).filter(e => cond(e));
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  // let prev = lst.head();
  // let curr = lst.tail().head();
  // let next = lst.tail().tail().head();
  // let index = 0;
  // function poppedList(inputList: List<number>): List<number> {
  //   return node(inputList.tail().head(), inputList.tail().tail());
  // }
  // return lst.filter(e => {
  //   if (index === 0) {
  //     prev = e;
  //     return;
  //   }
  //   curr = e;

  // })

  // let newList: List<number> = empty();
  // const _l: List<number> = lst.reduce((acc, e) => {
  //   acc = node(e, acc);
  //   if (!acc.tail().isEmpty() && !acc.tail().tail().isEmpty()) {
  //     const bool = allSatisfy(acc.tail().tail().head(), acc.tail().head(), acc.head());
  //     acc = node(acc.head(), node(acc.tail().head(), empty()));
  //     if (bool)
  //       newList = node(acc.tail().head(), newList);
  //       return acc;
  //   }
  //   return acc;
  // }, empty());

  function trendMiddlesHelper(prev: number, rest: List<number>): List<number> {
    if (rest.isEmpty() || rest.tail().isEmpty()) return empty();
    const curr = rest.head();
    const next = rest.tail().head();
    return allSatisfy(prev, curr, next)
      ? node(curr, trendMiddlesHelper(curr, rest.tail()))
      : trendMiddlesHelper(curr, rest.tail());
  }

  return lst.isEmpty() ? lst : trendMiddlesHelper(lst.head(), lst.tail());
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev < curr && curr > next);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev > curr && curr < next);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => (prev < curr && curr > next) || (prev > curr && curr < next));
}

function productHelper(lst: List<number>, product: number, sign: number): List<number> {
  // if (lst.isEmpty() && acc.isEmpty()) return empty();
  // if (lst.isEmpty() || lst.head()*sign < 0) {
  //   const sum = acc.reduce((acc, e) => acc*e, 1);
  //   return node(sum, productHelper(lst.isEmpty() ? empty() : lst.tail(), empty(), sign));
  // }
  // acc = node(lst.head(), acc);
  // return productHelper(lst.tail(), acc, sign);
  // lst.reduce((acc, e) => {
  //   if(e > 0) {
  //     return node(e, acc);
  //   } else {
  //     acc.reduce((ac, y) => ac*y, 1)
  //   }
  //   return acc;
  // }, empty())

  if (lst.isEmpty()) return empty();
  if (lst.head() >= 0 === sign >= 0) {
    product *= lst.head();
    return node(product, productHelper(lst.tail(), product, sign));
  }
  return productHelper(lst.tail(), 1, sign);
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  return productHelper(lst, 1, 1);
}

export function negativeProducts(lst: List<number>): List<number> {
  return productHelper(lst, 1, -1);
}

export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  let flag = false;
  return reverseList(
    lst.reduce((acc, e) => {
      return flag ? node(e, acc) : el === e ? ((flag = true), acc) : node(e, acc);
    }, empty())
  );
}

export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  return reverseList(deleteFirst(reverseList(lst), el));
}

export function squashList(lst: List<number | List<number>>): List<number> {
  return lst.map(e => {
    if (typeof e === "number") return e;
    return e.reduce((acc, e) => acc + e, 0);
  });
}



export function concat1<T>(lst1: List<T>, lst2: List<T>): List<T> {
  return lst1.isEmpty() ? lst2 : node(lst1.head(), concat1(lst1.tail(), lst2));
}

export function concat2<T>(lst1: List<T>, lst2: List<T>): List<T> {
  return reverseList(lst1).reduce((acc, e) => node(e, acc), lst2);
} 
export function concat3<T>(lst1: List<T>, lst2: List<T>): List<T> {
  return reverseList(lst2.reduce((acc, e) => node(e, acc), reverseList(lst1)));
}

