# """Django settings for the Meridian academic publishing backend.

# Everything environment-specific is read from environment variables so the
# same image runs locally, in Docker and on a PaaS (see ../.env.example).
# """
# import os
# from pathlib import Path

# import dj_database_url
# from django.core.exceptions import ImproperlyConfigured

# BASE_DIR = Path(__file__).resolve().parent.parent
# SECRET_KEY = 'django-insecure-p9)wz2u$2jkpw7z5v476=4pokerns*s56jbz3ilmn+2uc1b9ts'


# def _load_dotenv(path: Path) -> None:
#     """Tiny .env loader (no extra dependency). Real environment variables win."""
#     if not path.is_file():
#         return
#     for raw in path.read_text(encoding="utf-8-sig").splitlines():
#         line = raw.strip()
#         if not line or line.startswith("#") or "=" not in line:
#             continue
#         key, _, value = line.partition("=")
#         value = value.strip().strip('"').strip("'")
#         os.environ.setdefault(key.strip(), value)


# _load_dotenv(BASE_DIR / ".env")
# DJANGO_DEBUG=True


# def env_bool(name: str, default: bool = False) -> bool:
#     return os.environ.get(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


# def env_list(name: str, default: str = "") -> list[str]:
#     return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


# DEBUG = env_bool("DJANGO_DEBUG", False)

# SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
# if not SECRET_KEY:
#     if DEBUG:
#         SECRET_KEY = "insecure-dev-key-do-not-use-in-production"
#     else:
#         raise ImproperlyConfigured(
#             "Set DJANGO_SECRET_KEY, or for local development create backend/.env containing the line "
#             "DJANGO_DEBUG=true (copy backend/.env.example)."
#         )

# ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
# if os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
#     ALLOWED_HOSTS.append(os.environ["RENDER_EXTERNAL_HOSTNAME"])

# CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS")
# # PaaS conveniences: trust the platform-provided public hostname automatically.
# if os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
#     CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['RENDER_EXTERNAL_HOSTNAME']}")
# if os.environ.get("RAILWAY_PUBLIC_DOMAIN"):
#     ALLOWED_HOSTS.append(os.environ["RAILWAY_PUBLIC_DOMAIN"])
#     CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['RAILWAY_PUBLIC_DOMAIN']}")

# INSTALLED_APPS = [
#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",
#     "rest_framework",
#     "rest_framework.authtoken",
#     "corsheaders",
#     "core",
#     "accounts",
#     "catalog",
#     "workflow",
#     "engagement",
# ]

# MIDDLEWARE = [
#     "django.middleware.security.SecurityMiddleware",
#     "whitenoise.middleware.WhiteNoiseMiddleware",
#     "corsheaders.middleware.CorsMiddleware",
#     "django.contrib.sessions.middleware.SessionMiddleware",
#     "django.middleware.common.CommonMiddleware",
#     "django.middleware.csrf.CsrfViewMiddleware",
#     "django.contrib.auth.middleware.AuthenticationMiddleware",
#     "django.contrib.messages.middleware.MessageMiddleware",
#     "django.middleware.clickjacking.XFrameOptionsMiddleware",
# ]

# ROOT_URLCONF = "config.urls"
# WSGI_APPLICATION = "config.wsgi.application"

# TEMPLATES = [
#     {
#         "BACKEND": "django.template.backends.django.DjangoTemplates",
#         "DIRS": [],
#         "APP_DIRS": True,
#         "OPTIONS": {
#             "context_processors": [
#                 "django.template.context_processors.request",
#                 "django.contrib.auth.context_processors.auth",
#                 "django.contrib.messages.context_processors.messages",
#             ],
#         },
#     },
# ]

# DATABASES = {
#     "default": dj_database_url.config(
#         default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
#         conn_max_age=600,
#     )
# }

# AUTH_USER_MODEL = "accounts.User"

# AUTH_PASSWORD_VALIDATORS = [
#     {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
#     {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
#     {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
#     {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
# ]

# LANGUAGE_CODE = "en-us"
# TIME_ZONE = "UTC"
# USE_I18N = True
# USE_TZ = True

# DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# # ---------------------------------------------------------------- static / SPA
# STATIC_URL = "/static/"
# STATIC_ROOT = BASE_DIR / "staticfiles"

# STORAGES = {
#     "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
#     "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
# }

# # The built React app (frontend/dist). WhiteNoise serves its files from the
# # site root (/assets/*, /favicon.svg, ...); core.views.spa serves index.html
# # for every client-side route.
# FRONTEND_DIST = Path(os.environ.get("FRONTEND_DIST", BASE_DIR / "frontend_dist"))
# if FRONTEND_DIST.is_dir():
#     WHITENOISE_ROOT = FRONTEND_DIST

