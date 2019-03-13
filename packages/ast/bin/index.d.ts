interface Token {
    type: string;
    value: string;
}
declare class AST {
    private WHITESPACE;
    private NUMBERS;
    private LETTERS;
    tokenizer(input: string): Token[];
}
declare const ast: AST;
declare const tokenzier: Token[];
