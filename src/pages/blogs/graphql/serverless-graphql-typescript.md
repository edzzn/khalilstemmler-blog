---
templateKey: blog-post
title: "Deploying Serverless GraphQL APIs with TypeScript on Netlify"
date: '2020-02-23T10:04:10-05:00'
updated: '2020-02-231T10:04:10-05:00'
description: >-
  It's quite trivial to get a Serverless GraphQL API up and running in 2020.
tags:
  - GraphQL
  - TypeScript
  - Serverless
category: GraphQL
image: /img/blog/graphql/graphql-banner.png
published: true
displayInArticles: false
---

Deploying a Serverless GraphQL API with TypeScript is essentially the same as deploying one with JavaScript.

The only difference is the slight diffrence in build steps.

For example, using vanilla JavaScript on Netlify, the build step in our `package.json` is usually to **copy all of the vanilla JavaScript code in our `src` folder** over to the `functions` folder.

<div class="filename">package.json</div>

```json{4}
{
  "scripts": {
    "start": "nodemon",
    "bundle": "cpx src/**/* functions/bundle"
  }
}
```

While building with TypeScript is effectively the same, just through different means. In a TypeScript environment, we configure a `tsconfig.json` and run `tsc` as the build step.

<div class="filename">package.json</div>

```json{9}
{
  "compilerOptions": {
    "allowJs": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "pretty": true,
    "sourceMap": true,
    "target": "es2017",
    "outDir": "./functions/bundle",
    "lib": ["es6"],
    "resolveJsonModule": true,
    "types": ["node"],
    "typeRoots" : ["./node_modules/@types", "./src/@types"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  },
  "include": [
    "src/*.ts",
    "src/**/*.ts",
    "src/**/*.js"
  ],
  "exclude": [
    "node_modules",
    "src/**/*.spec.ts",
    "src/**/*.spec.js"
  ]
}
```

<div class="filename">package.json</div>

```json{4}
{
  "scripts": {
    "start": "nodemon",
    "bundle": "tsc"
  }
}
```

Either way, the result is the same since Netlify needs all of the source code used in the `functions` direction to be bundled before it's deployed.

## Resources

Check out these starters for deploying your own Serverless GraphQL APIs on Netlify with TypeScript or vanilla JavaScript.

### Starters

- [Serverless GraphQL on Netlify API Starter Project](https://github.com/stemmlerjs/serverless-graphql-netlify-starter)
- [Serverless GraphQL on Netlify API using TypeScript Starter Project](https://github.com/stemmlerjs/serverless-graphql-netlify-starter)

### Tutorial

If you're interested in how the starters were built, read "[How to Deploy a Serverless GraphQL API on Netlify [Starters]](/articles/tutorials/deploying-a-serverless-graphql-api-on-netlify/)".


