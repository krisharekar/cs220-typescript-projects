import { parseExpression, parseProgram } from "../include/parser.js";
import { State, interpExpression, interpStatement, interpProgram, PARENT_STATE_KEY } from "./interpreter.js";

function expectStateToBe(program: string, state: State) {
  expect(interpProgram(parseProgram(program))).toEqual(state);
}

// const PARENT_STATE_KEY = Symbol("[[PARENT]]");

describe("interpExpression", () => {
  it("evaluates number literals", () => {
    expect(interpExpression({}, parseExpression("42"))).toEqual(42);
  });
  it("evaluates boolean literals", () => {
    expect(interpExpression({}, parseExpression("true"))).toEqual(true);
    expect(interpExpression({}, parseExpression("false"))).toEqual(false);
  });

  it("evaluates addition with multiple numbers", () => {
    const r = interpExpression({ x: 5 }, parseExpression("x+3+x+1"));
    expect(r).toEqual(14);
  });

  it("evaluates addition with multiple variables", () => {
    const r = interpExpression({ x: 5, y: 2, z: 1 }, parseExpression("x+y+z"));
    expect(r).toEqual(8);
  });

  it("evaluates multiplication with a variable", () => {
    const r = interpExpression({ x: 10 }, parseExpression("x * 2"));
    expect(r).toEqual(20);
  });

  it("evaluates subtraction with a variable", () => {
    const r = interpExpression({ x: 10 }, parseExpression("x - 2"));
    expect(r).toEqual(8);
  });

  it("left-associates subtraction", () => {
    expect(interpExpression({}, parseExpression("10-5-2"))).toEqual(3);
  });

  it("evaluates divison to float", () => {
    const r = interpExpression({ x: 11 }, parseExpression("x / 2"));
    expect(r).toEqual(5.5);
  });

  it("left-associates division", () => {
    expect(interpExpression({}, parseExpression("16/4/2"))).toEqual(2);
  });

  it("evaluates multiple operations with a variable", () => {
    const r = interpExpression({ x: 10 }, parseExpression("x-2+5*5/2"));
    expect(r).toEqual(20.5);
  });

  it("evaluates boolean values to true for AND operator", () => {
    const r = interpExpression({ x: true }, parseExpression("x && true"));
    const r2 = interpExpression({ x: 10 }, parseExpression("x < 11 && true"));
    expect(r).toEqual(true);
    expect(r2).toEqual(true);
  });

  it("evaluates boolean values to false for AND operator", () => {
    const r = interpExpression({ x: false }, parseExpression("x && true"));
    expect(r).toEqual(false);
  });

  it("evaluates boolean values to false for OR operator", () => {
    const r = interpExpression({ x: false }, parseExpression("x || false"));
    const r2 = interpExpression({ x: 10 }, parseExpression("x < 12 || false"));
    expect(r).toEqual(false);
    expect(r2).toEqual(true);
  });

  it("evaluates boolean values to true for OR operator", () => {
    const r = interpExpression({ x: false }, parseExpression("x || true"));
    const r2 = interpExpression({ x: true }, parseExpression("x || false"));
    expect(r).toEqual(true);
    expect(r2).toEqual(true);
  });

  it("short circuits for logical operations with numbers", () => {
    //imp?
    const r = interpExpression({}, parseExpression("false && 1/0 && true"));
    const r2 = interpExpression({}, parseExpression("true || 1/0 && false"));
    expect(r).toEqual(false);
    expect(r2).toEqual(true);
  });

  it("evaluates greater than operator", () => {
    const r = interpExpression({ x: 11 }, parseExpression("x > 2"));
    const r2 = interpExpression({ x: 11 }, parseExpression("x > 11"));
    expect(r).toEqual(true);
    expect(r2).toEqual(false);
  });

  it("evaluates lesser than operator", () => {
    const r = interpExpression({ x: 11 }, parseExpression("x < 20"));
    const r2 = interpExpression({ x: 11 }, parseExpression("x < 11"));
    expect(r).toEqual(true);
    expect(r2).toEqual(false);
  });

  it("supports Infinity", () => {
    expect(interpExpression({ a: Infinity }, parseExpression("a + 10"))).toEqual(Infinity);
  });

  it("evaluates equal to operator", () => {
    const r = interpExpression({ x: 11 }, parseExpression("x < 12 === true"));
    const r2 = interpExpression({ x: 11 }, parseExpression("x === false"));
    const r3 = interpExpression({ x: 11 }, parseExpression("x === 11"));
    const r4 = interpExpression({ x: 11 }, parseExpression("x === x"));
    expect(r).toEqual(true);
    expect(r2).toEqual(false);
    expect(r3).toEqual(true);
    expect(r4).toEqual(true);
  });

  it("allows chaining === correctly", () => {
    expect(interpExpression({}, parseExpression("1 === 1 === true"))).toEqual(true);
  });

  //throwing errors
  it("throws error for division with zero", () => {
    expect(() => interpExpression({ x: 11 }, parseExpression("x / 0"))).toThrow();
  });

  it("throws error for undefined variable", () => {
    expect(() => interpExpression({}, parseExpression("x+1"))).toThrow();
  });

  it("throws error for logical operations with numbers", () => {
    expect(() => interpExpression({ x: 11 }, parseExpression("x && 0"))).toThrow();
    expect(() => interpExpression({ x: false }, parseExpression("x || 0"))).toThrow();
  });

  it("throws error for arithmetic operations with boolean", () => {
    expect(() => interpExpression({ x: true }, parseExpression("x + 0"))).toThrow();
  });

  it("throws when comparing non-numbers", () => {
    expect(() => interpExpression({}, parseExpression("true > false"))).toThrow();
  });

  it("should throw for not yet implemented", () => {
    expect(() => interpExpression({}, parseExpression("function (x) {}"))).toThrow();
  });
});

