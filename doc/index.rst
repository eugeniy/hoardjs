=========
Hoard API
=========

Authentication
==============
The authentication process is based on the
`OAuth 2.0 v2-23 <http://tools.ietf.org/html/draft-ietf-oauth-v2-23>`_
specification draft.

The API supports a user-agent-based application authentication using an implicit
grant (`4.2 <http://tools.ietf.org/html/draft-ietf-oauth-v2-23#section-4.2>`_),
suitable for applications implemented in a browser. You must authenticate all
requests.

Flow
----
::

    https://api.example.com/oauth?response_type=token&client_id=MY_ID&redirect_uri=MY_URL

`MY_ID` is the client id registered with the authentication server. `MY_URL` is
an url to which a user will be redirected after the authentication, it must be
registered with the provided client id.

::

   http://MY_URL#access_token=493ab73b26bb4b1d&token_type=bearer&expires_in=3600

Access token is passed in the fragment and is not visible to the server, use it
to make subsequent requests to the API.

Request Examples
----------------
::

    DELETE /resources/42 HTTP/1.1
    Host: api.example.com
    Date: Wed, 08 Feb 2012 18:47:54 GMT
    Authorization: Bearer 493ab73b26bb4b1d

::

    GET /resources HTTP/1.1
    Host: api.example.com
    Accept: application/json
    Date: Wed, 08 Feb 2012 18:48:23 GMT
    Authorization: Bearer 493ab73b26bb4b1d

Errors
======
Hoard uses following HTTP status codes to indicate a status of a request::

    200 OK - Request successful
    400 BAD REQUEST - An error in the request, generally missing required fields
    401 NOT AUTHORIZED - Bad or missing API client key or access token
    403 FORBIDDEN - Don't have permission to perform the request
    404 NOT FOUND - Request on a missing item
    500, 502, 503 - Server errors

Request errors (4XX) return a JSON object.


Resources
=========
List all resources
------------------
::

    GET https://api.example.com/resources


Reservations
============
List all reservations
---------------------
::

    GET https://api.example.com/reservations


Create a new reservation
------------------------
::

    POST https://api.example.com/reservation/42

