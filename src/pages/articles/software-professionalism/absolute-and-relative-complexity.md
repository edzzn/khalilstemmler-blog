---
templateKey: article
title: "Absolute and Relative Complexity"
date: '2020-04-29T10:04:10-05:00'
updated: '2020-04-29T10:04:10-05:00'
description: >-
  Determining if the complexity of a problem is related to the nature of the problem or related to the way that we approach solving it.
tags:
  - Absolute Complexity
  - Relative Complexity
  - Software Design
category: Software Professionalism
image: /img/blog/professionalism/complexity/absolute-and-relative-complexity.png
published: true
---

Ever seen a friend, coworker, or maybe even an absolute stranger- trying to solve a problem using a tool that you feel is _completely unfit_ for the task at hand? 

Maybe you've felt like a problem would be easier solved using a different tool, language, platform, or feature for the job.

It's frustrating. It's frustrating seeing someone introduce undue _challenge_ for themselves when you feel like you know there's a better way.

In discussions about architecture, choosing a tech stack, and solving problems in general, I've started to use the terms "absolute complexity" and "relative complexity" more often. Maybe you will too.

Being able to point out absolute and relative complexity will enable you to:

- Decide [when it's a good idea to use TypeScript over JavaScript](/articles/when-to-use-typescript-guide/)
- Know when to use [Domain-Driven Design](/articles/categories/domain-driven-design/)
- Avoid anti-patterns
- Know when you're tackling a problem using well-known best practices or introducing more challenge for yourself

## Absolute complexity

<p class="special-quote"><b>Absolute complexity</b>: When the complexity of the problem is related to the <i>nature</i> of the problem itself.</p>

Let's face it. Some things in life are just inherently complex.

- Making a [vinyl-trading platform](https://github.com/stemmlerjs/white-label) with lots of very specific domain-knowledge.
- Architecting and constructing a house from scratch.
- Using AI to write catchy pop music.
- Coming up with a cure for cancer.

There's no _easy_ answer to any of these things. Some of them don't even _have_ an answer. 

Often times though, we have a **best practice**. And a best practice acts as a _close enough_ or the best that we can possibly do today. Best practices have considered all of the current options, and decided upon what the best approach is. Best practices are usually agreed upon by a larger community.

Here's an easy one.

The **best practice** for tying your shoes is to use your hands to tie your shoes into a knot. That's probably the easiest and _most realistic_ way to tie our shoes, because well- mini robot butlers aren't really a thing yet. A way to make life _harder_ and introduce **relative complexity** is to force yourself to tie your shoes using only a pair of chopsticks, never touching your shoelaces with your hands.

## Relative complexity

<p class="special-quote"><b>Relative complexity</b>: When the complexity of solving the problem is directly related to <i>the way that we have chosen to solve it</i>, and less related to the nature of the problem itself.</p>

When we take an approach to solving a problem that **introduces more work or complexity for us**, if not immediately, later on down the road, that's relative complexity.

We don't often introduce relative complexity purposefully. In software, sometimes it comes up when we:

- Want to use a brand new programming language or tool to solve a project that it is not well-suited for
- Are forced to use a particular tech stack
- Are unaware of the best practices to solving this particular problem (and in turn, implement an anti-pattern)

## Relative complexity is introduced by failing to use best practices

When I was working on my first startup, I wrote the entire thing in vanilla Node.js. Over time, we started to get more and more business logic complexity added to the app. Eventually, I found myself in a position where it was impossible for me to add new code without breaking old stuff.

It was a huge mess because I had designed it [with CRUD & MVC](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/) (also known as a Transaction Script) where the problem really needed a more robust solution. 

In this scenario, the challenge was to **build a large-scale business logic-heavy enterprise application**.

The best practices for that task are to use Domain-Driven Design, separate your concerns using the clean/hexagonal architecture, write tests, and implement design patterns when necessary.

It turns out that doing all of these things with JavaScript _is hard_. Harder than it needs to be. There are several reasons why, and I explain why in detail [here](/articles/when-to-use-typescript-guide/), but ultimately, it's the lack of a language concept to express **abstractions** (interfaces and abstract classes). Without abstractions and a type system, implementing _contractual software design_ is harder in JavaScript.

That was the main reason why I made the move to TypeScript for that project; because the best practices for a large-scale business logic-heavy enterprise application were easier to implement in TypeScript than in JavaScript.

Yes, it was a challenge to learn and migrate to TypeScript. But that challenge was guided towards implementing the best practices that the problem afforded. Not all projects have the same needs as a large-scale enterprise app.

## Sometimes best practices are a lot of work

I'm not gonna lie. Writing testable code, using DDD, and clean architecture is a lot of work. But if you're working on a project that needs that, [and you're able to identify that](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/), then it's the best path we have to the _right_ way to do things.

<img src="/img/wiki/anemic/chart.svg"/>

## Anti-patterns can introduce relative complexity

In the evolution of bad code, it starts with _code smells_. Code smells are indications that something might be wrong with the way we've designed our code and that we should probably take a better look at it. 

That's the first step towards bad code, and it's not purposeful. These things just happen sometimes. If we can catch it, that's great. We can refactor and clean up code before it becomes a problem.

```typescript
class User {
  // Wait. Why would we need to pass in a "logger" object to create a user?
  // A logger is an "infrastructural" cross-cutting concern, and it definitely 
  // doesn't belong in our user factory method.
  // Also, this parameter list will only increase as we add more things to create
  // the user. We should use an object instead.
  public static  createUser (userName, password, firstName, lastName, logger) {
    ...
  }
}
```

An anti-pattern, however, is a little bit more aggressive. An anti-pattern is deliberate approach to solving a problem in a way that **goes against best practices**.

Anti-patterns have the potential to introduce _relative complexity_.

### Anti-pattern example: Duck-typing with JavaScript

**Problem**: To prevent developers from passing in invalid objects.

Let's say that we want to create slugs for blog posts using the following function.

```javascript
// Returns a slug like: "2020/02/12/absolute-complexity-212312
function createSlug (post) {
  return createDateString(post.postedDate) + "/" 
    + createSlugFromTitle(post.title) + "-"
    + createRandomNumber();
}
```

The function expects that we're going to pass in a `Post` object that has  `postedDate` and `title` attributes.

But developers keep on passing in the _title_ of the post as a `string` like so:

```javascript
const post = "Absolute and Relative Complexity";
const slug = createSlug(post) // ERROR
```

This is a silly problem. But on projects that are substantially large, it's pretty common to see. Especially if you're not familiar with the entire codebase.

**Absolute complexity**: Need to signal to clients that use the API that the method requires a post object with `postedDate` and `title`, and enforce that.

**Relative complexity**: Using JavaScript,
- For API clients, you need to know the internals of every method. You can't rely on [intention revealing interfaces](/articles/typescript-domain-driven-design/intention-revealing-interfaces/) alone.
- For API authors, you need to use duck-typing and throw errors.
- For API authors, you need to write more comments so that developers know how to use the API. The function signature is not enough to express valid use.


```typescript

/**
 * @desc Creates a slug. You need to pass in a post object with `postedDate`
 * and `title` to create it.
 */

function createSlug (post) {
  if (!!post.postedDate === false || isADate(post.postedDate)) {
    throw new Error("Need to provide a post object with date as 'postedDate'")
  }
  if (!!post.title === false || typeof post.title !== "string") {
    throw new Error("Need to provide a post object with a string title.")
  }

  // Also, we would need to include the post title's validation logic here as well
  // which may include making sure that the title is a certain length.

  return createDateString(post.postedDate) + "/" 
    + createSlugFromTitle(post.title) + "-"
    + createRandomNumber();
}
```

**Best practice solutions**: 
- Use a statically-typed language to indicate and enforce valid API usage.

```typescript{1}
function createSlug (post: Post) {
  return createDateString(post.postedDate) + "/" 
    + createSlugFromTitle(post.title) + "-"
    + createRandomNumber();
}
```

<!-- 
### Anti-pattern example: Configuration as source code

### Anti-pattern example: Vendor lock-in

Lets say you've built an entire application on top of a hot new platform, used their APIs have intertwined your rich business logic with vendor-specific details.

Suddenly they decide to start charging users at a price point you're not willing to pay.

**Challenge**: Switching vendors
**Absolute complexity**: 
**Relative complexity**: We have to go through all of our code, replace any references to the expensive vendor's APIs with the new vendor, and make sure that everything still works. -->

## Breaking best practices and implementing anti-patterns

Implementing best practices and avoiding anti-patterns will get us where we need to go in the long run, but will often require some more upfront work.

I think it's occasionally OK to **break best practices** and **implement anti-patterns** in order to go a little faster. 

I give it my blessing in one condition...

Know what the rules (best practices) are _before_ you decide to break 'em.

I take shortcuts all the time. But I try to always know what the implications are first.

## Conclusion

In summary, ask yourself if the problem is hard because it's a _hard_ problem, or if you're _making_ it hard by not following best practices.

