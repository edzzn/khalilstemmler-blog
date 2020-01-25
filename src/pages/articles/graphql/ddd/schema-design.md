---
templateKey: blog-post
title: "Domain-Driven GraphQL Schema Design | Enterprise GraphQL"
date: '2020-01-24T10:04:10-05:00'
updated: '2020-01-241T10:04:10-05:00'
description: >-
  A GraphQL schema is a declarative, self-documenting, organization-wide API. It's pretty important to spend a little bit of time on getting it right. However, unless you're a domain expert, that can be hard to do. In this article, we'll look at an approach to GraphQL schema design that involves both non-technical domain experts and developers.
tags:
  - Domain-Driven Design
  - Professionalism
  - Project planning
category: GraphQL
image: /img/blog/graphql/ddd/graphql-ddd.png
published: true
displayInArticles: true
---

<!-- You're in a post-apocalptic wasteland. After several hundreds of years, society is in the process of slowly rebuilding itself. Tribes and groups have started to form throughout your region, but none of them are talking to each other just yet. Members from the Northern Tribe have discovered transportation. But people are going hungry. Members from the Western Tribe are masters in agriculture. Your job is to assemble all the differen groups throughout your region, show them what they can do together, and save humanity. -->

## Introduction

Designing your GraphQL schema is a potentially expensive task.

It's _potentially expensive_ because if we respect the [principles of GraphQL](https://principledgraphql.com/), the (company-wide) GraphQL schema becomes the singular source of truth for our client applications, and the contract for our sever-side data sources. 

The single source of truth isn't exactly the type of thing you want to get terribly wrong the first time around.

This sentiment is shared by expert GraphQL-r and developer from [Pinterest Engineering](https://twitter.com/PinterestEng), [Francesca Guiducci](https://twitter.com/engfragui), who says to "involve others when designing the GraphQL schema" (via [Netlify, Jan 21st, 2019](https://www.netlify.com/blog/2020/01/21/advice-from-a-graphql-expert/)).

I'm with Francesca on this one. Your GraphQL API is the language others use to build on top of your services, and if it doesn't come from a **shared understanding** of the domain, some domain concepts could end up being really off. 

Designing a GraphQL schema is not usually something a single developer creates in isolation.

### Domain-Driven GraphQL?

[Domain-Driven](/articles/domain-driven-design-intro/) GraphQL means putting an effort into understanding the domain you work in, and using that knowledge to drive development against a model of the business that mimics how it works in the real world.

Code that acts as a software representation of the business is more correct, more tolerant to change, has less inaccurate and undesireable side-effects, and can be understood by everyone.

Often, developers are really good at _developing_, but don't hold a great understanding of the _domain_. To fix that, we can spend more time interacting with people who _do_ understand the domain. 

![](/img/blog/graphql/ddd/schema-design/talk-cap.png)

<p class="caption">You're probably more likely to find a rare unicorn strolling down your company office than you are to find someone who is both a GraphQL Expert AND a Domain Expert - from <a target="_blank" href="https://twitter.com/__xuorig__">Marc-André Giroux</a>'s <a target="_blank" href="https://www.youtube.com/watch?v=pJamhW2xPYw">talk at GraphQL Summit 2018</a>. </p>

This post was inspired by a tweet I blasted out recently. It describes how we can stack our odds of success for building an accurate GraphQL schema by involving domain experts in a process called _Event Storming_.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🖼️Domain-Driven GraphQL Schema Design (in 6 tweets)👇<a href="https://twitter.com/hashtag/graphQL?src=hash&amp;ref_src=twsrc%5Etfw">#graphQL</a> <a href="https://twitter.com/hashtag/eventstorming?src=hash&amp;ref_src=twsrc%5Etfw">#eventstorming</a> <a href="https://twitter.com/hashtag/dddesign?src=hash&amp;ref_src=twsrc%5Etfw">#dddesign</a> <a href="https://t.co/5P2p0XzI2q">pic.twitter.com/5P2p0XzI2q</a></p>&mdash; Khalil Stemmler (@stemmlerjs) <a href="https://twitter.com/stemmlerjs/status/1220401521784954881?ref_src=twsrc%5Etfw">January 23, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<br/>

Let's talk about it.

## Event Storming

By definition, _Event Storming_ is:

> A group or workshop-based modeling technique that brings stakeholders and developers together in order to understand the domain quickly.

![](/img/blog/graphql/ddd/schema-design/event-storming.jpg)

It all started when a developer named [Alberto Brandolini](https://twitter.com/ziobrando) found himself short on time to organize a traditional UML use case design session with some clients. Thinking quickly, he improvised with some sticky notes, markers, and a whiteboard- inadvertently creating _Event Storming_.

Today, _Event Storming_ has become something of a staple in the DDD community. 

It's a quick (and fun!) interactive design process that engages both developers and business-folk to learn the business **and create a shared understanding of the problem domain**. 

The result is either:

- a) A big-picture understanding of the domain (less precise but still very useful).
- b) 🔥A design-level understanding (more precise), which yields software artifacts ([aggregates](/articles/typescript-domain-driven-design/aggregate-design-persistence/), commands, views, [domain events](/articles/typescript-domain-driven-design/chain-business-logic-domain-events/)) agreed on by both developers and domain experts that can be turned into rich domain layer code.

