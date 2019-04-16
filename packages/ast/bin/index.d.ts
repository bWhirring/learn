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
declare class AST {
    private WHITESPACE;
    private NUMBERS;
    private LETTERS;
    private OPERATOR;
    tokenizer(input: string): Token[];
    parse(tokens: Token[]): {
        type: string;
        body: any[];
    };
    traverser(ast: Inode[]): {
        type: string;
        body: any[];
    };
    transform(ast: Iast): {
        type: string;
        body: any[];
    };
    generator(ast: any): string;
}
declare const ast: AST;
declare const tokenzier: Token[];
declare const token: {
    type: string;
    body: any[];
};
declare const newAst: {
    type: string;
    body: any[];
};
declare const init: string;
