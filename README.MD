## Gtmhub's library to build on top of Gtmhub's platform.

<p>The library is available through CommonJS, AMD and ES6 modules</p>

## Example usages:

<ul>
<li>AMD module</li>

```javascript
require(["@gtmhub/sdk"], function (gtmhub) {
  const sdk = gtmhub.initialiseSdk({ pluginId: "my-plugin-id" });
  // sdk...
});
```

<li>CommonJS module</li>

```javascript
const gtmhub = require("@gtmhub/sdk");
const sdk = gtmhub.initialiseSdk({ pluginId: "my-plugin-id" });
// sdk...
```

<li>ES6 module</li>

```javascript
import { initialiseSdk } from "@gtmhub/sdk";
const sdk = initialiseSdk({ pluginId: "my-plugin-id" });
// sdk...
```

</ul>