describe("interpStatement", () => {
  // Tests for interpStatement go here.

  it("reassigns an existing variable", () => {
    const st: State = { x: 1 };
    const stmt = parseProgram("x = 10;")[0];
    interpStatement(st, stmt);
    expect(st.x).toEqual(10);
  });

  it("executes the true branch of an if", () => {
    const st: State = { x: 1, y: 0 };
    const stmt = parseProgram("if (x === 1) { y = 2; } else { y = 3; }")[0];
    interpStatement(st, stmt);
    expect(st.y).toEqual(2);
  });

  it("executes the else branch of an if", () => {
    const st: State = { x: 0, y: 0 };
    const stmt = parseProgram("if (x === 1) { y = 2; } else { y = 3; }")[0];
    interpStatement(st, stmt);
    expect(st.y).toEqual(3);
  });

  it("runs a while loop", () => {
    const st: State = { x: 0 };
    const stmt = parseProgram("while (x < 3) { x = x + 1; }")[0];
    interpStatement(st, stmt);
    expect(st.x).toEqual(3);
  });

  it("prints a value", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    const st: State = { x: 7 };
    const stmt = parseProgram("print(x);")[0];
    interpStatement(st, stmt);
    expect(spy).toHaveBeenCalledWith(7);
    spy.mockRestore();
  });

  it("does not leak block-scoped variables after if", () => {
    const st: State = { a: 1 };
    const stmt = parseProgram("if (true) { let x = 2; } else {}")[0];
    interpStatement(st, stmt);
    expect(st).toEqual({ a: 1 });
  });

  it("does not leak block-scoped variables after while", () => {
    const st: State = { a: 1 };
    const stmt = parseProgram("while (a===1) { let x = 2; a = a+1; }")[0];
    interpStatement(st, stmt);
    expect(st).toEqual({ a: 2 });
  });

  it("assigns to inner scope without mutating parent", () => {
    const globalState: State = { x: 1 };
    const innerState: State = { [PARENT_STATE_KEY]: globalState, x: 1 };
    const stmt = parseProgram("x = 2;")[0];
    interpStatement(innerState, stmt);
    expect(innerState.x).toEqual(2);
    expect(globalState.x).toEqual(1);
  });

  it("assignment updates nearest declaration in nested scopes", () => {
    const top: State = { x: 1 };
    const mid: State = { [PARENT_STATE_KEY]: top, x: 2 };
    const bot: State = { [PARENT_STATE_KEY]: mid };
    const stmt = parseProgram("x = 3;")[0];
    interpStatement(bot, stmt);
    expect(mid.x).toBe(3);
    expect(top.x).toBe(1);
  });

  it("shadows parent var inside a block without mutating parent", () => {
    const parent: State = { x: 1 };
    const stmt = parseProgram("if (true) { let x = 2; } else {}")[0];
    interpStatement(parent, stmt);
    // parent.x stays 1
    expect(parent.x).toBe(1);
  });

  it("should redeclare inside scope", () => {
    expect(() => interpStatement({ [PARENT_STATE_KEY]: { x: 10 } }, parseProgram("let x = 1;")[0])).not.toThrow();
  });

  it("should throw for redeclaring identifier", () => {
    expect(() => interpStatement({ x: 0 }, parseProgram("let x = 1;")[0])).toThrow();
  });

  it("should throw for undeclared identifier", () => {
    expect(() => interpStatement({}, parseProgram("x = 1;")[0])).toThrow();
  });

  it("should throw for not implemented", () => {
    expect(() => interpStatement({ x: 10 }, parseProgram("return x;")[0])).toThrow();
  });
});

