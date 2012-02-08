Hoard API
=========

Authentication
--------------
The authentication process is based on the 
`OAuth 2.0 v2-23 <http://tools.ietf.org/html/draft-ietf-oauth-v2-23>`_
specification draft.

The API supports a user-agent-based application authentication using an implicit
grant(`4.2 <http://tools.ietf.org/html/draft-ietf-oauth-v2-23#section-4.2>`_),
suitable for applications implemented in a browser.

Flow
~~~~
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
~~~~~~~~~~~~~~~~
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

