import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

const INTEGER_FORMATER = Intl.NumberFormat("en-us",{maximumFractionDigits:0});

function fomatOperant(operant){
  if(operant==null) return;
  const [integer,decimal] = operant.split('.');
  if(decimal==null) return INTEGER_FORMATER.format(integer);

  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;

}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand ==null) {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    //    break;
    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null || state.previousOperand === "") {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null || state.currentOperand === "") {
        return {
          ...state,
          operation: payload.operation,
          // previousOperand: state.currentOperand,
          //currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      };
    case ACTION.CLEAR:
      return {};
    //break;
    case ACTION.DELETE_DIGIT:
      
      if (state.overwrite) {
        return { 
          ...state,
          overwrite: false,
          currentOperand: null};
      }

      if(state.currentOperand == null) {return state};
      if(state.currentOperand.length === 1) {
        return {...state,currentOperand:null};
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(
         0,
          - 1
        ),
      };
   
    case ACTION.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };
    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  //const operation = operation;
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      if (current === 0) {
        computation = 0;
      } else {
        computation = prev / current;
      }

      break;
    default:
      break;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    { currentOperand: null, previousOperand: null }
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {fomatOperant(previousOperand)} {operation}
        </div>
        <div className="current-operand">{fomatOperant(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
export default App;
