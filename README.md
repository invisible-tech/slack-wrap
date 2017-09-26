# slack-wrap

This module wraps the Slack Web Client and does several things to enhance the API.

# Install
```
yarn add invisible-tech/slack-wrap
```


# Usage
```javascript
'use strict'

require('dotenv').config() // Loads .env
const { WebClient } = require('@slack/client')
const { factory, methods } = require('@invisible/slack-wrap')

const accessToken = process.env.SLACK_API_TOKEN || ''
const slack = factory({
  accessToken,
  teamId: 'T012345',
  cachedPaths: [
    { path:'channels.list', ttl: 60000 },
    { path:'users.info' },
  ],
  methods,
})

slack.chat.postMessage({
  channel: 'C6BQ7JA0J',
  icon_emoji: ':joy:',
  text: 'stuff',
  username: 'wooo2',
})
.then(console.log)
.catch(console.error)
```


# Features

## Destructured arguments

All API methods that take arguments will accept a single object. This is an improvement on using positional arguments, which require you to remember the order.

## Cached methods

All API methods can be optionally cached in memory, with an optional TTL (default is 60 seconds). This will reduce your total number of API calls and prevent you from hitting the throttling limit. You determine which methods to cache by passing in a `cachedPaths` argument to `factory`.

The `cachedPaths` argument should be an Array of Objects, where each item is of the form `{ path: 'x.y', ttl: 30000 }` or `{ path: 'x.y' }` (to use the default ttl).

## Additional methods

You can add any additional methods you wish by passing them in as the `methods` argument to `factory`. The `methods` argument is an Object containing the methods you wish to add. These methods should all take a `slack` object as an argument, then use that given `slack` object to perform the additional API calls, etc. See [methods/message.js](./src/slack/methods/message.js) for an example.
