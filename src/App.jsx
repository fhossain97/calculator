import { useState } from "react";
import "./App.css";
import Container from "./components/Container/Container";
import Screen from "./components/Screen/Screen";
import Buttonwrapper from "./components/Buttonwrapper/Buttonwrapper";
import Buttons from "./components/Buttons/Buttons";

//this is the setup for the buttons on the calculator
const buttonVal = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

//implement value formatting - takes number and formats it into string and creates a space seperator for the thousand mark

const valFormat = (num) =>
  //String object represents and manipulates sequence of characters
  //replace it with the regex code
  //(?<!\..*) = ?<!\ABC specified a group that cant match before the main expression, .. matches any character before line break, * is the match to the proceeding token
  //(/d) = digit
  //(?=(?:\d{3}) = lookaround for a digit that matches 3
  //(?:\.|$) = | acts as a boolean or matches the expression before or after the line, $ matches end of string
  //g = global search
  //$1 -  inserts the results of the specified capture group
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

//reverse of above and takes string of numbers and removes the spaces
const removeSpaces = (num) =>
  //convert num to a string and replace with regex
  //\s is whitespace and then global search
  num?.toString().replace(/\s/g, "");

const math = (a, b, sign) =>
  //if sign is this then do this
  sign === "+"
    ? a + b
    : //else if sign is this then do this
    sign === "-"
    ? a - b
    : //else if sign is this then do that or do division
    sign === "X"
    ? a * b
    : a / b;

function App() {
  //setting all the states and intializing them here
  const [calculator, setCalculator] = useState({
    sign: "", //sign that you use to do an operation
    num: 0, //entered value
    val: 0, //calculated value
  });

  //numClickHandler - deals with the numbers from 1-9
  const numClickHandler = (e) => {
    //first prevent the usual action from occuring
    e.preventDefault();
    //we will update the screen with whatever we click
    const value = e.target.innerHTML;

    //our conditions for the numbers clicked
    // no whole numbers start with zero
    // there are no multiple zeros before the comma
    // the format will be “0.” if “.” is pressed first
    // numbers are entered up to 16 integers long

    if (removeSpaces(calculator.num).length < 16) {
      //spread through the current state and have it updated to a diff state and re-rendered
      setCalculator({
        ...calculator,
        //create a conditional chain which mimics if else, else if, .... else statements
        num:
          //if num and value are both 0, then show 0 on the screen
          calculator.num === 0 && value === "0"
            ? "0"
            : //else if num divided by one is zero then show the number entered plus the value on the screen and if number not entered and converted to string and includes decimal
            removeSpaces(calculator.num) % 1 === 0 &&
              !calculator.num.toString().includes(".")
            ? valFormat(Number(removeSpaces(calculator.num + value))) //the Number constructor isn't really used now but it would make 123.0 the same as 123
            : //else (if neither two above statements are true) - show the number entered and the value on the screen
              valFormat(calculator.num + value),
        //for the calculated number - if there is no sign, then show 0 else show the calculated response
        val: !calculator.sign ? 0 : calculator.val,
      });
    }
  };

  //decimal handler - what to do when you click the decimal?
  const decimalHandler = () => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setCalculator({
      ...calculator,
      //if it is not an entered number and includes '.', then print the number onto the screen or else just have a number
      num: !calculator.num.toString().includes(".")
        ? calculator.num + value
        : calculator.num,
    });
  };

  //how to handle the operation signs (minus the equal sign) when they are clicked
  const signClicked = (e) => {
    const value = e.target.innerHTML;
    setCalculator({
      ...calculator,
      //sign is updated on the screen
      sign: value,
      //if not the calculated value or the number entered, then itll be a number otherwise it will be the calculated value
      val: !calculator.num
        ? calculator.val
        : !calculator.val
        ? calculator.num
        : valFormat(
            math(
              Number(removeSpaces(calculator.val)),
              Number(removeSpaces(calculator.num)),
              calculator.sign
            )
          ),
      //there isn't a number being used if a sign is pressed
      num: 0,
    });
  };

  //how to handle the equal sign
  // things to note for the equal sign:
  // -there’s no effect on repeated calls
  // -users can’t divide with 0

  const equalSign = (e) => {
    if (calculator.sign && calculator.num) {
      setCalculator({
        ...calculator,

        //if number clicked is 0 and the sign is division then print that you cant divide by 0, but if false, then execute the operations above
        val:
          calculator.num === "0" && calculator.sign === "/"
            ? "No division with 0"
            : valFormat(
                math(
                  Number(removeSpaces(calculator.val)),
                  Number(removeSpaces(calculator.num)),

                  calculator.sign
                )
              ),
        //the sign is dependent upon what you press
        sign: "",
        //no number is being clicked
        num: 0,
      });
    }
  };

  //how to handle negative numbers
  const negativeNum = () => {
    setCalculator({
      ...calculator,
      num: calculator.num ? valFormat(removeSpaces(calculator.num)) * -1 : 0,
      val: calculator.val ? valFormat(removeSpaces(calculator.val)) * -1 : 0,
      sign: "",
    });
  };

  //how to handle percent
  const percentClick = () => {
    //parseFloat takes a string and returns the number in the string
    let num = calculator.num ? parseFloat(removeSpaces(calculator.num)) : 0;
    let val = calculator.val ? parseFloat(removeSpaces(calculator.val)) : 0;

    setCalculator({
      ...calculator,
      //math.pow takes two arguments (a,b) and does a to the power of b
      num: (num /= Math.pow(100, 1)),
      val: (val /= Math.pow(100, 1)),
      sign: "",
    });
  };

  //reset everything - go back to the useState where you intialized everything
  const resetClickHandler = () => {
    setCalculator({ ...calculator, sign: "", num: 0, val: 0 });
  };

  return (
    <Container>
      {/* //so if a number is entered, if true then it will print out that number and if false it will print out the calculated response */}
      <Screen value={calculator.num ? calculator.num : calculator.val} />
      <Buttonwrapper>
        {/* //the flat method creates a new array and basically 'flattens' out the numbers. The map method creates a new array and iterates through the buttonVal */}
        {buttonVal.flat().map((button, i) => {
          return (
            <Buttons
              className={button === "=" ? "equals" : ""}
              key={i}
              value={button}
              onClick={
                // if the value is C then reset
                button === "C"
                  ? resetClickHandler
                  : //else if button  is +-
                  button === "+-"
                  ? negativeNum
                  : //else if button  is percent
                  button === "%"
                  ? percentClick
                  : //else if button  is equal
                  button === "="
                  ? equalSign
                  : //else if button  is divide, multiply, subtract or positive
                  button === "/" ||
                    button === "X" ||
                    button === "-" ||
                    button === "+"
                  ? signClicked
                  : //else if decimal then do the decimal function and if not then do the number function
                  button === "."
                  ? decimalHandler
                  : numClickHandler
              }
            />
          );
        })}
      </Buttonwrapper>
    </Container>
  );
}

export default App;

//project tutorial: https://www.sitepoint.com/react-tutorial-build-calculator-app/
