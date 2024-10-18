
## Installing

Using npm:
```
$ npm install @ducor/http-client
```

Using yarn:
```
$ yarn add @ducor/http-client
```

Using pnpm:

```
pnpm add @ducor/http-client
```

Once the package is installed, you can import the library using `import` or `require` approach:

## Example

> **Note**: CommonJS usage   In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with
> `require()`, use the following approach:

```js
import http from '@ducor/http-client';
//const http  = require('@ducor/http-client'); // legacy way

// Make a request for a user with a given ID
http.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
http.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await http.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

> **Note**: `async/await` is part of ECMAScript 2017 and is not supported in Internet Explorer and older browsers, so use with
> caution.

Performing a `POST` request
```js
http.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 ```

Performing multiple concurrent requests

```js
function getUserAccount() {
  return http.get('/user/12345');
}

function getUserPermissions() {
  return http.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()])
  .then(function (results) {
    const acct = results[0];
    const perm = results[1];
  });
 ```

### Request method aliases

For convenience, aliases have been provided for all common request methods.

### Request method aliases

For convenience, aliases have been provided for all common request methods.

##### http.request(config)
##### http.get(url[, config])
##### http.delete(url[, config])
##### http.head(url[, config])
##### http.options(url[, config])
##### http.post(url[, data[, config]])
##### http.put(url[, data[, config]])
##### http.patch(url[, data[, config]])


## Response Schema

The response for a request contains the following information.

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the HTTP headers that the server responded with
  // All header names are lowercase and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {},

  // `config` is the config that was provided to `http` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}
```

When using `then`, you will receive the response as follows:

```js
http.get('/user/12345')
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```
## Config Defaults

You can specify config defaults that will be applied to every request.

### Global http defaults

```js
http.defaults.baseURL = 'https://api.example.com';

// Important: If http is used with multiple domains, the AUTH_TOKEN will be sent to all of them.
// See below for an example using Custom instance defaults instead.
http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

### set or delete Authorization Token

for delete `http.setToken();`
you can update `_token` or `Authorization Token` using this method.

### Working with Any Toaster System

To set a toaster for your HTTP client, you can use the following code snippet:

```js
import http from "@ducor/http-client";
import toast from "react-hot-toast";

http.setToast(toast); // toast | 'alert' | false;
```

| Option                      | Description                                 |
|-----------------------------|---------------------------------------------|
| `toast`                     | Class or function for toast notifications.  |
| `'alert'`                   | Uses the window's default alert.            |
| `false`                     | Disables the toast notifications or alert.  |


**Most likely, all React standart toasters are supported.**

|  -  | Name                                                                 | Install Command           |
|-----|----------------------------------------------------------------------|---------------------------|
| ☑️ | [react-toastify](https://github.com/fkhadra/react-toastify)           | `npm install react-toastify` |
| ☑️ | [react-hot-toast](https://github.com/timolins/react-hot-toast)        | `npm install react-hot-toast` |
