---
title: /v1/users
---

These routes interact with users on the system.

# Contents
<!-- toc -->

# GET /v1/users
This will get all the users in the system.

## Authentication
| Role/s | Scope/s |
|:------:|:-------:|
| admin | admin:read |

## Responses
This will return a [paginated](/docs/paginated) array of [user](/docs/models/user) models.

# GET /v1/users/{id}
This will get a single user in the system.

## Authentication
| Role/s | Scope/s |
|:------:|:-------:|
| admin | admin:read |

## Responses
This will return a [user](/docs/models/user) model.

# POST /v1/users
This will create a new user in the system.

## Authentication
| Role/s | Scope/s |
|:------:|:-------:|
| admin | admin:write |

## Responses
This will return a [user](/docs/models/user) model for the newly created user.

# PUT /v1/users/{id}
This will update the information for a user in the system.

## Authentication
| Role/s | Scope/s |
|:------:|:-------:|
| admin | admin:write |

## Responses
This will return the [user](/docs/models/user) model of the updated user.

# DELETE /v1/users/{id}
This will delete a user in the system.

## Authentication
| Role/s | Scope/s |
|:------:|:-------:|
| admin | admin:write |

## Responses
When successful, this route will return a [204](/docs/response-codes#204) response code with no content.