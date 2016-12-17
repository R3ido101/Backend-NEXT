---
title: /v1/users
---

These routes interact with users on the system.

In order to access any of these routes, you need the `admin` [role](/docs/roles).

# Contents
<!-- toc -->

# GET /v1/users
This will get all the users in the system.

## Scope
This route requires the `admin:read` [scope](/docs/scope).

## Return type
This will return a [paginated](/docs/paginated) array of [user models](/docs/models/user).

# GET /v1/users/{id}
This will get a single user in the system.

## Scope
This route requires the `admin:read` [scope](/docs/scope).

# POST /v1/users
This will create a new user in the system.

## Scope
This route requires the `admin:write` [scope](/docs/scope).

# PUT /v1/users/{id}
This will update the information for a user in the system.

## Scope
This route requires the `admin:write` [scope](/docs/scope).

# DELETE /v1/users/{id}
This will delete a user in the system.

## Scope
This route requires the `admin:write` [scope](/docs/scope).

## Responses
When successful, this route will return a [204](/docs/response-codes#204) response code with no content.