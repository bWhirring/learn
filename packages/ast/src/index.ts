interface Token {
  type: string;
  value?: string;
}

interface Inode extends Token {
  name?: string;
  params?: Array<{}>;
  body?: {};
}

interface Iast {
  body: Inode[];
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
      if (char === "{") {
        tokens.push({
          type: "brack",
          value: "{"
        });
        current++;
        continue;
      } else if (char === "}") {
        tokens.push({
          type: "brack",
          value: "}"
        });
        current++;
        continue;
      } else if (char === "(") {
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
        tokens.push({ type: "identifier", value });

        continue;
      } else {
        current++;
      }
    }
    return tokens;
  }

  parse(tokens: Token[]) {
    let current = 0;
    let ast = {
      type: "Program",
      body: []
    };

    function nextToken() {
      let token = tokens[current] || { type: "eof" };
      let node: Inode;

      if (token.type === "number") {
        current++;
        return {
          type: "NumberIdentifier",
          value: token.value
        };
      }

      if (token.type === "identifier") {
        switch (token.value) {
          case "function":
            node = {
              type: "FunctionStatement",
              value: token.value
            };
            break;
          case "if":
            node = {
              type: "IfStatement",
              value: token.value
            };
            break;
          case "return":
            node = {
              type: "ReturnStatement",
              value: token.value
            };
            break;
          default:
            node = {
              type: "Identifier",
              value: token.value
            };
            break;
        }
      }

      if (token.type === "brack") {
        node = {
          type: "BlockStatement",
          value: token.value
        };
      }

      if (token.type === "parent" && token.value === "(") {
        ast.body.pop();
        token = tokens[current - 1];
        node = {
          type: "CallExpression",
          name: token.value,
          params: [],
          body: {
            type: "BlockStatement",
            body: []
          }
        };
        token = tokens[++current];
        while (
          token.type !== "parent" ||
          (token.type === "parent" && token.value !== ")")
        ) {
          node.params.push(nextToken());
          token = tokens[current];
        }
      }

      current++;
      return node;
    }

    while (current < tokens.length) {
      ast.body.push(nextToken());
    }

    return ast;
  }

  traverser(ast: Inode[]) {
    let i = 0;
    let curAst = ast[i] || { type: "eof" };

    function nextStatement() {
      if (curAst.type === "FunctionStatement") {
        const statement = {
          type: "FunctionStatement",
          body: []
        };
        curAst = ast[++i];
        statement.body.push(nextStatement());
        return statement;
      }
      if (curAst.type === "CallExpression") {
        const express = {
          type: "CallExpression",
          name: curAst.name,
          argument: curAst.params,
          body: []
        };
        curAst = ast[++i];
        express.body.push(nextStatement());
        return express;
      }
      if (curAst.type === "BlockStatement" && curAst.value === "{") {
        const block = {
          type: "ReturnStatement",
          body: []
        };
        while (i < ast.length) {
          curAst = ast[++i];
          if (curAst.type === "BlockStatement" && curAst.value === "}") {
            ++i;
            break;
          }
          const statement = nextStatement();
          if (statement) {
            block.body.push(nextStatement());
          }
        }
        return block;
      }

      if (curAst.type === "ReturnStatement") {
        return;
      }

      if (curAst.type === "Identifier") {
        return {
          type: "Identifier",
          value: curAst.value
        };
      }

      if (curAst.type === "NumberIdentifier") {
        return {
          type: "NumberIdentifier",
          value: curAst.value
        };
      }
    }

    const newAst = {
      type: "Program",
      body: []
    };

    // 逐条解析顶层语句
    while (i < ast.length) {
      const statement = nextStatement();
      if (!statement) {
        break;
      }
      newAst.body.push(statement);
    }
    return newAst;
  }

  transform(ast: Iast) {
    return this.traverser(ast.body);
  }
}

const ast = new AST();
const tokenzier = ast.tokenizer(`function add(a,b) {
  return a + b + 1
}`);

const test = ast.parse(tokenzier);
const newAst = ast.transform(test);
