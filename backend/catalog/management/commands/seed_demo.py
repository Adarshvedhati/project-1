"""Load the demo corpus (the same content the frontend mocks used) plus,
optionally, demo accounts and workflow data.

    python manage.py seed_demo                 # catalog only (safe)
    python manage.py seed_demo --demo-users    # + demo accounts, submissions, reviews, analytics
"""
import os
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import AuditLog, Institution, User
from catalog.models import Article, Book, CaseStudy, Chapter, Journal
from engagement.models import Alert, Bookmark, Subscription, UsageStat
from workflow.models import ReviewAssignment, Submission

JOURNALS = [
    ("j-applied-linguistics", "Journal of Applied Linguistics & Pedagogy", "2451-0982",
     "Language teaching, second-language acquisition and curriculum design.", "Education", "subscription", "Vol. 14, Issue 3"),
    ("j-sustainable-operations", "Sustainable Operations & Supply Chains", "2667-1145",
     "Operations research with an emphasis on sustainability and circular supply chains.", "Business & Management", "open_access", "Vol. 8, Issue 2"),
    ("j-digital-health", "Digital Health Systems Review", "2789-3301",
     "Health informatics, clinical data systems and digital-care delivery.", "Health & Medicine", "subscription", "Vol. 5, Issue 1"),
    ("j-materials-eng", "Advances in Materials Engineering", "2334-8827",
     "Materials science, structural testing and manufacturing processes.", "Engineering", "free_preview", "Vol. 21, Issue 4"),
]

ARTICLES = [
    ("a-1001", "j-applied-linguistics", "Task-Based Instruction and Learner Autonomy in Hybrid Classrooms",
     ["R. Fernandes", "M. Okonkwo"],
     "A mixed-methods study of task-based language teaching across twelve hybrid classrooms, examining its effect on learner autonomy.",
     "Education", "2026-06-12", "open_access", "10.5555/jalp.2026.1001", 4,
     ["language teaching", "learner autonomy", "hybrid learning"], True),
    ("a-1002", "j-sustainable-operations", "Circular Inventory Models for Regional Food Supply Chains", ["T. Andersson"],
     "Proposes a circular inventory model reducing waste in regional food distribution networks, validated against three case regions.",
     "Business & Management", "2026-04-02", "open_access", "10.5555/sosc.2026.1002", 11,
     ["circular economy", "inventory management", "food supply chains"], True),
    ("a-1003", "j-digital-health", "Interoperability Gaps in Regional Electronic Health Record Systems",
     ["S. Kapoor", "L. Bianchi", "H. Weiss"],
     "Surveys interoperability barriers across five regional EHR deployments and proposes a shared metadata schema.",
     "Health & Medicine", "2026-02-20", "subscription", "10.5555/dhsr.2026.1003", 7,
     ["EHR", "interoperability", "health informatics"], False),
]

BOOKS = [
    ("b-2001", "Foundations of Regional Innovation Policy", ["E. Moreau", "D. Osei"],
     "A graduate-level text on how regional governments design and evaluate innovation-policy instruments.",
     "Public Policy", "2025-11-04", "subscription", "978-1-2345-6789-0",
     [("Why Regions, Not Just Nations", ["E. Moreau"]), ("Instruments for Cluster Formation", ["D. Osei"]),
      ("Measuring Policy Impact", ["E. Moreau", "D. Osei"])]),
    ("b-2002", "Open Data Governance for Public Institutions", ["N. Petrova"],
     "Practical governance frameworks for institutions publishing open research and civic data.",
     "Information Science", "2026-01-18", "open_access", "978-1-2345-6790-6",
     [("Principles of Open Data Governance", ["N. Petrova"]), ("Licensing and Attribution", ["N. Petrova"])]),
]

