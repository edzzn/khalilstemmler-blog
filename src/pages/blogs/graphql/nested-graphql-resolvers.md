---
templateKey: blog-post
title: "Nested GraphQL Resolvers & Separating Concerns"
date: '2020-02-22T10:04:10-05:00'
updated: '2020-02-221T10:04:10-05:00'
description: >-
  Two approaches to implementing separation of concerns and better cohesion of operations in your GraphQL schema.
tags:
  - GraphQL
  - Schema Design
category: GraphQL
image: /img/blog/graphql/graphql-banner.png
published: true
displayInArticles: false
---

Unfortunately, in GraphQL, you can't nest operations to apply better grouping (namespacing / separation of concerns) to your services.

Here's an example. I was building my own personal data graph with all kinds of cool things on it like my `spotify`, my Google `calendar`, and my `github` activity.

<p class="special-quote">You can check out my personal data graph at <a href="https://stemmlerjs-graph.netlify.com/">stemmlerjs-graph.netlify.com</a></p>

I wanted to design the schema where each service lived at the top-level. That would enable me to separate concerns and place all operations within the services like so:

<div class="filename">schema.graphql</div>

```graphql
type Spotify {
  getCurrentSong (): Song
  getRecentlyListenedToSongs (): [Song]!
  ...
}

type Calendar {
  getCalendarForMonth (month: String!, year: Integer): CalendarResult!
  ...
}

type GitHub {
  getRecentActivity (): GitHubActivityResult!
  ... 
}

type Query {
  spotify: Spotify
  calendar: Calendar
  github: GitHub
}
```

It's too bad that this doesn't work. It's not that it isn't valid GraphQL, but it's just that if we were to do this, **none of our nested resolvers will ever get invoked**. See [here](https://github.com/graphql/graphql-js/issues/221#issuecomment-568894704) and [here](https://github.com/apollographql/apollo-server/issues/3635).

This isn't great, as we'd like to be able to enforce some sort of namespacing. Some separation of concerns. 

Take the following example of a GraphQL schema with the `users` and `movies` subdomains. Without namespacing, we end up with large schemas that look like the following.

<div class="filename">schema.graphql</div>

```graphql
type Query {
  Movie(_id: String, movieId: ID, title: String, year: Int, description: String, first: Int, offset: Int, orderBy: [_MovieOrdering]): [Movie]
  Actor(actorId: ID, name: String, _id: String, first: Int, offset: Int, orderBy: [_ActorOrdering]): [Actor]
  User(userId: ID, name: String, _id: String, first: Int, offset: Int, orderBy: [_UserOrdering]): [User]
}

type Mutation {
  CreateMovie(movieId: ID, title: String, year: Int, description: String): Movie
  UpdateMovie(movieId: ID!, title: String, year: Int, description: String): Movie
  DeleteMovie(movieId: ID!): Movie
  AddMovieActors(from: _ActorInput!, to: _MovieInput!): _AddMovieActorsPayload
  RemoveMovieActors(from: _ActorInput!, to: _MovieInput!): _RemoveMovieActorsPayload
  AddMovieRatings(from: _UserInput!, to: _MovieInput!, data: _RatingInput!): _AddMovieRatingsPayload
  CreateActor(actorId: ID, name: String): Actor
  UpdateActor(actorId: ID!, name: String): Actor
  DeleteActor(actorId: ID!): Actor
  AddActorMovies(from: _ActorInput!, to: _MovieInput!): _AddActorMoviesPayload
  RemoveActorMovies(from: _ActorInput!, to: _MovieInput!): _RemoveActorMoviesPayload
  CreateUser(userId: ID, name: String): User
  UpdateUser(userId: ID!, name: String): User
  DeleteUser(userId: ID!): User
  AddUserRating(from: _UserInput!, to: _MovieInput!, data: _RatingInput!): _AddUserRatingPayload
  RemoveUserRating(from: _UserInput!, to: _MovieInput!): _RemoveUserRatingPayload
}
```

<p class="caption">A poorly namespaced GraphQL schema.</p>

You may be able to see that the grouping and cohesion between related operations are not present here. It's visually challenging to group all  operations related to `users`, `actors`, and `movies` into units. Everything is mixed together.


In [Domain-Driven Design](/articles/domain-driven-design-intro/), each subdomain contains only the operations that are related to that subdomain. Subdomains are well encapsulated.

For example, looking at these operations, I can deduce that we have two subdomains- a `users` one and a `movies` one (`actor` is a concept that would also belong to `movies`). 

Therefore,
  - All the operations for `users` go into the users subdomain.
  - All the operations for `movies` go into the movies subdomain.

<div class="filename">users.schema</div>

```graphql
type Query {
  User(userId: ID, name: String, _id: String, first: Int, offset: Int, orderBy: [_UserOrdering]): [User]
}

type Mutation {
  CreateUser(userId: ID, name: String): User
  UpdateUser(userId: ID!, name: String): User
  DeleteUser(userId: ID!): User
  AddUserRating(from: _UserInput!, to: _MovieInput!, data: _RatedInput!): _AddUserRatedPayload
  RemoveUserRating(from: _UserInput!, to: _MovieInput!): _RemoveUserRatedPayload
}
```

<div class="filename">movies.schema</div>

