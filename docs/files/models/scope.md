---
title: Scope Model
---

Scope model contains information about the scopes in the system available for OAuth.

# Contents
<!-- toc -->

# Structure
## name
The name of the scope.

**Type:** string

## description
The description of the scope.

**Type:** string

# Example
```json
  {
    "name": "self:read",
    "description": "Read own user credentials (except password)."
  }
```