CASE_STUDIES = [
    ("cs-3001", "Scaling a Campus Food Bank: Logistics Under Constraint", ["J. Alvarez"],
     "A teaching case on last-mile logistics planning for a university food bank facing a sudden demand surge.",
     "Operations Management", "2025-09-30", "free_preview",
     ["Apply capacity-planning frameworks to a resource-constrained nonprofit",
      "Evaluate trade-offs between centralized and distributed distribution"], True),
    ("cs-3002", "Negotiating Data-Sharing Agreements Between Rival Hospitals", ["P. Nakamura", "C. Dubois"],
     "Explores the governance and trust issues that arise when two competing hospital systems must share patient data.",
     "Health & Medicine", "2026-03-11", "subscription",
     ["Identify governance mechanisms that enable inter-organizational data sharing",
      "Assess ethical trade-offs in healthcare data negotiations"], True),
]


class Command(BaseCommand):
    help = "Seed demo catalog content (and optionally demo users + workflow data)."

    def add_arguments(self, parser):
        parser.add_argument("--demo-users", action="store_true", help="Also create demo accounts and workflow data.")
        parser.add_argument("--password", default=os.environ.get("DEMO_PASSWORD", ""), help="Password for demo accounts.")

    @transaction.atomic
    def handle(self, *args, **opts):
        self.seed_catalog()
        self.stdout.write(self.style.SUCCESS("Catalog seeded."))
        if opts["demo_users"]:
            password = opts["password"] or "Meridian#Demo2026"
            self.seed_users_and_workflow(password)
            self.stdout.write(self.style.SUCCESS(
                f"Demo users seeded (password: {password}): admin@ editor@ reviewer@ author@ librarian@ researcher@ meridian.test"))
            self.stdout.write(self.style.WARNING("Do not enable demo users on a public production site."))

    # ------------------------------------------------------------------ catalog
    def seed_catalog(self):
        for jid, title, issn, scope, subject, access, volume in JOURNALS:
            Journal.objects.update_or_create(id=jid, defaults=dict(
                title=title, issn=issn, scope=scope, subject=subject, access_type=access,
                latest_volume=volume, established=date(2026, 1, 1)))
        for aid, jid, title, authors, summary, subject, pub, access, doi, cites, kws, full in ARTICLES:
            Article.objects.update_or_create(id=aid, defaults=dict(
                journal_id=jid, title=title, authors=authors, summary=summary, subject=subject,
                publication_date=date.fromisoformat(pub), access_type=access, doi=doi, citation_count=cites,
                keywords=kws, full_text_available=full))
        for bid, title, authors, summary, subject, pub, access, isbn, chapters in BOOKS:
            Book.objects.update_or_create(id=bid, defaults=dict(
                title=title, authors=authors, summary=summary, subject=subject,
                publication_date=date.fromisoformat(pub), access_type=access, isbn=isbn))
            for pos, (ctitle, cauthors) in enumerate(chapters, start=1):
                Chapter.objects.update_or_create(id=f"{bid}-c{pos}", defaults=dict(
                    book_id=bid, title=ctitle, authors=cauthors, position=pos))
        for cid, title, authors, summary, subject, pub, access, objectives, instructor in CASE_STUDIES:
            CaseStudy.objects.update_or_create(id=cid, defaults=dict(
                title=title, authors=authors, summary=summary, subject=subject,
                publication_date=date.fromisoformat(pub), access_type=access,
                learning_objectives=objectives, instructor_resources_available=instructor))

    # ---------------------------------------------------------- users/workflow
    def _user(self, email, first, last, roles, password, **extra):
        user, _ = User.objects.get_or_create(email=email, defaults=dict(first_name=first, last_name=last, roles=roles, **extra))
        user.roles = roles
        user.set_password(password)
        user.save()
        return user

    def seed_users_and_workflow(self, password):
        library, _ = Institution.objects.get_or_create(name="Meridian University Library", defaults={"type": "library", "country": "IN"})
        admin = self._user("admin@meridian.test", "Ada", "Admin", ["admin"], password, is_staff=True, is_superuser=True)
        editor = self._user("editor@meridian.test", "Amara", "Chen", ["editor"], password)
        reviewer = self._user("reviewer@meridian.test", "P.", "Nakamura", ["reviewer"], password)
        author = self._user("author@meridian.test", "R.", "Fernandes", ["researcher", "author"], password)
        self._user("librarian@meridian.test", "Lena", "Librarian", ["librarian"], password, institution=library)
        self._user("researcher@meridian.test", "Rhea", "Reader", ["researcher"], password)

        now = timezone.now()

        def submission(sid, author_user, title, ctype, journal_id, status, submitted_days, stage_days, names="", decision=""):
            sub, _ = Submission.objects.update_or_create(id=sid, defaults=dict(
                author=author_user, title=title, content_type=ctype, journal_id=journal_id, status=status,
                author_names=names, last_decision=decision, abstract=title,
                submitted_at=now - timedelta(days=submitted_days), status_changed_at=now - timedelta(days=stage_days)))
            Submission.objects.filter(pk=sid).update(updated_at=now - timedelta(days=stage_days))
            return sub

        submission("sub-501", author, "Adaptive Assessment Design in Large Enrollment Courses", "article",
                   "j-applied-linguistics", "under_review", 92, 48, names="R. Fernandes")
        submission("sub-502", author, "Modeling Reverse Logistics for Regional Retailers", "article",
                   "j-sustainable-operations", "revision_requested", 131, 29, names="R. Fernandes")
        submission("sub-503", author, "Governing Shared Clinical Datasets", "case_study", None, "draft", 21, 21, names="R. Fernandes")
        submission("sub-441", author, "Task-Based Instruction and Learner Autonomy in Hybrid Classrooms — Revision", "article",
                   "j-applied-linguistics", "under_review", 40, 6, names="R. Fernandes")
        submission("sub-455", author, "Predictive Maintenance in Mid-Size Manufacturing Plants", "article",
                   "j-materials-eng", "submitted", 2, 2, names="K. Novak")
        submission("sub-460", author, "Learner Feedback Loops in Adaptive Assessment Platforms", "article",
                   "j-applied-linguistics", "accepted", 60, 0, names="A. Haddad", decision="accept")

        today = timezone.localdate()
        for rid, sid, due, status in [("rev-701", "sub-441", today + timedelta(days=14), "accepted"),
                                      ("rev-702", "sub-455", today + timedelta(days=28), "invited")]:
            ReviewAssignment.objects.update_or_create(id=rid, defaults=dict(
                submission_id=sid, reviewer=reviewer, due_date=due, status=status))

        Alert.objects.filter(user__in=[author, reviewer]).delete()
        Alert.objects.create(user=author, message="Your submission received a revision request.", created_at=now - timedelta(days=29))
        Alert.objects.create(user=author, message="A new issue of Journal of Applied Linguistics & Pedagogy is available.",
                             created_at=now - timedelta(days=42), read=True)
        Alert.objects.create(user=reviewer, message="You were invited to review “Predictive Maintenance in Mid-Size Manufacturing Plants”.")
        Bookmark.objects.get_or_create(user=author, content_type="article", content_id="a-1002",
                                       defaults={"title": "Circular Inventory Models for Regional Food Supply Chains"})

        for jid, renewal in [("j-applied-linguistics", date(2027, 1, 15)), ("j-digital-health", date(2026, 12, 1))]:
            Subscription.objects.update_or_create(institution=library, journal_id=jid, defaults={"plan": "full-text", "renewal_date": renewal})
        for month, downloads in [(4, 1120), (5, 1340), (6, 980), (7, 1510), (8, 1725)]:
            UsageStat.objects.update_or_create(institution=library, month=date(2026, month, 1), defaults={"downloads": downloads})

        if not AuditLog.objects.exists():
            for actor, action, target, days in [(editor, "Recorded editorial decision (accept)", "sub-460", 19),
                                                (None, "Published article", "a-1002", 21),
                                                (admin, "Updated book metadata", "b-2002", 23)]:
                AuditLog.objects.create(actor=actor, actor_name=actor.display_name if actor else "System",
                                        action=action, target=target, timestamp=now - timedelta(days=days))
