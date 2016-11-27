---
title: Authentication
---

In order to access some parts of this API, authentication is required.

When authentication is needed, you'll need to use OAuth in order to get access tokens for users.

# Contents
<!-- toc -->

# OAuth
OAuth is a way to allow gaining access tokens on behalf of users.

For a great overview of OAuth, take a look at this [Digital Ocean article](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2).

## Grants
We currently support 4 grant types:

 - Implicit
 - Refresh Token
 - Authorization Code
 - Client Credentials

### Implicit
Implicit grant is used when you don't have access to a backend server.

In order to get an access token for a user you must first redirect the user to our authorize page where they will login and then authorize your application to access the API with their account with
the given scopes.

If approved they will be redirected back to your registered redirect url with the access token in the hash of the url.

#### Example
Redirect the user to `{{{OAUTH_BASE_URL}}}/authorize?response_type=code&client_id={{OAUTH_CLIENT_ID}}&redirect_uri={{OAUTH_REDIRECT_URI}}&scope={{SCOPES}}`.

Once authorized they'll be redirected to your registered redirect url with the information needed in the hash like
`{{{OAUTH_BASE_URL}}}#access_token={{ACCESS_TOKEN}}&refresh_token={{REFRESH_TOKEN}}&scope={{SCOPES}}&expires_at=2016-12-19T09%3A49%3A42.850Z&refresh_token_expires_at=2017-02-19T09%3A49%3A42.864Z&token_type=Bearer`.

### Authorization Code
This is to be used when you have a backend server that can be used to exchange tokens secretly away from the end user.

In order to get an access token for a user you must first redirect the user to our authorize page where they will login and then authorize your application to access the API with their account with
the given scopes.

If approved they will be redirected back to your registered redirect url with a authorization code which then needs to be sent back to our servers along with your client secret which will reply
with an access token, refresh token and expire times.

#### Example
Redirect the user to `{{{OAUTH_BASE_URL}}}/authorize?response_type=code&client_id={{OAUTH_CLIENT_ID}}&redirect_uri={{OAUTH_REDIRECT_URI}}&scope={{SCOPES}}`.

Once authorized they'll be redirected back to your registered redirect url with a code as a query parameter like `{{{OAUTH_BASE_URL}}}?code=0LA1XTorX9Urd0aLwHqpx5KHZbjOAAHS`.

Next exchange that code for an access key on your server by making a POST request to `{{{OAUTH_BASE_URL}}}/token` with the following JSON:

```
{
	"client_id": "{{OAUTH_CLIENT_ID}}",
	"redirect_uri": "{{OAUTH_CLIENT_REDIRECT_URI}}",
	"grant_type": "authorization_code",
	"code": "0LA1XTorX9Urd0aLwHqpx5KHZbjOAAHS",
	"client_secret": "{{OAUTH_CLIENT_SECRET}}"
}
```

Then you'll receive back a JSON response like below:

```
{
	"access_token": "{{ACCESS_TOKEN}}",
	"refresh_token": "{{REFRESH_TOKEN}}",
	"scope": "self:read",
    "expires_at": "2016-12-19T09:48:21.582Z",
    "refresh_token_expires_at": "2017-02-19T09:48:21.620Z",
    "token_type": "Bearer"
}
```

### Client Credentials
This allows you to get an access token directly using your client credentials (client id and client secret) so you can directly use the API to access authenticated routes with your own user.

**NOTE:** In order to access the /token route for this grant type, you must provided your client ID and client secret as basic authentication header when making the request like below:

```
Authentication: Basic ${base64encode(${clientID}:${clientSecret}}
```

#### Example
First make a POST request to `{{{OAUTH_BASE_URL}}}/token` with the following JSON:

```
{
	"client_id": "{{OAUTH_CLIENT_ID}}",
	"grant_type": "client_credentials",
	"client_secret": "{{OAUTH_CLIENT_SECRET}}",
	"scope": "{{SCOPES}}"
}
```

Then you'll receive back a JSON response like below:

```
{
	"access_token": "{{ACCESS_TOKEN}}",
	"refresh_token": "{{REFRESH_TOKEN}}",
	"scope": "self:read",
    "expires_at": "2016-12-19T09:48:21.582Z",
    "refresh_token_expires_at": "2017-02-19T09:48:21.620Z",
    "token_type": "Bearer"
}
```

### Refresh Token
This allows you to refresh a users access token without needing them to reauthorize.

#### Example
First make a POST request to `{{{OAUTH_BASE_URL}}}/token` with the following JSON:

```
{
	"client_id": "{{OAUTH_CLIENT_ID}}",
	"grant_type": "refresh_token",
	"client_secret": "{{OAUTH_CLIENT_SECRET}}",
	"refresh_token": "{{REFRESH_TOKEN}}",
	"scope": "{{SCOPES}}"
}
```

Then you'll receive back a JSON response like below:

```
{
	"access_token": "{{ACCESS_TOKEN}}",
	"refresh_token": "{{REFRESH_TOKEN}}",
    "scope": "self:read",
    "expires_at": "2016-12-19T09:48:21.582Z",
    "refresh_token_expires_at": "2017-02-19T09:48:21.620Z",
    "token_type": "Bearer"
}
```

# Scopes
Scopes allow for OAuth applications to specify what permissions they need in order to function.

When authorizing a user with OAuth, applications must specify the scope/s they wish to be able to access. Different scopes give different access to the API.

## Scopes Available
| Scope | Description |
|-------------|-------------:|
| self:read | This allows reading details about the authenticated user (except password) |
| self:write | This allows changing details about the authenticated user |
| admin:read | This allows reading all system information as an admin |
| admin:write | This allows changing all system information as an admin |