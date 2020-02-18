---
templateKey: blog-post
title: "How to Build a Compiler?"
date: '2020-02-17T10:04:10-05:00'
updated: '2020-02-171T10:04:10-05:00'
description: >-
  A generalization of compiling code involves understanding the programming language grammar, parsing it, organizing it into a syntax tree, and then evaluating expressions.
tags:
  - Compilers
  - Software Design
category: Software Engineering
published: true
image: /img/banner/blog-banner.png
displayInArticles: false
---

Today, in the [Advanced JavaScript Developers group](https://www.facebook.com/groups/advancedjavascript/), someone asked the question:

> Musing from a Noob: so if you were to write a translator from one language to another, say JS to Java or something arbitrary, would that translator be written almost entirely in like regular expressions or something? My google-fu is solid, but I'm trying to get some professional opinions first.... What y'all think?

I'm no professional in compiler development (I never got a chance to take Brock University's awesome compiler course), but I once wrote a LISP interpreter in Java (takes in some LISP code and executes it).

For this, you might be able to hack your way through it with regular expressions, but _I think_ the proper way is to build an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

In all programming languages, there's the concept of a [grammar](https://en.wikipedia.org/wiki/Context-free_grammar). The grammar is something that defines all legal expressions in a language (much like English does).

For example, in JavaScript, we're allowed to do:

```javascript
const x = 12
```

But we can't do:

```javascript
const x y z = 12
```

The grammar that _formalizes_ this might look something like:

```bash
"[variable type] [variable name] = [value]"
```

And we didn't follow that rule in the second example.

If languages each have a set of grammar rules, and those rules are **all the legal expressions**, then there are primarily two parts to building a compiler.

- Establish the language rules (grammar)
- Be able to read a file, parse it, then build an validate an Abstract Syntax Tree from that grammar. If you can't build the syntax tree, it's because some grammar is wrong (this is the concept of a syntax error).

There's also the validation of the tree itself. 

For example, in Java, for a single tree, where a tree is a file (a program, like myApp.java), you're only allowed to have the `public static void main (String[] args)` once in the program, because that's the entry point.

So _I think_ in order to PROPERLY do this conversion, you need to:

1. Build the grammar for JavaScript
2. Build the grammar for Java
3. Know what the conversion rules from one grammar to the other are
4. Build the syntax tree for JS code
5. For each node (or a group of nodes) in the tree, run it against the conversion rules for Java and build a new syntax tree (a Java one).
6. Convert the syntax tree to Java source code!
7. (optional) run it through a prettier thing to make it look clean :p

Definitely leave a comment below if you know a bit about the subject, you've built a compiler before, or you have some useful resources for others.

## Resources

I found this page, [Introduction to Programming Languages/Grammars](https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Grammars?fbclid=IwAR0nLkq2rIAyA5DbDRHBXYpHWsNo21XYas-7GjeUe82G-DWtdAydk8oeBys). It seems really useful.

There's also [Babel](https://babeljs.io/), a modern JavaScript compiler that you might have used. I suspect peeking at the source code here would be insightful :)