By running an _Event Storming_ session, we end up answering a lot of questions and have all the pieces needed to construct a rich GraphQL schema.

## Using an Event Storm to design a GraphQL Schema

You can use this approach in any context. If you've been asked to build a new app, or you want to start to introduce GraphQL on an existing project, you can take the following approach.

### 💡Step 1. Domain Events

<p class="special-quote">Plot out all of the events that happen for the main story in your application as <i>past-tense</i> verbs.</p>

For my Hackernews-like app, [DDDForum.com](https://github.com/stemmlerjs/ddd-forum/), that looks like:

`UserCreated` => `MemberCreated` => `PostCreated` => `CommentCreated`, `CommentUpvoted`, etc.

![Domain Events](/img/blog/graphql/ddd/schema-design/1-domain-events.jpg)

<p class="caption">Events drawn out chronologically on a timeline from left to right.</p>

### 💡Step 2. Commands

<p class="special-quote">For each <i>Domain Event</i>, write the <i>Command</i> that causes it. These are your <b>GraphQL mutations</b>.</p>

They should be in an imperative form. If you know the name of the role/actor that performs it, you can document that as well.

![Commands](/img/blog/graphql/ddd/schema-design/2-1-command.jpg)

<p class="caption">Commands accompanying their respective Domain Event chronologically on a timeline from left to right.</p>

![Commands with Roles](/img/blog/graphql/ddd/schema-design/2-2-command.jpg)

<p class="caption">If you know the actor, that can be documented as well. Here, we know that <i>Members</i> are the only ones that are allowed to issue the <i>Create Post</i> command.</p>

### 💡Step 3. Aggregates (write models)

<p class="special-quote">For each <i>Command/Domain Event</i> pair, identify the <a href="/articles/typescript-domain-driven-design/aggregate-design-persistence/">Aggregate (or write model)</a> that they belong to.</p>

In _Event Storming_, we normally place the _Aggregate (write model)_ above the <i>Command/Domain Event</i> pair.

![Aggregates](/img/blog/graphql/ddd/schema-design/3-aggregate.jpg)

<p class="caption">Commands accompanying their respective Domain Event chronologically on a timeline from left to right.</p>

---

### 💡Step 4. Enforce boundaries & identify top-level fields

<p class="special-quote">Identify the top-level GraphQL fields by applying <a href="https://khalilstemmler.com/wiki/conways-law/">Conway's Law</a>. If you're building a <i>Modular Monolith</i>, these will be your subdomains. If you're working with <i>Distributed Microservices</i>, these will be your <a target="_blank" href="https://www.apollographql.com/docs/apollo-server/federation/introduction/?utm_source=khalil&utm_medium=article&utm_campaign=domain_driven_graphql_schema_design">Federated GraphQL endpoints</a>.</p>

Segregate the _Events_, _Commands_, and _Aggregate_ groups from each other based on the relevant self-organizing teams that play a part in the story of our application.

📖 This is probably the hardest and most misunderstood step. I'll create more documentation about this in the future. You may want to read about Conway's Law => ([read here](https://khalilstemmler.com/wiki/conways-law/))

![Boundaries](/img/blog/graphql/ddd/schema-design/4-1-boundaries.jpg)

<p class="caption">The story often flows between several subdomains/bounded contexts. For example, when a <i>UserCreated</i> event in the <i>Users</i> subdomain gets fired off, we subscribe and immediately issue a <i>CreateMember</i> command from the <i>Forum subdomain</i>.</p>

![Boundaries](/img/blog/graphql/ddd/schema-design/4-2-boundaries.jpg)


---

### 💡Step 5. Identify Views / Queries

<p class="special-quote">For each <i>Aggregate</i>, identify all possible <i>Views (GraphQL queries)</i> required in order to give users enough information to perform <i>Commands (GraphQL mutations)</i>.</p>

![Views](/img/blog/graphql/ddd/schema-design/5-views.jpg)

<p class="caption">The <i>Post</i> aggregate has several different views.</p>
---

### 💡6. Create the GraphQL Schema

<p class="special-quote">Finally, create our GraphQL Schema from the discovered <i>Commands (Mutations)</i> and <i>Queries</i>. </p>

In _Modular Monoliths_, you can break the schema up into separate files by `extend`-ing the Query and Mutation or by using [graphql-modules](https://github.com/Urigo/graphql-modules).

<div class="filename">infra/http/graphql/schemas/forum.ts</div>

```graphql
enum PostType {
  text
  link
}

type Post {
  slug: String
  title: String
  createdAt: DateTime
  memberPostedBy: Member
  numComments: Int
  points: Int
  text: String
  link: String
  type: PostType
}

type Member {
  memberId: String
  reputation: Int
  user: User
}

type PostCollectionResult {
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}

extend type Query {
  postById (id: ID!): Post
  postBySlug (slug: String!): Post
  popularPosts (pageSize: Int, after: String): PostCollectionResult
  recentPosts (pageSize: Int, after: String): PostCollectionResult
  memberById (id: String!): Member
}

extend type Mutation {
  createPost (input: CreatePostInput!): CreatePostPayload
  createMember (input: CreateMemberInput!): CreateMemberPayload
}
`
```

For Federated GraphQL architectures, you can compose schemas using the `@key` directive that comes from `@apollo/federation`.

## Final thoughts

### Modeling with events when CRUD doesn't fit

This is a controvertial opinion, but one I feel strongly about arguing. I believe that most naturally occuring systems [don't naturally fit within the rigid confines of CRUD](/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/). 

> Complex systems are everywhere we look.

By definition, Julian Shapiro says that "**a system** is anything with multiple parts that **depend on each other**."

I'm not just talking about software. Consider these _real world systems_.

- **Getting started at a new job**: Applying to jobs, performing interviews, receiving offers, conducting negotiations, acceptances, paperwork, then (optional) relocation, onboarding/training.
- **Buying a condo**: Finding a place, getting approved for credit (if you don't get approved, you might have a new prerequisite goal - improve credit, earn capital, or ask relatives), making an offer, accepting an offer, signing paperwork, then making payments.
- **Getting your driver's license**: (Optionally) attending driving school, booking the test, passing the test (or failing the test and re-booking), getting your picture taken, getting your temporary license, then getting your license mailed to you.

As human beings, these systems don't seem that complex in the real world. The reason is because we tend to tame the complexity of them and **how we progress through them** by conceptualizing them as a series of **events**. 

For example, before you **accept a job**, you need to have **applied to jobs**, **performed an interview**, and then gotten an **offer**.

<p class="special-quote">See how those steps <i>depend</i> on each other? While I wish I could always just jump to the <i>offer step</i>, it's not possible.</p>

Software systems often serve the singular purpose of making life easier for humans by consolidating the number of events that require human intervention.

### <div class="expandable-section">Examples of consolidated systems<div class="expandable-section-button" onclick="toggleExpandableSection('consolidated-systems')">+</div></div>

<div id="consolidated-systems" class="expandable-section-content">
  <p>These are examples of systems consolidated by software.</p>
  <ul>
    <li><a target="_blank" href="https://linkedin.com">LinkedIn</a> consolidates the system of making professional connections.</li>
    <li><a target="_blank" href="https://facebook.com">Facebook</a> consolidates the system of maintaining personal friendships.</li>
    <li><a target="_blank" href="https://uber.com">Uber</a> consolidates the system of on-demand based transportation like taxis.</li>
  </ul>
</div>
