import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
  concat1,
  concat2,
  concat3
} from "./lists.js";

const arraysEqual = (a: number[], b: number[]): boolean =>
  a.length === b.length && a.every((val, index) => val === b[index]);

describe("insertOrdered", () => {
  // Tests for insertOrdered go here
  it("should inset 3 in correct position", () => {
    const lst = arrayToList([1, 2, 4, 5]);
    const newList = insertOrdered(lst, 3);
    assert(arraysEqual([1, 2, 3, 4, 5], listToArray(newList)));
  });

  it("should insert duplicates", () => {
    const lst = arrayToList([2, 2, 2, 2]);
    const newList = insertOrdered(lst, 2);
    assert(arraysEqual([2, 2, 2, 2, 2], listToArray(newList)));
  });

  it("should insert into empty list", () => {
    const lst = arrayToList([]);
    const newList = insertOrdered(lst, 5);
    assert(arraysEqual([5], listToArray(newList)));
  });

  it("should insert at the beginning", () => {
    const lst = arrayToList([2, 3, 4]);
    const newList = insertOrdered(lst, 1);
    assert(arraysEqual([1, 2, 3, 4], listToArray(newList)));
  });

  it("should insert at the end", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = insertOrdered(lst, 5);
    assert(arraysEqual([1, 2, 3, 5], listToArray(newList)));
  });

  it("should handle negative numbers", () => {
    const lst = arrayToList([-4, -2, 0, 2]);
    const newList = insertOrdered(lst, -3);
    assert(arraysEqual([-4, -3, -2, 0, 2], listToArray(newList)));
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here
  it("should return correct list", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNRev(lst, 2);
    assert(arraysEqual([6, 4, 2], listToArray(newList)));
  });

  it("should reverse the entire list when n=1", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = everyNRev(lst, 1);
    assert(arraysEqual([3, 2, 1], listToArray(newList)));
  });

  it("should return empty list for invalid n", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNRev(lst, 2.5);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return empty list for non positive n", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNRev(lst, 0);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return empty list n > size", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = everyNRev(lst, 5);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle n equal to list size", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = everyNRev(lst, 3);
    assert(arraysEqual([3], listToArray(newList)));
  });
});

