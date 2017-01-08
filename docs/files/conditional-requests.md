---
title: Conditional Requests
---

This API allows for conditional requests to be made.

All responses from the API return a weak typed ETag header. You can use this ETag header to send conditional requests to the API.

# If-None-Match
By adding in a `If-None-Match` header with an ETag, the API will return a 304 response code if the content of the API call hasn't been modified and the ETag still matches.