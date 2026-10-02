"""Human-friendly string primary keys ("a-1001", "sub-4821") matching the
ids used by the frontend mocks."""
import secrets


def _gen(prefix: str) -> str:
    return f"{prefix}-{secrets.randbelow(9_000_000) + 1_000_000}"


def journal_id() -> str:
    return _gen("j")


def article_id() -> str:
    return _gen("a")


def book_id() -> str:
    return _gen("b")


def case_study_id() -> str:
    return _gen("cs")


def submission_id() -> str:
    return _gen("sub")


def review_id() -> str:
    return _gen("rev")
