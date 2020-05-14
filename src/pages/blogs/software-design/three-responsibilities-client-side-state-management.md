---
templateKey: blog-post
title: "The Three Responsibilities of a Client-Side State Management Solution"
date: '2020-05-14T10:04:10-05:00'
updated: '2020-05-141T10:04:10-05:00'
description: >-
  State management is one of the most challenging parts of every application. No matter the approach used to solve it, the problems to be addressed are the same: storage, updating state, and enabling reactivity.
tags:
  - State Management
  - React
  - Storage
  - Apollo Client
category: Software Design
published: true
image: /img/banner/blog-banner.png
displayInArticles: false
---

Historically, when starting on a new React project, we’ve had to design and implement the state management infrastructure from scratch in a bare-bones way.

No matter which approach we take, in every client-side application, the generic role of a state management solution is the same: to handle storage, update state, and enable Reactivity.

![Client-side state management](/img/blog/software-architecture-design/responsibilities-state-management/client-side-responsibilities.png)

## Storage 

Most apps need to hold onto some data. That data may contain a little slice of **local state** that we’ve configured client-side, or it could be a subset of **remote state** from our backend services.

Often, we need to combine these two pieces of data, local and remote, and then call upon them in our app at the same time. This task alone has the potential to get pretty complicated, especially when we need to perform **updates to the state** of our app.

## Update state

The [Command-Query Segregation Principle](https://khalilstemmler.com/articles/oop-design-principles/command-query-segregation/) states that there are two generic types of operations we can perform: `commands` and `queries`.

In GraphQL, we refer to these as `queries` and `mutations`.

In REST, we have several `command`-like operations like `delete`, `update`, `post`, etc and one `query`-like operation called `get`.

Most of the time, after invoking an operation in a client-side web app, we need to update the state stored locally as a side-effect.

## Reactivity

When storage changes, we need an effective way to notify pieces of our UI that relied on that particular part of the store, and that they should present the new data.

## Each state management approach has a slightly different approach

Just about every library available out there right now can adequately handle all three of these responsibilities! Here are some of the most popular approaches right now in the React realm.

![Client-side state management options](/img/blog/software-architecture-design/responsibilities-state-management/state-management-options.png)

**Redux**

- Storage: Plain JS object
- Updating state: actions + reducers
- Reactivity: Connect

**React Context + Hooks**

- Storage: Plain JS object
- Updating state: useReducer (or not)
- Reactivity: useContext

**Apollo Client**

- Storage: Normalized cache
- Updating state: Cache APIs
- Reactivity: (Auto) Broadcast change notifications to Queries