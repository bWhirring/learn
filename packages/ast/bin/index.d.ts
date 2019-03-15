interface Token {
    type: string;
    value?: string;
}
interface Inode extends Token {
    name?: string;
    params?: Array<{}>;
}
declare class AST {
    private WHITESPACE;
    private NUMBERS;
    private LETTERS;
    tokenizer(input: string): Token[];
    parse(tokens: Token[]): {
        type: string;
        body: any[];
    };
}
declare const ast: AST;
declare const tokenzier: Token[];
declare const test: {
    type: string;
    body: any[];
};
