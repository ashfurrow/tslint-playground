# tslint-playground

This is a repo where I play around with TSLint custom rules. The rules are in the `tslint` directory.

## How do I work on this?

```sh
git clone https://github.com/ashfurrow/tslint-playground.git
cd tslint-playground
yarn install
```

Okay so `src/index.ts` has offenses in it, you can fix them with the rules using `yarn lint --fix src/index.ts` (prefix that with a `git checkout src/index.ts` for a fast reset-debug cycle).
