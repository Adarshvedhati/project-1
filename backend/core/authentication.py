from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """The frontend sends `Authorization: Bearer <token>`."""

    keyword = "Bearer"
