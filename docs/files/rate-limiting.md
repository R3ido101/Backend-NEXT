---
title: Rate Limiting
---

All of ATLaunchers API endpoints are rate limited. This means that you can only send a certain number of requests to the API before being rate limited and not allowed to send any more.

# Contents
<!-- toc -->

# Limit
The current limit is 60 requests per 60 seconds. This limit is imposed on all calls made including OAuth and Login/Logout calls.

# Headers
You can view the current number of requests you've used as well as the limit by checking the headers sent back from each API call.

There are 2 relevant headers:

 - X-RateLimit-Limit - This is the number of requests per second you can make
 - X-RateLimit-Remaining - This is the number of requests you have left before being rate limited

# Error response
When you've exceeded your rate limit the API will return a 429 response code.

# Excess usage
Continually exceeding the rate limit without slowing down can result in your IP being blocked from our servers for abuse.

# Changes to rate limiting
We reserve the right to change the rate limiting, number of requests and/or time period, at any time without notice.

Please ensure you take into account the headers sent back from requests as well as checking for 429 response codes when making something which consumes this API to ensure you don't go over the rate
limit.