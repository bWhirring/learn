interface Token {
  type: string;
  value: string;
}

class AST {
  private WHITESPACE: RegExp = /s/;
  private NUMBERS: RegExp = /[0-9]/;
  private LETTERS: RegExp = /[a-z\$\_]/i;

  tokenizer(input: string) {
    const { WHITESPACE, NUMBERS, LETTERS } = this;

    let current = 0; //  code position

    let tokens: Token[] = []; // 存放token地方

    while (current < input.length) {
      let char = input[current]; // 当前code
      if (char === "(") {
        tokens.push({
          type: "parent",
          value: "("
        });
        current++;

        continue;
      } else if (char === ")") {
        tokens.push({
          type: "parent",
          value: ")"
        });
        current++;

        continue;
      } else if (WHITESPACE.test(char)) {
        current++;
        continue;
      } else if (NUMBERS.test(char)) {
        let value = "";
        while (NUMBERS.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push({ type: "number", value });

        continue;
      } else if (char === '"') {
        let value = "";

        char = input[++current];

        while (char !== '"') {
          value += char;
          char = input[++current];
        }

        char = input[++current];
        tokens.push({ type: "string", value });

        continue;
      } else if (LETTERS.test(char)) {
        let value = "";
        while (char && LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }
        tokens.push({ type: "name", value });

        continue;
      } else {
        current++;
      }
    }
    return tokens;
  }

}

const ast = new AST();
const tokenzier = ast.tokenizer(`function add(a,b) {
  return a + b
}`);
console.log(tokenzier);
