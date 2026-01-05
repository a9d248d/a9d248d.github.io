function rawTokenise(input) {
  const tokens = [];
  let i = 0;
  const N = input.length;
  while (i < N) {
    const ch = input[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '(' || ch === ')') {
      tokens.push(ch);
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      let str = quote;
      while (j < N) {
        const c = input[j];
        str += c;
        if (c === '\\') {
          j++;
          if (j < N) { str += input[j]; }
        } else if (c === quote) {
          j++;
          break;
        }
        j++;
      }
      tokens.push(str);
      i = j;
      continue;
    }
    let j = i;
    while (j < N && !/\s/.test(input[j]) && input[j] !== '(' && input[j] !== ')' ) {
      j++;
    }
    tokens.push(input.slice(i, j));
    i = j;
  }

  return tokens;
}


function newToken(type, token, id) {
  return { type, token, id };
}

function tokenise(rawInput) {
  input = rawTokenise(rawInput);
  
  const operators = ['+', '-', '*', '/'];
  const booleans = ['true', 'false', 'maybe'];
  const quotes = ['"', '\''];
  const integers = /^[+-]?(?:0|[1-9][0-9]*)$/;
  const floats = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
  const imaginaries = /^(?:[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[+-]?)i$/;
  
  let stringFlag = false;
  let stringQuoteType;
  let parenthesisIndex = 0;

  let tokens = [];

  let parsedToken;

  input.forEach((tk) => {
    if (!quotes.includes(tk) && stringFlag) {
      parsedToken = newToken('inside string', tk);
    }
    else if (tk === '(') {
      parenthesisIndex++;
      parsedToken = newToken('open parentheses', tk, parenthesisIndex);
    }
    else if (tk === ')') {
      parsedToken = newToken('close parentheses', tk, parenthesisIndex);
      parenthesisIndex--;
    }
    else if (operators.includes(tk)) {
      parsedToken = newToken('operator', tk);
    }
    else if (booleans.includes(tk)) {
      parsedToken = newToken('boolean', tk);
    }
    else if (integers.test(tk)) {
      parsedToken = newToken('integer', tk);
    }
    else if (floats.test(tk)) {
      parsedToken = newToken('float', tk);
    }
    else if (imaginaries.test(tk)) {
      parsedToken = newToken('imaginary', tk);
    }
    else if (quotes.includes(tk.charAt(0)) && quotes.includes(tk.charAt(tk.length - 1)) && (tk.charAt(0) === tk.charAt(tk.length - 1))) {
      parsedToken = newToken('string', tk.substring(1, tk.length - 1));
    }
    else {
      parsedToken = newToken('probably a function', tk);
    }

    tokens.push(parsedToken);
  });

  return tokens;
}

const tokeniseButton = document.getElementById('tokenise');
const codeInput = document.getElementById('input');
const codeOutput = document.getElementById('output');

tokeniseButton.addEventListener('click', (e) => {
  const code = codeInput.value;
  const result = tokenise(code);
  console.log(result);
});