describe("everyNCond", () => {
  // Tests for everyNCond go here
  it("should return correct list", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNCond(lst, 2, e => e < 5);
    assert(arraysEqual([2, 4], listToArray(newList)));
  });

  it("should return empty list for invalid n", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNCond(lst, 2.5, e => e < 6);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return empty list for non positive n", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNCond(lst, 0, e => e < 5);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return empty list n > size", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = everyNCond(lst, 5, e => e < 5);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return every 2nd element meeting condition", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const newList = everyNCond(lst, 2, e => e % 2 === 0);
    assert(arraysEqual([4], listToArray(newList)));
  });

  it("should handle condition that matches no elements", () => {
    const lst = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(lst, 2, e => e > 10);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here
  function cond(prev: number, curr: number, next: number): boolean {
    return prev <= curr && curr <= next;
  }
  it("should return correct", () => {
    const lst = arrayToList([1, 2, 3, 7, 5, 10, 12]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([2, 3, 10], listToArray(newList)));
  });

  it("should handle equals values", () => {
    const lst = arrayToList([1, 1, 1, 1]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([1, 1], listToArray(newList)));
  });

  it("should empty", () => {
    const lst = arrayToList([]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle three elements", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([2], listToArray(newList)));
  });

  it("should handle one element", () => {
    const lst = arrayToList([1]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle two elements", () => {
    const lst = arrayToList([1, 2]);
    const newList = keepTrendMiddles(lst, cond);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here
  it("should return all local maxima", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 8, 4]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([7, 8], listToArray(newList)));
  });
  it("should handle float", () => {
    const lst = arrayToList([2, 2.5, 2]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([2.5], listToArray(newList)));
  });
  it("should return empty", () => {
    const lst = arrayToList([2, 2.5, 2.5]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty list when there are no local maxima", () => {
    const lst = arrayToList([1, 2, 2, 1]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty for three numbers", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return none for single element", () => {
    const lst = arrayToList([5]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here
  it("should return all local minima", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 8, 4]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([2, 5], listToArray(newList)));
  });

  it("should return none for all same elements", () => {
    const lst = arrayToList([2, 2, 2]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle list with single element", () => {
    const lst = arrayToList([5]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should handle float", () => {
    const lst = arrayToList([2, 1.5, 2]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([1.5], listToArray(newList)));
  });
  it("should return none", () => {
    const lst = arrayToList([2, 2.5, 2.5]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty list when there are no local minima", () => {
    const lst = arrayToList([1, 2, 2, 1]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty for three numbers", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = keepLocalMinima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here
  it("should return all local minima", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 8, 4]);
    const newList = keepLocalMinimaAndMaxima(lst);
    assert(arraysEqual([2, 7, 5, 8], listToArray(newList)));
  });
  it("should return none", () => {
    const lst = arrayToList([2, 3, 4, 5, 6]);
    const newList = keepLocalMinimaAndMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty list when there are no local maxima or minima", () => {
    const lst = arrayToList([1, 2, 2, 0.5, 0.5, 1]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
  it("should return empty for three numbers", () => {
    const lst = arrayToList([1, 2, 3]);
    const newList = keepLocalMaxima(lst);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("should return product of all non negative numbers", () => {
    const lst = arrayToList([2, 3, -1, 0.5, 2]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([2, 6, 0.5, 1], listToArray(newList)));
  });
  it("should return empty", () => {
    const lst = arrayToList([-2, -3, -1, -0.5, -2]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return correct product for all zeros", () => {
    const lst = arrayToList([0, 0, 0]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([0, 0, 0], listToArray(newList)));
  });

  it("should return the only number", () => {
    const lst = arrayToList([2]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([2], listToArray(newList)));
  });

  it("should return none", () => {
    const lst = arrayToList([-2, -3, -4]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle a list starting with negative numbers", () => {
    const lst = arrayToList([-1, 2, 3, -4, 5]);
    const newList = nonNegativeProducts(lst);
    assert(arraysEqual([2, 6, 5], listToArray(newList)));
  });
});

describe("negativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("should return product of all negative numbers", () => {
    const lst = arrayToList([-3, -6, 2, -2, -1, -2]);
    const newList = negativeProducts(lst);
    assert(arraysEqual([-3, 18, -2, 2, -4], listToArray(newList)));
  });

  it("should return empty list when no negative numbers", () => {
    const lst = arrayToList([1, 2, 3, 4]);
    const newList = negativeProducts(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return correct product for all zeros", () => {
    const lst = arrayToList([0, 0, 0]);
    const newList = negativeProducts(lst);
    console.log(listToArray(newList));
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return correct products", () => {
    const lst = arrayToList([3, 6, -2, -2, -1, -2]);
    const newList = negativeProducts(lst);
    assert(arraysEqual([-2, 4, -4, 8], listToArray(newList)));
  });

  it("should return the only number", () => {
    const lst = arrayToList([-2]);
    const newList = negativeProducts(lst);
    assert(arraysEqual([-2], listToArray(newList)));
  });

  it("should return none", () => {
    const lst = arrayToList([2, 3, 4]);
    const newList = negativeProducts(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle separated by zeros", () => {
    const lst = arrayToList([-2, 0, -3, -4]);
    const newList = negativeProducts(lst);
    console.log(listToArray(newList));
    assert(arraysEqual([-2, -3, 12], listToArray(newList)));
  });
});

describe("deleteFirst", () => {
  // Tests for deleteFirst go here
  it("should delete first element", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 3, 4, 3]);
    const newList = deleteFirst(lst, 3);
    assert(arraysEqual([9, 2, 7, 5, 3, 4, 3], listToArray(newList)));
  });

  it("should do nothing if element is not found", () => {
    const lst = arrayToList([9, 2, 3, 7]);
    const newList = deleteFirst(lst, 5);
    assert(arraysEqual([9, 2, 3, 7], listToArray(newList)));
  });

  it("should do nothing if string is not found", () => {
    const lst = arrayToList(['a', 'b', 'c']);
    const newList = deleteFirst(lst, 'c');
    assert.deepEqual(['a', 'b'], listToArray(newList));
  });

  it("should return empty", () => {
    const lst = arrayToList([9]);
    const newList = deleteFirst(lst, 9);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle empty list", () => {
    const lst = arrayToList([]);
    const newList = deleteFirst(lst, 3);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("deleteLast", () => {
  // Tests for deleteLast go here
  it("should delete last element", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 3, 4, 3]);
    const newList = deleteLast(lst, 3);
    assert(arraysEqual([9, 2, 3, 7, 5, 3, 4], listToArray(newList)));
  });

  it("should do nothing if element is not found", () => {
    const lst = arrayToList([9, 2, 3, 7]);
    const newList = deleteLast(lst, 5);
    assert(arraysEqual([9, 2, 3, 7], listToArray(newList)));
  });

  it("should delete correct last element", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 3, 4, 3, 5]);
    const newList = deleteLast(lst, 3);
    assert(arraysEqual([9, 2, 3, 7, 5, 3, 4, 5], listToArray(newList)));
  });

  it("should return empty", () => {
    const lst = arrayToList([9]);
    const newList = deleteLast(lst, 9);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should handle empty list", () => {
    const lst = arrayToList([]);
    const newList = deleteLast(lst, 3);
    assert(arraysEqual([], listToArray(newList)));
  });
});

describe("squashList", () => {
  // Tests for squashList go here
  it("should return correct list", () => {
    const l = arrayToList([2, 3, 4]);
    const lst = arrayToList([9, l, 3, 7, 5, 3, 4, 3]);
    const newList = squashList(lst);
    assert(arraysEqual([9, 9, 3, 7, 5, 3, 4, 3], listToArray(newList)));
  });

  it("should handle negatives", () => {
    const l = arrayToList([2, -3, 4]);
    const lst = arrayToList([9, l, 3, 7, 5, 3, l, 3]);
    const newList = squashList(lst);
    assert(arraysEqual([9, 3, 3, 7, 5, 3, 3, 3], listToArray(newList)));
  });

  it("should handle empty list", () => {
    const lst = arrayToList([]);
    const newList = squashList(lst);
    assert(arraysEqual([], listToArray(newList)));
  });

  it("should return same list", () => {
    const lst = arrayToList([9, 2, 3, 7, 5, 3, 4, 3]);
    const newList = squashList(lst);
    assert(arraysEqual([9, 2, 3, 7, 5, 3, 4, 3], listToArray(newList)));
  });

  it("should return handle single element list", () => {
    const l = arrayToList([2]);
    const lst = arrayToList([l, 4]);
    const newList = squashList(lst);
    console.log(listToArray(newList));
    assert(arraysEqual([2, 4], listToArray(newList)));
  });

  it("should handle multiple lists", () => {
    const l1 = arrayToList([]);
    const l2 = arrayToList([1, 2]);
    const lst = arrayToList([l1, l2, 3]);
    const newList = squashList(lst);
    assert(arraysEqual([0, 3, 3], listToArray(newList)));
  });
});


it.only("test", () => {
  // const l1 = arrayToList([1, 2, 3, 4]);
  // const l2 = arrayToList([5, 6, 7]);
  // const newList = concat3(l1, l2);
  // assert(arraysEqual([1, 2, 3, 4, 5, 6, 7], listToArray(newList)));

  // let lst1 = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // create a list with 10 elements
  // lst1 = concat1(lst1, concat1(lst1, lst1)) // end of the code fragment
  // console.log(listToArray(lst1).length)

  let lst1 = arrayToList([1, 2]); // create a list with 2 elements
  let lst2 = arrayToList([3, 4]); // create another list with 2 elements
  function concat (l1: List<number>, l2: List<number>): List<number> {
    return l1.isEmpty()? l2 : node(l1.head(), concat(l1.tail(), l2));
  } 
  const cat0 = (lst: List<number>) => concat(lst, empty());
  lst1 = concat(cat0(lst1), lst2);
  console.log(listToArray(lst1))
  // end of the code fragment
});