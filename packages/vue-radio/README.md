<div align="center">
  <img width="100" src="../../client/assets/img/default-logo-full.svg">
</div>

# @extensionengine/vue-radio

[![Npm
version](https://badgen.net/npm/v/@extensionengine/vue-radio)](https://www.npmjs.com/package/@extensionengine/vue-radio)
[![GitHub
license](https://badgen.net/github/license/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/blob/develop/LICENSE)
[![js @extensionengine
style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)
[![style @extensionengine
style](https://badgen.net/badge/stylelint/@extensionengine/black)](https://github.com/ExtensionEngine/stylelint-config)
[![Open Source
Love](https://badgen.net/badge/Open%20Source/%E2%9D%A4/3eaf8e)](https://github.com/ellerbrock/open-source-badge/)

## Usage

```js
// main.js
import Radio from '@extensionengine/vue-radio';

Vue.use(Radio);
```

```js
// vue component
import { mapChannels, mapRequests } from '@extensionengine/vue-radio';

computed: {
  ...mapChannels({ myChannel: 'channelName' }) // Get channel and map it to this.myChannel computed property
},

methods: {
    ...mapRequests('channelName', ['requestName']), // Map channel request to this.requestName method
    // Call mapped method: this.requestName(args);
}
```
