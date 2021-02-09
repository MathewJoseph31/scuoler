# QuickStore

A React component library for state management that utilizes the Context API and React Hooks.

```
npm install react-quickstore
```

Check out a **[live example on codesandbox.io](https://codesandbox.io/s/88pojvwllj)**.

---

QuickStore makes use of the [Context API](https://reactjs.org/docs/context.html) implemented in version 16.3 of React. If you're not familiar with it, it's recommended that you check it out first to gain an understanding, and to see if you even need this level of state management in your application.

The two components that ship in the QuickStore library are named `Provider` and `Consumer`, the same naming convention used in Context. This makes implementing QuickStore easier once you understand the API.

QuickStore version 2.0.0 and greater utilize React version 16.8.6 to make use of the new useContext hook! You can
now use this new feature by importing the `useQuickStore` custom hook from this library.

**Provider Component**

The `Provider` component is akin to the data store present in other state management solutions. It's the place your application's data is stored and manipulated when requests are handed to it. The `Provider` component is the parent of the two in this library.

**Consumer Component**

The `Consumer` component is the part that accesses the data from the `Provider`. It uses the [render prop](https://reactjs.org/docs/render-props.html) pattern for its implementation, and it passes along to the function an object with two properties: `state` and `dispatch`. The `state` property is an object that contains all the key/value pairs of data in the `Provider` "store". The `dispatch` property is a function that can be called to send actions, or requests, back to the `Provider` to change the data in the store.

**Example**

Below is the basic implementation pattern for QuickStore's components:

```javascript
import { Provider, Consumer } from "react-quickstore";

...

<Provider>
  <Consumer>
    {({ state, dispatch }) => (
      ... UI elements ...
    )}
  </Consumer>
</Provider>
```

### Consumer :: state

The `Consumer` component passes to its child function an object with two properties, one for accessing the state in the `Provider`, and one for manipulating that state. The first one is the `state` property, which is a reference to the state object held in the `Provider` store.

If our `Provider` store data looks like this...

```javascript
{
  name: 'Chewbacca',
  height: 'tall'
}
```

...then we access the values like so:

```javascript
<Consumer>
  {({ state }) => (
    <p>
      {state.name} is {state.height}.
    </p>
  )}
</Consumer>
```

### Consumer :: dispatch

The second property is `dispatch`, which is a function that allows the state within `Provider` to be manipulated. It accepts two arguments: an object that represents the changes to be made in state, and an optional callback function to be invoked after the changes occur.

The action object passed to `dispatch` in its simplest form contains just the key/value pairs of the data you want to change in the store.

For example, if our store data looks like this...

```javascript
{
  planet: "Earth";
}
```

...and we dispatch this action object...

```javascript
<Consumer>
  {({ state, dispatch }) => (
    <p>I have been to {state.planet}.</p>
    <button onClick={() => dispatch({ planet: 'Mars' })}>
      Change Planet
    </button>
  )}
</Consumer>
```

...then our store data will look like this:

```javascript
{
  planet: "Mars";
}
```

The action objects you dispatch back to the `Provider` can be as complex as you need them to be. Just note that under the hood, `Provider` is performing a setState with the changes you pass it, so keep that in mind when deciding how you're updating your values when dispatching these simple objects.

For a more controlled dispatch experience, see the sections below on the different reducer props you can pass to `Provider`.

### Provider :: Props

The `Provider` component accepts three optional props for enchancing your state management solution.

- **initialState**: an object that sets the initial shape and values of the data stored in the `Provider`.

```javascript
const initialState = { message: "Hello from QuickStore!" };

<Provider initialState={initialState}>
  <Consumer>{({ state }) => <p>Message: {state.message}</p>}</Consumer>
</Provider>;
```

- **reducer**: a function that accepts two arguments (current state and action dispatched) and returns an object that represents which key/values in the state object that should be changed. This is useful when implementing more controlled state management experiences where "types" and "payloads" are used. See example below:

```javascript
const initialState = { message: '' };

// Listen for specific "type" and return updates using the supplied payload.
// This approach is common in patterns used by Flux and Redux.
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return { message: action.payload };
    default:
      return action;
  }
};

<Provider initialState={initialState}>
  <Consumer>
    {({ state }) => (
      <p>Message: {state.message}</p>
      <button
        onClick={() => {
          dispatch({ type: 'UPDATE_MESSAGE', payload: 'Hello!' })
        }}
      >
        Update Message
      <button>
    )}
  </Consumer>
</Provider>
```

- **asyncReducer**: similar to the reducer prop, this is an async function that accepts the same two arguments, but returns a promise with a resolved value set to the changes that should be made in state. Asynchronous operations can be awaited inside this function.

```javascript
// Working off of the example above, this is
// what an asyncReducer usage could look like:
const asyncReducer = async (state, action) => {
  switch (action.type) {
    case "GET_SERVER_MESSAGE":
      return await someAjaxMethod().then(message => {
        return { message };
      });
    default:
      return action;
  }
};

<Provider asyncReducer={asyncReducer}> ... </Provider>;
```

The `asyncReducer` function is processed first internally in QuickStore, with the result then being passed to the `reducer` function afterwards. This allows you have both synchronous and asynchronous operations and keep them separated for clarity. Below is an example of returning the result of an async operation in the `asyncReducer` to operations peformed in the `reducer`:

```javascript
// Pass results from async operation to synchronous reducer to be processed:
const asyncReducer = async (state, action) => {
  switch (action.type) {
    case "GET_SERVER_MESSAGE":
      return await someAjaxMethod().then(message => {
        // This will now tell the reducer to process this result:
        return { type: "UPDATE_MESSAGE", payload: message };
      });
    default:
      return action;
  }
};

// The synchronous reducer can now handle both cases where updated values
// come from either an async or sync request, since it's simply looking
// for the correct action.type to match the case within:
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_MESSAGE":
      return { message: action.payload };
    default:
      return action;
  }
};

<Provider asyncReducer={asyncReducer} reducer={reducer}>
  ...
</Provider>;
```

### useQuickStore :: Custom Hook

The `useQuickStore` custom hook allows you to import `state` and `dispatch` in function components, instead of
having to use the `Consumer` component's render props pattern. This improves the overall functionality and design
of the QuickStore component library! Invoking the `useQuickStore` custom hook returns an object with the `state` and
`dispatch` properties, which function the same way that the `Consumer` render prop version. Just make sure that your
function component is in the child component tree of your `Provider` component.

**Example**

Below is the basic implementation pattern for QuickStore's `useQuickStore` custom hook:

```javascript
import React, { Fragment } from "react";
import { useQuickStore } from "react-quickstore";

// inside store's state object:
// {
//  title: 'My Title'
// }

function Title() {
  const { state, dispatch } = useQuickStore();

  return (
    <Fragment>
      <h1>{state.title}</h1>
      <button onClick={() => dispatch({ title: "My New Title" })}>
        Change Title
      </button>
    </Fragment>
  );
}
```
