# tslint-playground

This is a repo where I play around with TSLint custom rules. The rules are in the `tslint` directory. Here's the list so far:

- `deMorgansRule.ts` uses the TypeScript AST to "optimize" files by removing unnecessary exclamation marks through [DeMorgan's Law](https://en.wikipedia.org/wiki/De_Morgan%27s_laws). Please don't use it for real, it was for learning.

## Useful resources

- Custom rules docs: https://palantir.github.io/tslint/develop/custom-rules/
- Explore the AST: https://astexplorer.net
- All the AST hooks: https://github.com/palantir/tslint/blob/master/src/language/walker/syntaxWalker.ts
- Using the TypeScript compiler API: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- TSLint [core rules](https://palantir.github.io/tslint/rules/) and [accompanying source code](https://github.com/palantir/tslint/tree/master/src/rules)

## How do I work on this?

```sh
git clone https://github.com/ashfurrow/tslint-playground.git
cd tslint-playground
yarn install
```

Okay so `src/index.ts` has offenses in it, you can fix them with the rules using `yarn lint --fix src/index.ts` (prefix that with a `git checkout src/index.ts` for a fast reset-debug cycle).
