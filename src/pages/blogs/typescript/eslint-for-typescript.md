---
templateKey: blog-post
title: "How to use ESLint with TypeScript"
date: '2020-02-26T10:04:10-05:00'
updated: '2020-02-261T10:04:10-05:00'
description: >-
  ESLint is a JavaScript linter that you can use to lint either TypeScript or JavaScript code. In this post, we'll walk through how to set up linting in your project.
tags:
  - Formatting
  - ESLint
category: TypeScript
published: true
image: /img/blog/templates/banners/typescript-blog-banner.png
displayInArticles: false
---

## Intro

**Formatting** is one of several concerns in the efforts to write _clean code_. There's a lot of other stuff we should be concerned about as well, but formatting is one of those things that we can set up right off the bat and establish a standard for our project.

### ESLint and TSLint

[ESLint](https://eslint.org/) is a JavaScript _linter_ that enables you to enforce a set of style, formatting, and coding standards for your codebase. It looks at your code, and tells you when you're not following the standard that you set in place.

You may have also heard of [TSLint](https://palantir.github.io/tslint/), the TypeScript equivalent. In 2019, the team behind TSLint [decided that they would no longer support it](https://medium.com/palantir/tslint-in-2019-1a144c2317a9a). The reason, primarily, is because _ESLint exists_, and there was a lot of duplicate code between projects with the same intended purpose.

That being said, there are some really awesome TSLint packages out there that, if you would like to use, you can- but just understand that they're not being supported anymore.

So onwards into 2020 and beyond, we're going to continue to look to ESLint for all of our TypeScript (and JavaScript) linting needs!

<!-- ### Prettier

[Prettier](https://prettier.io/) is another tool that goes a step further and actually _formats your code_ on the spot. Combined with ESLint, it can be pretty powerful. If Prettier knows how to fix your code, it will do that _on save_ (if you configure it to do so). -->

## Prerequisites

Here's what you need to have in order to follow along:

- A code editor installed (psst- VS Code is ideal)
- An existing codebase (if you need to get setup, you can follow "[How to Setup a TypeScript + Node.js Project](/blogs/typescript/node-starter-project/) first and then come back to this article)

## Installation and setup

Run the following commands to setup ESLint in your TypeScript project.

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create an `.eslintrc` file.

```bash
touch .eslintrc
```

In it, use the following starter config.

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

### Ignoring files we don't want to lint

Create an `.eslintignore` in order to prevent ESLint from linting stuff we don't want it to.

```bash
touch .eslintignore
```

Then add the things we want to ignore. In the following code sample, we're ignoring the `dist/` folder that contains the compiled TypeScript code. If you're compiling your TypeScript code to a different folder, make sure to use that instead of `dist`. You should be able to find this in your `.tsconfig` (see the [previous guide](/blogs/typescript/node-starter-project/)).

```text
node_modules
dist
```

### Adding a lint script

In your project `package.json`, lets add a `lint` script in order to lint all TypeScript code.

```json
{
  "scripts": {
    ...
    "lint": "eslint . --ext .ts",
  }
}
```

Ready to try it out? Let's run the following command.

```bash
npm run lint
```

For _me_, since I'm continuing with the [previous tutorial](/blogs/typescript/node-starter-project/), and since my `src` folder only has a single `index.ts` in it that prints out some text with `console.log()`, I don't see anything after I run the command.

<div class="filename">src/index.ts</div>

```typescript
console.log('Hello world!')
```

What if we wanted to _disallow_ `console.log` statements in our code? 

## Rules

There are three modes for a rule in eslint: `off`, `warn`, and `error`.

- "off" means 0 (turns the rule off completely)
- "warn" means 1 (turns the rule on but won't make the linter fail)
- "error" means 2 (turns the rule on and will make the linter fail)

### Adding a rule

In `.eslintrc`, add a new attribute to the json object called "rules".

```json{12}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": { }
}
```

Rules get added as keys of this `rules` attribute, and you can normally find the `eslint` base rules [here on their website via the Rules docs](https://eslint.org/docs/rules/).

We want to add the [no-console](https://eslint.org/docs/rules/no-console) rule, so here is an example of how we can make the linter fail (throw a mean error code) if it encounters a `console.log` statement with the `no-console` rule set to `error`.

We update the `.eslintrc`

```json{13}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": { 
    "no-console": 2 // Remember, this means error!
  }
}
```

And then run the linter again.

```bash
npm run lint
```

And we should get an angry linting result.

```bash
/simple-typescript-starter/src/index.ts

  2:1  error  Unexpected console statement  no-console
    ✖ 1 problem (1 error, 0 warnings)
```

And if we wanted, we could turn the rule off by setting it to `0 - off`.

```json{12}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": { 
    "no-console": 0 
  }
}
```

Run the linter.

```bash
npm run lint
```

...and silence.

### Using rules in a real-life project

There's a reason that all three of these modes exist. When you set the linter to `off` for a rule, it's because you and your team probably don't care about _that rule_ in a particular **base configuration** you're using (we're currently using the ESLint recommended config but you can also go and use [Shopify's](https://github.com/Shopify/eslint-plugin-shopify), [Facebook's](https://www.npmjs.com/package/eslint-config-fbjs) or several other companies' configs as starting points instead).

When you set the rule to `error - 2`, it means that you don't want the code that breaks your coding conventions to even make it the repo at all. I think this is a great act of professionalism and empathy towards the codebase, your fellow teammates, and future maintainers. A popular approach to **actually enforce** code conventions with this tool is to set up your project with a tool like [Husky](https://github.com/typicode/husky) so that when a teammate tries to **commit** code or **push** code, you can tell your linter to check the code first before the operation executes. It's a great habit, though sometimes, if the rules are overly restrictive, it can slow down and annoy your teammates.

To remedy overly restrictive rules, the `warn - 1` setting means that yes, you want you and your team to adhere to that rule, but you don't want it to prevent you from moving forward.

## Adding a plugin (features)

ESLint also allows you to add one-off features to your config. These are known as _plugins_. 

Here's a fun one. It's called [no-loops](https://github.com/buildo/eslint-plugin-no-loops).

<p class="special-quote">Check out this list of other <a href="https://github.com/dustinspecker/awesome-eslint">awesome-eslint</a> plugins and configs.</p>

**no-loops** is a plugin that will enable you to enforce a convention specifying that `for` and `while` loops are illegal and that you should use functions like `map` and `forEach` instead.

Install it like this.

```bash
npm install --save-dev eslint-plugin-no-loops
```

And then update your `.eslintrc` with `no-loops` in the "plugins" array, and add the rule to the "rules" attribute like so.

```json{6,15}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "no-loops"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": 1,
    "no-loops/no-loops": 2
  }
}
```

Now if we update our code to include a `for` loop...

<div class="filename">src/index.ts</div>

```typescript
console.log('Hello world!');

for (let i = 0; i < 10; i++) {
  console.log(i)
}

```

And run the lint command again...

```bash
npm run lint
```

We'll see the errors that restricts loops appear.

```bash{4}
/simple-typescript-starter/src/index.ts
  2:1   warning  Unexpected console statement                   no-console
  2:1   error    'console' is not defined                       no-undef
  4:1   error    loops are not allowed                          no-loops/no-loops
  5:3   warning  Unexpected console statement                   no-console
  5:3   error    'console' is not defined                       no-undef
  5:17  error    Missing semicolon                              babel/semi
  5:17  error    Missing semicolon                              semi
  6:2   error    Newline required at end of file but not found  eol-last

✖ 8 problems (6 errors, 2 warnings)
  3 errors and 0 warnings potentially fixable with the `--fix` option.
```

## Extending a different base config

Let's say that you wanted to start with a different base config- [Shopify's](https://github.com/Shopify/eslint-plugin-shopify), for example.

Here's how to do that. 

Looking at the [readme](https://github.com/Shopify/eslint-plugin-shopify), we need to install it by running:

```bash
npm install eslint-plugin-shopify --save-dev
```

Update our `.eslintrc`

```json{8}
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "plugin:shopify/esnext"
  ],
  "rules": {
    "no-console": 1
  }
}
```

<p class="special-quote">You can add several base configs to your project by including them in the array, though you may end up seeeing the same linting rules twice or more.</p>

Now when we run the lint command again with `npm run lint`, we can see a few errors reported based on the base Shopify config and our `no-console` rule.

```bash
/simple-typescript-starter/src/index.ts
  2:1   warning  Unexpected console statement  no-console
  2:1   error    'console' is not defined      no-undef
  2:28  error    Missing semicolon             babel/semi
  2:28  error    Missing semicolon             semi

✖ 4 problems (3 errors, 1 warning)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

### Fixing linted code with ESLint

You might have noticed that at the end of the error message, it says "2 errors and 0 warnings potentially fixable with the `--fix` option."

You _can_ run ESLint and tell it to fix things that it's able to fix a the same time.

Using the `--fix` option, let's add a new script to our `package.json` called `lint-and-fix`.

```json{5}
{
  "scripts": {
    ...
    "lint": "eslint . --ext .ts",
    "lint-and-fix": "eslint . --ext .ts --fix"
  },
}
```

Running this command against our code, I expect that it will put a semicolon on the `console.log` statement that we had.

Let's run it.

```bash
npm run lint-and-fix
```

The result is that _less_ errors are reported. We don't see the error about semi-colons anymore.

```bash
/simple-typescript-starter/src/index.ts
  2:1  warning  Unexpected console statement  no-console
  2:1  error    'console' is not defined      no-undef
```

Because sure enough, the linter added the semi-colon.

<div class="filename">src/index.ts</div>

```typescript{1}
console.log('Hello world!');

```

That's really awesome. But what if we don't want to run the linter all the time to fix our code? What if there was a way that we could, while coding, have it _automatically_ format things based on our conventions?

We can! With [Prettier](https://prettier.io/). More on that later.

<!-- ## Installing Prettier

Prettier

```bash
npm install prettier eslint-config-prettier eslint-plugin-prettier --save-dev
```

Then create a `.prettierrc.js` file.

```bash
touch .prettierrc.js
```

Here's a sample `prettier.js` config.

```javascript
module.exports =  {
  semi:  true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 4,
};
``` -->


