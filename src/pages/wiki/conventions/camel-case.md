---
name: 'Camel case'
templateKey: wiki
published: true
wikicategory: Coding Conventions
wikitags: null
prerequisites: null
date: '2020-03-07T00:05:26-04:00'
updated: '2020-03-07T00:05:26-04:00'
image: null
plaindescription: Camel case is a naming convention that says all words in an indentifier (except the first) must be capitalized.
---

Camel case (or should I say `camelCase`) is one of three primary **capitalization conventions** (underscore, [Pascal](/wiki/conventions/pascal-case/), and camel) used in programming languages.

Camel case dictates that each word in an indentifier be **capitalized** (except the first) and contain **no separators (like underscores) in between them**.

_Not camel case_

```typescript{1,6,7,10,14}
type User = { 
  id: string; 
  name: string
}

interface Serializable {
  ToJSON (): string;
}

class UserModel implements Serializable {
  ...
}
// likesWeirdmusic is _almost_ camel case
const ShouldListentoJohnMaus = likesWeirdmusic() && isgenerallyahappyperson();
```

_Camel case_

```typescript{1,6,7,10,14}
type user = { 
  id: string; 
  name: string
}

interface serializable {
  toJSON (): string;
}

class userModel implements serializable {
  ...
}

const shouldListenToJohnMaus = likesWeirdMusic() && isGenerallyAHappyPerson();
```

## The role of Camel case in TypeScript & JavaScript

In TypeScript & JavaScript, the camel case convention is _usually_ used to signify that an indentifier is a variable, function, method, or attribute.

Here's an example of common camel case usage.

```typescript{2,6,12}
// It is conventional to use camel case for variables and functions
const shouldListenToJohnMaus = likesWeirdMusic() && isGenerallyAHappyPerson();

type CanPlaySynth = {
  // Attributes of classes, types, or interfaces are camel cased.
  favouriteSynth: Synth;
}

class JohnMaus implements CanPlaySynth {
  // Accessors (getters), in addition to setters or any other
  // types of methods are also camel-cased
  get favouriteSynth () : Synth {
    ...
  }
}
```

### React HOCs

In React, it's conventional to use Camel case for HOCs like so:

<div class="filename">modules/users/hocs/withLoginHandling.tsx</div>

```typescript{5,10}
import React from 'react';
import { UsersState } from '../redux/states';
import { IUserOperators } from '../redux/operators';

interface withLoginHandlingProps extends IUserOperators {
  users: UsersState
  history: any;
}

function withLoginHandling (WrappedComponent: any) {
  class HOC extends React.Component<withLoginHandlingProps, any> {
    constructor (props: withLoginHandlingProps) {
      super(props)
    }

    ...

    render () {
      return (
        <WrappedComponent
          login={(user: string, props: string) => this.handleLogin(user, props)}
          {...this.props}
        />
      );
    }
  }
  return HOC;
}

export default withLoginHandling;
```

## See also

- [Pascal case](/wiki/conventions/pascal-case/)