from rest_framework.permissions import BasePermission


def user_roles(user) -> set[str]:
    if not user or not user.is_authenticated:
        return set()
    return set(user.effective_roles)


def has_any_role(*roles: str):
    """Permission factory: authenticated AND holds at least one of `roles`."""

    class _HasAnyRole(BasePermission):
        message = "You do not have the required role for this action."

        def has_permission(self, request, view):
            return bool(user_roles(request.user) & set(roles))

    _HasAnyRole.__name__ = "HasAnyRole_" + "_".join(roles)
    return _HasAnyRole
