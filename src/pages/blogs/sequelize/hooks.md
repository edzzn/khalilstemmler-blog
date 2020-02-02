---
templateKey: blog-post
title: "Ensuring Sequelize Hooks Always Get Run"
date: '2020-02-02T10:04:10-05:00'
updated: '2020-02-021T10:04:10-05:00'
description: >-
  In a modular monolith, you can decouple business logic using Domain Events and Sequelize Hooks. For that to work, we need to make sure that our hooks are always getting called on every transaction.
tags:
  - Sequelize
category: Sequelize
published: true
image: /img/blog/sequelize/banner.png
displayInArticles: false
---

## Intro

In "[Decoupling Logic with Domain Events [Guide] - Domain-Driven Design w/ TypeScript](/articles/typescript-domain-driven-design/chain-business-logic-domain-events/)", we use [Sequelize Hooks](https://sequelize.org/master/manual/hooks.html) to decouple business logic, allowing the system to **respond to events** in a fashion similar to the _Observer Pattern_.

Sequelize hooks are places we can write callbacks that get invoked at key points in time like `afterCreate`, `afterDestroy`, `afterUpdate`, and more.

<div class="filename">infra/sequelize/hooks/index.ts</div>

```typescript
import models from "../models"
import { DomainEvents } from "../../../core/domain/events/DomainEvents"
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID"

const dispatchEventsCallback = (model: any, primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(model[primaryKeyField])
  DomainEvents.dispatchEventsForAggregate(aggregateId)
}

(async function createHooksForAggregateRoots() {
  const { User } = models

  User.addHook("afterCreate", (m: any) => dispatchEventsCallback(m, "user_id"))
  User.addHook("afterDestroy", (m: any) => dispatchEventsCallback(m, "user_id"))
  User.addHook("afterUpdate", (m: any) => dispatchEventsCallback(m, "user_id"))
  User.addHook("afterSave", (m: any) => dispatchEventsCallback(m, "user_id"))
  User.addHook("afterUpsert", (m: any) => dispatchEventsCallback(m, "user_id"))
})()
```

In Domain-Driven Design, after a transaction completes, we want to execute [domain event handlers](/articles/typescript-domain-driven-design/chain-business-logic-domain-events/) in order to decide whether we should invoke any follow up commands or not.

<div class="filename">forum/subscriptions/afterUserCreated.ts</div>

```typescript{16,19}
import { UserCreated } from "../../users/domain/events/userCreated"
import { IHandle } from "../../../shared/domain/events/IHandle"
import { CreateMember } from "../useCases/members/createMember/CreateMember"
import { DomainEvents } from "../../../shared/domain/events/DomainEvents"

export class AfterUserCreated implements IHandle<UserCreated> {
  private createMember: CreateMember

  constructor(createMember: CreateMember) {
    this.setupSubscriptions()
    this.createMember = createMember
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name)
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event

    try {
      await this.createMember.execute({ userId: user.userId.id.toString() })
      console.log(
        `[AfterUserCreated]: Successfully executed CreateMember use case AfterUserCreated`
      )
    } catch (err) {
      console.log(
        `[AfterUserCreated]: Failed to execute CreateMember use case AfterUserCreated.`
      )
    }
  }
}
```

In the [Sequelize Repository](/articles/typescript-domain-driven-design/repository-dto-mapper/), where we deal with persistence logic, I have noticed that the hook callbacks do not get called **if no new rows were created** and **no columns were changed**. 

In the `save` method of a repository, you'll find code where we rely on a [mapper](/articles/typescript-domain-driven-design/repository-dto-mapper/) to convert the domain object to the format necessary for Sequelize to save it. You'll also find code that determines if we're doing a `create` or an `update` based on the domain object's existence.

<div class="filename">forum/repos/implementations/sequelizePostRepo.ts</div>

```typescript{26-29}
export class SequelizePostRepo implements PostRepo {
  ...

  public async save (post: Post): Promise<void> {
    const PostModel = this.models.Post;
    const exists = await this.exists(post.postId);
    const isNewPost = !exists;
    const rawSequelizePost = await PostMap.toPersistence(post);
    
    if (isNewPost) {

      try {
        await PostModel.create(rawSequelizePost);
        await this.saveComments(post.comments);
        await this.savePostVotes(post.getVotes());
        
      } catch (err) {
        await this.delete(post.postId);
        throw new Error(err.toString())
      }

    } else {
      await this.saveComments(post.comments);
      await this.savePostVotes(post.getVotes());
      
      // Persist the post model to the database 
      await PostModel.update(rawSequelizePost, { 
        where: { post_id: post.postId.id.toString() } 
      });
    }
  }
}
```

In the highlighted lines, I expect the `afterUpdate` hook to get called, though it will not in scenarios where there were no are differences.

To fix this, Sequelize's `update` method's second parameter configuration object allows you to pass in `hooks: true`.

<div class="filename">forum/repos/implementations/sequelizePostRepo.ts</div>

```typescript{5}
await PostModel.update(rawSequelizePost, { 
  where: { post_id: post.postId.id.toString() }
  // Be sure to include this to call hooks regardless
  // of anything changed or not.
  hooks: true,
});
```

Doing this will ensure that the hooks get run everytime.

