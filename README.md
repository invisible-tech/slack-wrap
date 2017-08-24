# slack-wrap

This module wraps the Slack Web Client so that all API methods will accept a single object as argument.

# Install
```
yarn add invisible-tech/slack-wrap
```

# Usage
```javascript
'use strict'

require('dotenv').config() // Loads .env
const { WebClient } = require('@slack/client')
const slackWrap = require('@invisible/slack-wrap')

const token = process.env.SLACK_API_TOKEN || ''
const web = slackWrap(new WebClient(token))

web.chat.postMessage({
  channel: 'C6BQ7JA0J',
  icon_emoji: ':joy:',
  text: 'stuff',
  username: 'wooo2',
})
.then(console.log)
.catch(console.error)
```