describe("interpProgram", () => {
  it("handles declarations and reassignment", () => {
    // TIP: Use the grave accent to define multiline strings
    expectStateToBe(
      `      
      let x = 10;
      x = 20;
    `,
      { x: 20 }
    );
  });

  it("returns empty state for no statements", () => {
    expect(interpProgram(parseProgram(``))).toEqual({});
  });

  it("prints the correct value", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    interpProgram(parseProgram("let x = 5; print(x);"));
    expect(spy).toHaveBeenCalledWith(5);
    spy.mockRestore();
  });

  it("handles while loops", () => {
    expectStateToBe(
      `      
      let x = 10;
      while (x < 15) {
        x = x+1;
      }
    `,
      { x: 15 }
    );
  });

  it("handles if statements", () => {
    expectStateToBe(
      `      
      let x = 10;
      let a = 5;
      if (x === 10) {
        a = 30;
      } else {
        x = 0;
      }
    `,
      { x: 10, a: 30 }
    );
  });

  it("handles nested control flow", () => {
    expectStateToBe(
      `
      let x = 0;
      let y = 0;
      while (x < 3) {
        x = x + 1;
        if (x === 2) {
          y = 100;
        } else {
          y = y + 1;
        }
      }
      `,
      { x: 3, y: 101 }
    );
  });

  it("updates outer scope variable from inner block", () => {
    expectStateToBe(
      `
      let x = 1;
      if (true) {
        let a = 1;
        x = 2;
      } else {}
    `,
      { x: 2 }
    );
  });

  it("works with numbers in if statements", () => {
    expectStateToBe(
      `
      let x = 1;
      let y = 5;
      if (1) {
        x = 2;
      } else {}
      if (0) {
        y = 2;
      } else {
        y = 1;
      }
    `,
      { x: 2, y: 1 }
    );
  });

  it("throws for use before declaration", () => {
    expect(() =>
      interpProgram(
        parseProgram(`
      print(a);
      let a = 5;
    `)
      )
    ).toThrow();
  });

  it("prints according to correct scope", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    interpProgram(
      parseProgram(`
      let x = 1;
      if (true) {
        let x = 2;
        print(x);
      } else {}
      print(x);
    `)
    );
    expect(spy).toHaveBeenNthCalledWith(1, 2);
    expect(spy).toHaveBeenNthCalledWith(2, 1);
    spy.mockRestore();
  });

  it("throws error for incorrect scopes", () => {
    expect(() => {
      interpProgram(
        parseProgram(
          `      
        let x = 10;
        if (x === 10) {
          let a = 5;
        } else {}
        print(a);
      `
        )
      );
    }).toThrow();
  });

  it("does not double evaluate ===", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    interpProgram(
      parseProgram(`
      let count = 0;
      count = count + 1;
      let a = count;
      count = count + 1;
      let b = count;
      print(a === b);
    `)
    );
    expect(spy).toHaveBeenCalledWith(false); // 1 === 2
    spy.mockRestore();
  });

  it("can print boolean results", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    interpProgram(parseProgram("print(true); print(false);"));
    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenNthCalledWith(2, false);
    spy.mockRestore();
  });

  it("executes else branch correctly", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => null);
    interpProgram(
      parseProgram(`
      if (false) { print(1); } else { print(2); }
    `)
    );
    expect(spy).toHaveBeenCalledWith(2);
    spy.mockRestore();
  });
});
