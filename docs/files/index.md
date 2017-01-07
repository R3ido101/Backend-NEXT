This is the documentation for the ATLauncher API.

# Contents
<!-- toc -->

# Versions
This API is versioned so that you can ensure that your consuming applications will not have to worry about breaking changes causing issues.

You can specify the version of the API you wish to use by providing an **Accept** header in your API calls like below:

```
Accept: application/vnd.atlauncher.v1+json
```

By default if no Accept header is sent, we will always use the latest version of the API. If you wish to ensure stability of your applications using this API, then it's highly recommended to set this
header so that things don't suddenly stop working one day.

## Version lifecycle
Each version of the API will **NEVER** introduce any breaking changes. This includes removing endpoints, changing return types, removing return values and more.

Below is a simple table showing what we will and will not do in a single version of this API.

| Change made | New version? |
|-------------|-------------:|
| Add a new endpoint | No |
| Remove an endpoint | Yes |
| Add a new attribute to the return object of an endpoint | No |
| Remove an attribute from the return object of an endpoint | Yes |
| Change the type of an attribute from the return object of an endpoint | Yes |
| Change the structure of the response sent from an endpoint | Yes |
| Change the scope needed to access the endpoint | Yes |

## Version Documentation
 - [v1](/docs/v1/)