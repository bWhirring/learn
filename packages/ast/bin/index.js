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
                tokens.push({ type: "name", value: value });
                continue;
            }
            else {
                current++;
            }
        }
        return tokens;
    };
    return AST;
}());
var ast = new AST();
var tokenzier = ast.tokenizer("function add(a,b) {\n  return a + b\n}");
console.log(tokenzier);
//# sourceMappingURL=index.js.map