from rest_framework.exceptions import ValidationError
from rest_framework.views import exception_handler


def _flatten(detail) -> str:
    if isinstance(detail, dict):
        parts = []
        for key, value in detail.items():
            text = _flatten(value)
            parts.append(text if key in {"detail", "non_field_errors"} else f"{key}: {text}")
        return " ".join(parts)
    if isinstance(detail, (list, tuple)):
        return " ".join(_flatten(item) for item in detail)
    return str(detail)


def api_exception_handler(exc, context):
    """Always answer with {"detail": "<human readable message>"} so the
    frontend's ApiError shows something useful."""
    response = exception_handler(exc, context)
    if response is not None:
        if isinstance(exc, ValidationError):
            response.data = {"detail": _flatten(response.data), "errors": response.data}
        elif not (isinstance(response.data, dict) and "detail" in response.data):
            response.data = {"detail": _flatten(response.data)}
    return response
