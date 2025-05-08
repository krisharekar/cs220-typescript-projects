import assert from "assert";

import type { StableMatcher, StableMatcherWithTrace } from "../include/stableMatching.js";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateInput(n: number): number[][] {
  // TODO
  const arr: number[][] = [];
  for (let i = 0; i < n; i++) arr[i] = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) arr[i][j] = j;
  for (let k = 0; k < n; k++)
    for (let i = n - 1; i >= 0; i--) {
      const j = randomInt(i, n);
      const temp: number = arr[k][i];
      arr[k][i] = arr[k][j];
      arr[k][j] = temp;
    }
  return arr;
}

const NUM_TESTS = 100; // Change this to some reasonably large value
const N = 80; // Change this to some reasonable size

function checkPerfectMatching(hires: { company: number; candidate: number }[]): boolean {
  const arr: number[][] = [[], []];
  hires.forEach(hire => {
    arr[0].push(hire.company);
    arr[1].push(hire.candidate);
  });
  return arr.every(a => a.every(e => a.indexOf(e) === a.lastIndexOf(e))); //perfect matching
}
/**
 * Tests whether or not the supplied function is a solution to the stable matching problem.
 * @param makeStableMatching A possible solution to the stable matching problem
 * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
 */
export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const hires = makeStableMatching(companies, candidates);

    assert(companies.length === hires.length, "Hires length is correct.");

    // TODO: More assertions go here.

    assert(checkPerfectMatching(hires), "Every pair follows perfect matching");

    hires.forEach(hire => {
      const company = companies[hire.company];
      for (let i = company.indexOf(hire.candidate) - 1; i >= 0; i--) {
        const candidateComp = hires.find(e => e.candidate === company[i])?.company || 0; //gets the original company's prefered candidate's pair company.
        assert(
          candidates[company[i]].indexOf(candidateComp) <= candidates[company[i]].indexOf(hire.company),
          "Pair matching is stable"
        ); //checks if prefered candidate's pair company is more preferred than the original company.
      }
    });
  }
}

// Part B

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    // TODO: Assertions go here

    assert(checkPerfectMatching(out), "Every pair follows perfect matching");

    let matched: { company: number; candidate: number }[] = [];
    trace.forEach(t => {
      const { from, to, fromCo } = t;
      const checkArr = fromCo ? companies : candidates;

      const comp = fromCo ? from : to;
      const cand = fromCo ? to : from;

      const isPartyMatched = matched.find(e => (fromCo ? e.company === comp : e.candidate === cand));
      const existingPair = matched.find(e => (fromCo ? e.candidate === cand : e.company === comp));

      assert(!isPartyMatched, "Proposal must be from unmatched party only"); //imp

      for (let i = 0; checkArr[from][i] !== to; i++) {
        const prevTrace = trace.find(e => e.from === from && e.to === checkArr[from][i] && e.fromCo === fromCo);
        assert(prevTrace, "Must have proposed to higher preferences first");
      }

      const isHigherPreference = existingPair
        ? fromCo
          ? candidates[cand].indexOf(comp) < candidates[cand].indexOf(existingPair.company)
          : companies[comp].indexOf(cand) < companies[comp].indexOf(existingPair.candidate)
        : false;

      if (!existingPair) {
        matched.push({ company: comp, candidate: cand });
      } else if (isHigherPreference) {
        matched = matched.filter(e => e !== existingPair);
        matched.push({ company: comp, candidate: cand });
      }
    });

    assert(
      JSON.stringify(out.sort((a, b) => a.company - b.company)) ===
        JSON.stringify(matched.sort((a, b) => a.company - b.company)),
      "out must match the output of the trace"
    );
  }
}

// /**
//  * Tests whether or not the supplied function is a solution to the stable matching problem.
//  * @param makeStableMatching A possible solution to the stable matching problem
//  * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
//  */
// export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
//   for (let i = 0; i < NUM_TESTS; ++i) {
//     const companies = generateInput(N);
//     // const companies = [ [ 1, 0, 2 ], [ 1, 0, 2 ], [ 1, 2, 0 ] ]
//     const candidates = generateInput(N);
//     // const candidates = [ [ 1, 2, 0 ], [ 0, 1, 2 ], [ 1, 2, 0 ] ]
//     const hires = makeStableMatching(companies, candidates);

//     assert(companies.length === hires.length, "Hires length is correct.");

//     // TODO: More assertions go here.

//     console.log("comp", companies);
//     console.log("cand", candidates);
//     // console.log('hires', hires);
//     // assert(hires.every(hire => hires.indexOf({company: hire.company, candidate: hire.candidate }) === hires.lastIndexOf({company: hire.company, candidate: hire.candidate }))); //perfect matching
//     // const arr: number[][] = [[], []];
//     // hires.forEach(hire => {
//     //   arr[0].push(hire.company);
//     //   arr[1].push(hire.candidate);
//     // });
//     // assert(
//     //   arr.every(a => a.every(e => a.indexOf(e) === a.lastIndexOf(e))),
//     //   "Every pair follows perfect matching"
//     // ); //perfect matching

//     assert(checkPerfectMatching(hires), "Every pair follows perfect matching");

//     hires.forEach(hire => {
//       const company = companies[hire.company];
//       for (let i = company.indexOf(hire.candidate) - 1; i >= 0; i--) {
//         const candidateComp = hires.find(e => e.candidate === company[i])?.company || 0; //gets the original company's prefered candidate's pair company.
//         assert(
//           candidates[company[i]].indexOf(candidateComp) <= candidates[company[i]].indexOf(hire.company),
//           "Pair matching is stable"
//         ); //checks if prefered candidate's pair company is more preferred than the original company.
//       }