```graphql
type Query {
  Movie(_id: String, movieId: ID, title: String, year: Int, description: String, first: Int, offset: Int, orderBy: [_MovieOrdering]): [Movie]
  Actor(actorId: ID, name: String, _id: String, first: Int, offset: Int, orderBy: [_ActorOrdering]): [Actor]
}

type Mutation {
  CreateMovie(movieId: ID, title: String, year: Int, description: String): Movie
  UpdateMovie(movieId: ID!, title: String, year: Int, description: String): Movie
  DeleteMovie(movieId: ID!): Movie
  AddMovieActors(from: _ActorInput!, to: _MovieInput!): _AddMovieActorsPayload
  RemoveMovieActors(from: _ActorInput!, to: _MovieInput!): _RemoveMovieActorsPayload
  AddMovieRatings(from: _UserInput!, to: _MovieInput!, data: _RatingInput!): _AddMovieRatingsPayload
  CreateActor(actorId: ID, name: String): Actor
  UpdateActor(actorId: ID!, name: String): Actor
  DeleteActor(actorId: ID!): Actor
  AddActorMovies(from: _ActorInput!, to: _MovieInput!): _AddActorMoviesPayload
  RemoveActorMovies(from: _ActorInput!, to: _MovieInput!): _RemoveActorMoviesPayload
}
```

There's still references between subdomains, and that's ok, because in software, we eventually need to connect pieces together.

That said, it's a good idea to be explicit about those relationships- this is where tools like [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/?utm_source=khalil&utm_medium=article&utm_campaign=nested_resolvers) come in handy because we can compose schemas and be precise about where fields are resolved from between services. 

## Solutions

Let's look at two approaches to remedy our design issue.

### 1. Enforcing a GraphQL-operation naming pattern

Best for _modular monolith_ applications where several subdomains are housed from within the same project (or in fancy DDD-talk, the same bounded context). 

With a modular monolith, `users` might be folder with everything related to `users`, where `movies` is its own folder with everything related to `movies`, as per **screaming architecture**.

<div class="solid-book-cta course-cta">
  <div class="solid-book-logo-container">
    <img src="/img/resources/solid-book/book-logo.png"/>
  </div>
  <p><a href="https://github.com/stemmlerjs/ddd-forum">DDDForum</a>, the app that we build at the end of <a href="https://solidbook.io">solidbook.io</a> using Domain-Driven Design, is a modular monolith.</p>
</div>

Suggested by @dncrews on GitHub, he suggests using the following GraphQL-operation naming pattern.

```xml
<primaryResource><Action><SecondaryResource>
```

Updating the previous schema with this pattern may make it look like this.

<div class="filename">graphql.schema</div>

```graphql
type Mutation {
  # Movies subdomain
  movieCreate
  movieUpdate
  movieDelete
  movieAddActor
  movieAddActors
  movieRemoveActor
  movieRemoveActors
  movieAddRatings
  actorCreate
  actorUpdate
  actorDelete

  # Users subdomain
  userCreate
  userUpdate
  userDelete
  userAddRating
  userRemoveRating
}
```

It's not the perfect solution, but it's _good enough_ for many use cases.

<p class="special-quote"><b>Modularizing your schema</b>: If you're not into having everything in one file, there are several ways you can modularize your GraphQL schema. Two popular tools are <a target="_blank" href="https://github.com/Urigo/merge-graphql-schemas">merge-graphql-schemas</a> and <a href="https://github.com/Urigo/graphql-modules">graphql-modules</a>, though I've also resorted to simple string interpolation with Apollo Server.</p>

### 2. Federated services

If you're part of a larger organization, and other teams are can take ownership of their own GraphQL endpoints for their respective services, **Apollo Federation** is a good idea.

With Federation, we can get that **separation of concerns** at the service level by delegating operations to the appropriate GraphQL endpoint in the organization using an Apollo Gateway. Here's the configuration of an Apollo Gateway.

<div class="filename">gateway.ts</div> 

```typescript
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'accounts', url: 'http://localhost:4001' },
    { name: 'products', url: 'http://localhost:4002' },
    { name: 'reviews', url: 'http://localhost:4003' }
  ]
});

const server = new ApolloServer({ gateway });
server.listen();
```

<p class="caption">Configuration of an Apollo Gateway to implement a federated GraphQL architecture.</p>

In a Federated architecture, we can use the `@provides`, `@key`, and `@external` directives to **compose schemas**, be explicit about the relationships between services, and define which service is responsible for resolving a field in question.

<div class="filename">reviews.schema</div> 

```graphql
type Review {
  body: String
  author: User @provides(fields: "username")
  product: Product
}

extend type User @key(fields: "id") {
  id: ID! @external
  reviews: [Review]
}

extend type Product @key(fields: "upc") {
  upc: String! @external
  reviews: [Review]
}
```

Clone and try out the [Apollo Federation Demo](https://github.com/apollographql/federation-demo) if you're interested in this approach. To learn more about how it works and how to get started, check out [the docs](https://www.apollographql.com/docs/apollo-server/federation/introduction/?utm_source=khalil&utm_medium=article&utm_campaign=nested_resolvers).


## Conclusion

In order to achieve true separation of concerns at the service level, try out Apollo Federation.

If you're working on a smaller project or working in a monolith, consider enforcing a naming pattern with the _namespace_ (subdomain) at the front of the GraphQL operation.

