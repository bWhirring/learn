var AST = /** @class */ (function () {
    function AST() {
        this.WHITESPACE = /s/;
        this.NUMBERS = /[0-9]/;
        this.LETTERS = /[a-z\$\_]/i;
        this.OPERATOR = "+-*/=";
    }
    AST.prototype.tokenizer = function (input) {
        var _a = this, WHITESPACE = _a.WHITESPACE, NUMBERS = _a.NUMBERS, LETTERS = _a.LETTERS, OPERATOR = _a.OPERATOR;
        var current = 0; //  code position
        var tokens = []; // 存放token地方
        while (current < input.length) {
            var char = input[current]; // 当前code
            if (char === "{") {
                tokens.push({
                    type: "brack",
                    value: "{"
                });
                current++;
                continue;
            }
            else if (char === "}") {
                tokens.push({
                    type: "brack",
                    value: "}"
                });
                current++;
                continue;
            }
            else if (char === "(") {
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
            else if (OPERATOR.includes(char)) {
                current++;
                tokens.push({
                    type: "operator",
                    value: char
                });
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
            var token = tokens[current] || { type: "eof" };
            var node;
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
                while (token.type !== "parent" ||
                    (token.type === "parent" && token.value !== ")")) {
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
    AST.prototype.traverser = function (ast) {
        var i = 0;
        var curAst = ast[i] || { type: "eof" };
        function nextStatement() {
            curAst = ast[i++];
            if (curAst.type === "FunctionStatement") {
                var statement = {
                    type: "FunctionStatement",
                    body: []
                };
                curAst = ast[i + 1];
                statement.body.push(nextStatement());
                return statement;
            }
            if (curAst.type === "CallExpression") {
                var express = {
                    type: "CallExpression",
                    name: curAst.name,
                    argument: curAst.params,
                    body: []
                };
                express.body.push(nextStatement());
                return express;
            }
            if (curAst.type === "BlockStatement" && curAst.value === "{") {
                var block = {
                    type: "ReturnStatement",
                    body: []
                };
                while (i < ast.length) {
                    curAst = ast[i + 1];
                    if (curAst.type === "BlockStatement" && curAst.value === "}") {
                        ++i;
                        break;
                    }
                    var statement = nextStatement();
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
        var newAst = {
            type: "Program",
            body: []
        };
        // 逐条解析顶层语句
        while (i < ast.length) {
            var statement = nextStatement();
            if (!statement) {
                break;
            }
            newAst.body.push(statement);
        }
        return newAst;
    };
    AST.prototype.transform = function (ast) {
        return this.traverser(ast.body);
    };
    AST.prototype.generator = function (ast) {
        var code = "";
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
                    var params_1 = [];
                    node.argument.map(function (v) { return params_1.push(v.value); });
                    code += "(" + params_1.join(", ") + ")";
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
                    code += " " + (node.value || "");
                    break;
                case "Operator":
                    code += " " + node.value + " ";
            }
        }
        generatorCode(ast);
        return code;
    };
    return AST;
}());
var ast = new AST();
var tokenzier = ast.tokenizer("function add(a,b) {\n  return a + b + 1\n}");
// const tokenzier = ast.tokenizer(`const a = "huhu"`);
var token = ast.parse(tokenzier);
var newAst = ast.transform(token);
var init = ast.generator(newAst);
console.log(init);
//# sourceMappingURL=index.js.map