//       // const candidate = candidates[hire.candidate];
//       // console.log(company.indexOf(hire.candidate), candidate.indexOf(hire.company));
//       // console.log(Math.abs(company.indexOf(hire.candidate) - candidate.indexOf(hire.company)) <= Math.sqrt(N));
//       // assert(Math.abs(company.indexOf(hire.candidate) - candidate.indexOf(hire.company)) <= Math.sqrt(N))
//       // if (Math.abs(company.indexOf(hire.candidate) - candidate.indexOf(hire.company)) > Math.sqrt(N) && candidates[company[i]].indexOf(hire.company) < candidate.indexOf(hire.company))
//       // assert(false);
//       // if (candidates[company[i]].indexOf(hire.company) < candidate.indexOf(hire.company) && companies[])
//       // for (let j=candidates[company[i]].indexOf(cand);j>=0;j--) {

//       // }
//     });
//   }
// }

// // Part B

// /**
//  * Tests whether or not the supplied function follows the supplied algorithm.
//  * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
//  * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
//  * do not match with the result (out).
//  */
// export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
//   for (let i = 0; i < NUM_TESTS; ++i) {
//     const companies = generateInput(N);
//     const candidates = generateInput(N);
//     const { trace, out } = makeStableMatchingTrace(companies, candidates);

//     // This statement is here to prevent linter warnings about `trace` and `out` not being used.
//     // Remove it as necessary.
//     // console.log("comp", companies);
//     // console.log("cand", candidates);
//     // console.log(trace, out);

//     // TODO: Assertions go here

//     // function checkPrevTraces(from: number, to: number, fromCo: boolean): number {
//     //   const arr = fromCo ? companies : candidates;
//     //   for (let i = 0; arr[from][i] != to; i++) {
//     //     const prevTrace = trace.findIndex(e => e.from === from && e.to === arr[from][i] && e.fromCo === fromCo)
//     //     return prevTrace;
//     //   }
//     // }

//     assert(checkPerfectMatching(out), "Every pair follows perfect matching");

//     let matched: { company: number; candidate: number }[] = [];
//     trace.forEach(t => {
//       const { from, to, fromCo } = t;
//       const checkArr = fromCo ? companies : candidates;

//       assert(
//         !matched.find(e => (fromCo ? e.company === from : e.candidate === from)),
//         "Proposal must be from unmatched party only"
//       ); //imp

//       // if (fromCo) {
//       // companies[from].forEach(cand => {
//       //   const prevTrace = trace.findIndex(e => e.from === from && e.to === cand && e.fromCo)
//       //   if (prevTrace)
//       //     assert(prevTrace <= index)
//       // })
//       for (let i = 0; checkArr[from][i] !== to; i++) {
//         const prevTrace = trace.find(e => e.from === from && e.to === checkArr[from][i] && e.fromCo === fromCo);
//         // console.log(prevTrace)
//         assert(prevTrace);
//         // if (prevTrace) {
//         //   console.log(t)
//         //   console.log(prevTrace)
//         //   assert(prevTrace < index);
//         // }
//       }
//       // console.log(checkPrevTraces(from, to, fromCo))
//       // }

//       const comp = fromCo ? from : to;
//       const cand = fromCo ? to : from;
//       // const pair = matched.find(e => e.candidate === to);
//       // if (!pair && !matched.find(e => e.company === from)) matched.push({ company: from, candidate: to });
//       // else if (
//       //   pair &&
//       //   !matched.find(e => e.company === from) &&
//       //   candidates[to].indexOf(from) < candidates[to].indexOf(pair.company)
//       // ) {
//       //   matched = matched.filter(e => e.candidate !== to);
//       //   matched.push({ company: from, candidate: to });
//       // }

//       // const existingPair = matched.find(e => e.candidate === to);
//       // const isCompanyMatched = matched.find(e => e.company === from);

//       // if (!existingPair && !isCompanyMatched) {
//       //   matched.push({ company: from, candidate: to });
//       // } else if (
//       //   existingPair &&
//       //   !isCompanyMatched &&
//       //   candidates[to].indexOf(from) < candidates[to].indexOf(existingPair.company)
//       // ) {
//       //   // console.log(`Replacing: ${existingPair.company} → ${from}`);
//       //   matched = matched.filter(e => e.candidate !== to);
//       //   matched.push({ company: from, candidate: to });
//       // }

//       const existingPair = matched.find(e => (fromCo ? e.candidate === cand : e.company === comp));
//       const isPartyMatched = matched.find(e => (fromCo ? e.company === comp : e.candidate === cand));
//       const isHigherPreference = existingPair
//         ? fromCo
//           ? candidates[cand].indexOf(comp) < candidates[cand].indexOf(existingPair.company)
//           : companies[comp].indexOf(cand) < companies[comp].indexOf(existingPair.candidate)
//         : false;

//       if (!existingPair && !isPartyMatched) {
//         matched.push({ company: comp, candidate: cand });
//       } else if (existingPair && !isPartyMatched && isHigherPreference) {
//         // matched = matched.filter(e => (fromCo ? e.candidate !== cand : e.company !== comp));
//         matched = matched.filter(e => e !== existingPair);
//         matched.push({ company: comp, candidate: cand });
//       }

//       // out.forEach(output => {
//       //   const proposals = trace.filter(t => t.from === output.company && t.fromCo)

//       // })
//     });
//     // console.log("out", out);
//     // console.log("matched", matched);

//     assert(
//       JSON.stringify(out.sort((a, b) => a.company - b.company)) ===
//         JSON.stringify(matched.sort((a, b) => a.company - b.company))
//     );
//   }
// }