# # ------------------------------------------------------------------------ CORS
# # Only needed when the Vite dev server (another origin) calls the API.
# CORS_ALLOWED_ORIGINS = env_list(
#     "DJANGO_CORS_ALLOWED_ORIGINS",
#     "http://localhost:5173,http://127.0.0.1:5173" if DEBUG else "",
# )

# # ------------------------------------------------------------------------- DRF
# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": ["core.authentication.BearerTokenAuthentication"],
#     "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
#     "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
#     "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.ScopedRateThrottle"],
#     "DEFAULT_THROTTLE_RATES": {"auth": os.environ.get("AUTH_THROTTLE_RATE", "30/min")},
#     "EXCEPTION_HANDLER": "core.exceptions.api_exception_handler",
#     "UNAUTHENTICATED_USER": "django.contrib.auth.models.AnonymousUser",
# }

# # -------------------------------------------------------------------- security
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# SECURE_SSL = env_bool("DJANGO_SECURE_SSL", False)
# if SECURE_SSL and not DEBUG:
#     SECURE_SSL_REDIRECT = True
#     SECURE_REDIRECT_EXEMPT = [r"^healthz$"]  # platform health checks arrive over plain HTTP
#     SESSION_COOKIE_SECURE = True
#     CSRF_COOKIE_SECURE = True
#     SECURE_HSTS_SECONDS = 31536000
#     SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = "DENY"

# # ------------------------------------------------------------------------ misc
# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {"console": {"class": "logging.StreamHandler"}},
#     "root": {"handlers": ["console"], "level": os.environ.get("LOG_LEVEL", "INFO")},
# }

"""Django settings for the Meridian academic publishing backend.

Everything environment-specific is read from environment variables so the
same image runs locally, in Docker and on a PaaS (see ../.env.example).
"""
import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def _load_dotenv(path: Path) -> None:
    """Tiny .env loader (no extra dependency). Real environment variables win."""
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key.strip(), value)


_load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


DEBUG = env_bool("DJANGO_DEBUG", False)

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "insecure-dev-key-do-not-use-in-production"
    else:
        raise ImproperlyConfigured(
            "Set DJANGO_SECRET_KEY, or for local development create backend/.env containing the line "
            "DJANGO_DEBUG=true (copy backend/.env.example)."
        )

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
if os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
    ALLOWED_HOSTS.append(os.environ["RENDER_EXTERNAL_HOSTNAME"])

CSRF_TRUSTED_ORIGINS = env_list("DJANGO_CSRF_TRUSTED_ORIGINS")
# PaaS conveniences: trust the platform-provided public hostname automatically.
if os.environ.get("RENDER_EXTERNAL_HOSTNAME"):
    CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['RENDER_EXTERNAL_HOSTNAME']}")
if os.environ.get("RAILWAY_PUBLIC_DOMAIN"):
    ALLOWED_HOSTS.append(os.environ["RAILWAY_PUBLIC_DOMAIN"])
    CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['RAILWAY_PUBLIC_DOMAIN']}")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "core",
    "accounts",
    "catalog",
    "workflow",
    "engagement",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------- static / SPA
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# The built React app (frontend/dist). WhiteNoise serves its files from the
# site root (/assets/*, /favicon.svg, ...); core.views.spa serves index.html
# for every client-side route.
FRONTEND_DIST = Path(os.environ.get("FRONTEND_DIST", BASE_DIR / "frontend_dist"))
if FRONTEND_DIST.is_dir():
    WHITENOISE_ROOT = FRONTEND_DIST

# ------------------------------------------------------------------------ CORS
# Only needed when the Vite dev server (another origin) calls the API.
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173" if DEBUG else "",
)

# ------------------------------------------------------------------------- DRF
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["core.authentication.BearerTokenAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.ScopedRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"auth": os.environ.get("AUTH_THROTTLE_RATE", "30/min")},
    "EXCEPTION_HANDLER": "core.exceptions.api_exception_handler",
    "UNAUTHENTICATED_USER": "django.contrib.auth.models.AnonymousUser",
}

# -------------------------------------------------------------------- security
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL = env_bool("DJANGO_SECURE_SSL", False)
if SECURE_SSL and not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_REDIRECT_EXEMPT = [r"^healthz$"]  # platform health checks arrive over plain HTTP
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# ------------------------------------------------------------------------ misc
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": os.environ.get("LOG_LEVEL", "INFO")},
}