from functools import lru_cache

from django.conf import settings
from django.http import HttpResponse, JsonResponse


def health(request):
    return JsonResponse({"status": "ok"})


@lru_cache(maxsize=1)
def _index_html() -> bytes | None:
    index = settings.FRONTEND_DIST / "index.html"
    return index.read_bytes() if index.is_file() else None


def spa(request):
    """Serve the React app for any non-API path (client-side routing)."""
    html = _index_html()
    if html is None:
        return JsonResponse(
            {"detail": "Frontend build not found. Build it (npm run build) and set FRONTEND_DIST, or use the Docker image."},
            status=404,
        )
    return HttpResponse(html, content_type="text/html; charset=utf-8")
