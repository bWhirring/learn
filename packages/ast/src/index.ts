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
  private OPERATOR: string = "+-*/=";

  tokenizer(input: string) {
    const { WHITESPACE, NUMBERS, LETTERS, OPERATOR } = this;

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
      } else if (OPERATOR.includes(char)) {
        current++;
        tokens.push({
          type: "operator",
          value: char
        });
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
      if (token.type === "string") {
        current++;
        return {
          type: "StringIdentifier",
          value: token.value
        };
      }
      if (token.type === "operator") {
        current++;
        return {
          type: "Operator",
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
      curAst = ast[i++];
      if (curAst.type === "FunctionStatement") {
        const statement = {
          type: "FunctionStatement",
          body: []
        };
        curAst = ast[i + 1];
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

        express.body.push(nextStatement());
        return express;
      }
      if (curAst.type === "BlockStatement" && curAst.value === "{") {
        const block = {
          type: "ReturnStatement",
          body: []
        };
        while (i < ast.length) {
          curAst = ast[i + 1];
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

      if (curAst.type === "StringIdentifier") {
        return {
          type: "StringIdentifier",
          value: curAst.value
        };
      }

      if (curAst.type === "NumberIdentifier") {
        return {
          type: "NumberIdentifier",
          value: curAst.value
        };
      }

      if (curAst.type === "Operator") {
        return {
          type: "Operator",
          value: curAst.value
        };
      }
      curAst = ast[++i];
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

  generator(ast) {
    let code = "";
    function generatorCode(node) {
      switch (node.type) {
        case "Program":
          code = "";
          node.body.map(generatorCode);
          break;
        case "FunctionStatement":
          code += "function ";
          node.body.map(generatorCode);
          break;
        case "CallExpression":
          code += node.name;
          const params = [];
          node.argument.map(v => params.push(v.value));
          code += `(${params.join(", ")})`;
          node.body.map(generatorCode);
          // this.generator(ast);
          code += " \n }";
          break;
        case "ReturnStatement":
          code += "{ \n return ";
          node.body.map(generatorCode);
        case "Identifier":
        case "NumberIdentifier":
        case "StringIdentifier":
          code += ` ${node.value || ""}`;
          break;
        case "Operator":
          code += ` ${node.value} `;
      }
    }

    generatorCode(ast);
    return code;
  }
}

const ast = new AST();
const tokenzier = ast.tokenizer(`function add(a,b) {
  return a + b + 1
}`);

// const tokenzier = ast.tokenizer(`const a = "huhu"`);
const token = ast.parse(tokenzier);

const newAst = ast.transform(token);

const init = ast.generator(newAst);
console.log(init);
