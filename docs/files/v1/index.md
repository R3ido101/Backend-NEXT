---
title: /v1
---

This is the documentation for version 1 of the api.

# Contents
 - [Self](/docs/v1/self)
 - [Users](/docs/v1/users)
 
# /v1
This will return the current information for the API as well as information about if your request is authenticated and if so, the details about the user/token.

```json
{
  "version": "0.1.0-alpha.1",
  "authenticated": true,
  "token": {
    "scopes": [
      "admin:read",
      "admin:write",
      "self:read",
      "self:write"
    ],
    "created_at": "2016-11-27T01:01:59.857Z",
    "expires_at": "2016-12-27T01:01:59.856Z"
  },
  "user": {
    "id": 1,
    "username": "admin",
    "email": "test@example.com",
    "must_change_password": false,
    "is_banned": false,
    "ban_reason": null,
    "created_at": "2016-11-27 11:52:24",
    "updated_at": null,
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Can administer the system.",
        "created_by": 1,
        "created_at": "2016-11-27 11:52:24",
        "updated_at": null
      }
    ]
  }
}
```

If not authenticated with [OAuth](/docs/authentication) then the `authenticated` property will be false and no `token` or `user` property will be present.