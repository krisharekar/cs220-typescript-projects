import { sempty, snode, Stream } from "../include/stream.js";

export type Series = Stream<number>;

export function addSeries(s: Series, t: Series): Series {
  // TODO
  return s.isEmpty() ? t : t.isEmpty() ? s : snode(s.head() + t.head(), () => addSeries(s.tail(), t.tail()));
}

export function prodSeries(s: Series, t: Series): Series {
  // TODO
  if (s.isEmpty() || t.isEmpty()) return sempty();
  const a0 = s.head();
  function helper(t1: Series): Series {
    if (t1.isEmpty()) return sempty();
    return snode(a0 * t1.head(), () => helper(t1.tail()));
  }
  const first = helper(t);
  const tail = snode(0, () => prodSeries(s.tail(), t));

  return addSeries(first, tail);
}

// 1+2x+3x^2
//  1 + x(2+3x)
// a0 + x(s1(x))

export function derivSeries(s: Series): Series {
  // TODO
  if (s.isEmpty()) return sempty();
  function helper(s1: Series, index: number): Series {
    if (s1.isEmpty()) return index === 1 ? snode(0, () => sempty()) : sempty();
    return snode(s1.head() * index, () => helper(s1.tail(), index + 1));
  }
  return helper(s.tail(), 1);
}

export function coeff(s: Series, n: number): number[] {
  // TODO
  // if(s.isEmpty() || n < 0) return [];
  // return [s.head(), ...coeff(s.tail(), n-1)];

  function helper(s: Series, n: number, acc: number[]): number[] {
    if (s.isEmpty() || n < 0) return acc;
    acc.push(s.head());
    return helper(s.tail(), n - 1, acc);
  }
  return helper(s, n, []);
}

export function evalSeries(s: Series, n: number): (x: number) => number {
  // TODO
  return (x: number) => coeff(s, n).reduce((sum, num, idx) => sum + num * x ** idx, 0);
}

export function applySeries(f: (c: number) => number, v: number): Series {
  // TODO
  return snode(v, () => applySeries(f, f(v)));
}

export function expSeries(): Series {
  // TODO
  let i = 1;
  return applySeries(k => k / i++, 1);
}

//n=0
//a0+k = c0a0 + c1a1 + ... + ck-1ak-1
//n=1
//a1+k = c0a1 + c1a2 + ... + ck-1ak
export function recurSeries(coef: number[], init: number[]): Series {
  // TODO
  function helper(coef: number[], init: number[], index: number): Series {
    if (index < init.length) {
      return snode(init[index], () => helper(coef, init, index + 1));
    }
    const num = coef.reduce((acc, x, i) => acc + x * init[i], 0);
    return snode(num, () => helper(coef, [...init.slice(1), num], index + 1));
  }

  return helper(coef, init, 0);
}
