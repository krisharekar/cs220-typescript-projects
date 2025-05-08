import { Expression, Statement } from "../include/parser.js";
import { match } from "ts-pattern";

type RuntimeValue = number | boolean;
export const PARENT_STATE_KEY = Symbol("[[PARENT]]");
export type State = { [PARENT_STATE_KEY]?: State; [key: string]: RuntimeValue };

//helper functions
function checkAllStates(state: State | undefined, name: string): State | undefined {
  if (!state) return undefined;
  return name in state ? state : checkAllStates(state[PARENT_STATE_KEY], name);
}

function runBlockStatements(state: State, stmts: Statement[]) {
  const blockState: State = { [PARENT_STATE_KEY]: state };
  stmts.forEach(s => interpStatement(blockState, s));
}

function evalBinaryOp(state: State, left: Expression, right: Expression, op: (a: number, b: number) => number): number {
  const a = interpExpression(state, left);
  const b = interpExpression(state, right);
  if (typeof a === "number" && typeof b === "number") return op(a, b);
  throw new Error("Uncaught SyntaxError: Arithmetic may only happen between numbers");
}

function evalCompareOp(
  state: State,
  left: Expression,
  right: Expression,
  comparator: (a: number, b: number) => boolean
): boolean {
  const a = interpExpression(state, left);
  const b = interpExpression(state, right);
  if (typeof a === "number" && typeof b === "number") return comparator(a, b);
  throw new Error("Uncaught SyntaxError: Comparison may only happen between numbers");
}

function evalBooleanOp(state: State, op: "&&" | "||", left: Expression, right: Expression): boolean {
  const a = interpExpression(state, left);
  if (typeof a !== "boolean") {
    throw new Error("Uncaught SyntaxError: Logical operations may only happen between boolean");
  }
  if (op === "&&" && !a) return false;
  if (op === "||" && a) return true;

  const b = interpExpression(state, right);
  if (typeof b !== "boolean") {
    throw new Error("Uncaught SyntaxError: Logical operations may only happen between boolean");
  }
  return b;
}

export function interpExpression(state: State, exp: Expression): RuntimeValue {
  // TODO
  return (
    match(exp)
      .with({ kind: "boolean" }, { kind: "number" }, exp => exp.value)
      .with({ kind: "variable" }, exp => {
        const ref = checkAllStates(state, exp.name);
        if (ref !== undefined) return ref[exp.name];
        else throw new Error(`Uncaught ReferenceError: ${exp.name} is not defined`);
      })
      .with({ kind: "operator" }, exp => {
        return match(exp.operator)
          .with("+", () => evalBinaryOp(state, exp.left, exp.right, (a, b) => a + b))
          .with("-", () => evalBinaryOp(state, exp.left, exp.right, (a, b) => a - b))
          .with("*", () => evalBinaryOp(state, exp.left, exp.right, (a, b) => a * b))
          .with("/", () =>
            evalBinaryOp(state, exp.left, exp.right, (a, b) => {
              if (b === 0) throw new Error("Uncaught RuntimeError: Division by zero is forbidden");
              return a / b;
            })
          )
          .with(">", () => evalCompareOp(state, exp.left, exp.right, (a, b) => a > b))
          .with("<", () => evalCompareOp(state, exp.left, exp.right, (a, b) => a < b))
          .with("===", () => interpExpression(state, exp.left) === interpExpression(state, exp.right))
          .with("&&", "||", op => evalBooleanOp(state, op, exp.left, exp.right))
          .exhaustive();
      })
      // .with({ kind: "function" }, () => false)
      // .with({ kind: "call" }, () => false)
      // .exhaustive();
      .otherwise(() => {
        throw new Error("Not yet implemented.");
      })
  );
}

export function interpStatement(state: State, stmt: Statement): void {
  // TODO
  match(stmt)
    .with({ kind: "let" }, stmt => {
      if (stmt.name in state)
        throw new Error(`Uncaught SyntaxError: Identifier '${stmt.name}' has already been declared`);
      state[stmt.name] = interpExpression(state, stmt.expression);
    })
    .with({ kind: "assignment" }, stmt => {
      const ref = checkAllStates(state, stmt.name);
      if (ref === undefined) throw new Error(`Uncaught ReferenceError: ${stmt.name} is not defined`);
      ref[stmt.name] = interpExpression(state, stmt.expression);
    })
    .with({ kind: "if" }, stmt => {
      const test = interpExpression(state, stmt.test);
      test ? runBlockStatements(state, stmt.truePart) : runBlockStatements(state, stmt.falsePart);
    })
    .with({ kind: "while" }, stmt => {
      while (interpExpression(state, stmt.test)) runBlockStatements(state, stmt.body);
    })
    .with({ kind: "print" }, stmt => {
      console.log(interpExpression(state, stmt.expression));
    })
    // .with({ kind: "expression" }, stmt => interpExpression(state, stmt.expression))
    // .with({ kind: "return" }, stmt => stmt)
    // .exhaustive();
    .otherwise(() => {
      throw new Error("Not yet implemented.");
    });
}

export function interpProgram(program: Statement[]): State {
  // TODO
  const globalState: State = {};
  program.forEach(stmt => interpStatement(globalState, stmt));
  return globalState;
}
