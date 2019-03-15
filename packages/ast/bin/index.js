var AST = /** @class */ (function () {
    function AST() {
        this.WHITESPACE = /s/;
        this.NUMBERS = /[0-9]/;
        this.LETTERS = /[a-z\$\_]/i;
    }
    AST.prototype.tokenizer = function (input) {
        var _a = this, WHITESPACE = _a.WHITESPACE, NUMBERS = _a.NUMBERS, LETTERS = _a.LETTERS;
        var current = 0; //  code position
        var tokens = []; // 存放token地方
        while (current < input.length) {
            var char = input[current]; // 当前code
            if (char === "(") {
                tokens.push({
                    type: "parent",
                    value: "("
                });
                current++;
                continue;
            }
            else if (char === ")") {
                tokens.push({
                    type: "parent",
                    value: ")"
                });
                current++;
                continue;
            }
            else if (WHITESPACE.test(char)) {
                current++;
                continue;
            }
            else if (NUMBERS.test(char)) {
                var value = "";
                while (NUMBERS.test(char)) {
                    value += char;
                    char = input[++current];
                }
                tokens.push({ type: "number", value: value });
                continue;
            }
            else if (char === '"') {
                var value = "";
                char = input[++current];
                while (char !== '"') {
                    value += char;
                    char = input[++current];
                }
                char = input[++current];
                tokens.push({ type: "string", value: value });
                continue;
            }
            else if (LETTERS.test(char)) {
                var value = "";
                while (char && LETTERS.test(char)) {
                    value += char;
                    char = input[++current];
                }
                tokens.push({ type: "identifier", value: value });
                continue;
            }
            else {
                current++;
            }
        }
        return tokens;
    };
    AST.prototype.parse = function (tokens) {
        var current = 0;
        var ast = {
            type: "Program",
            body: []
        };
        function nextToken() {
            var token = tokens[current];
            var node;
            if (token.type === "number") {
                node = {
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
            if (token.type === "parent" && token.value === "(") {
                ast.body.pop();
                token = tokens[current - 1];
                node = {
                    type: "CallExpression",
                    name: token.value,
                    params: []
                };
                token = tokens[++current];
                while ((token.type !== 'parent') ||
                    (token.type === 'parent' && token.value !== ')')) {
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
    };
    return AST;
}());
var ast = new AST();
var tokenzier = ast.tokenizer("function add(a,b) {\n  return a + b + 1\n}");
console.log(tokenzier);
var test = ast.parse(tokenzier);
console.log(test);
//# sourceMappingURL=index.js.map