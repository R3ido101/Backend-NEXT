---
title: User Model
---

User model contains information about users in the system.

# Contents
<!-- toc -->

# Structure
## id
A unique ID used to identify a specific user.

**Type:** number

## username
The username of the user.

**Type:** string

## email
The email of the user.

**Type:** string

## must_change_password
If the user must change their password on next login or not.

**Type:** boolean

## is_banned
If the user has been banned from the system.

**Type:** boolean

## ban_reason
The reason for the user being banned.

**Type:** string|null

## is_verified
If the user has verified their account.

When users sign up, a unique code is generated and sent to their email as a link that they must click in order to activate and use their account.

**Type:** boolean

## verification_code
The code used to verify a users account.

**Type:** string|null

## tfa_secret
The secret used to generate and verify using two factor authentication.

**Type:** string|null

## created_at
The datetime that the account was created at (all datetimes are in UTC).

**Type:** string

## updated_at
The datetime that the account was last updated at (all datetimes are in UTC).

**Type:** string|null

## banned_at
The datetime that the account was banned at (all datetimes are in UTC).

**Type:** string|null

## verified_at
The datetime that the account was verified at (all datetimes are in UTC).

**Type:** string|null

# Example
```json
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "must_change_password": false,
    "is_banned": false,
    "ban_reason": null,
    "is_verified": false,
    "verification_code": null,
    "tfa_secret": null,
    "created_at": "2016-12-16 21:06:22",
    "updated_at": null,
    "banned_at": null,
    "verified_at": null
  }
```