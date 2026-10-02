from django.core.management import call_command
from rest_framework.test import APITestCase

PW = "Meridian#Demo2026"
API = "/api/v1"


class ApiTestBase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_demo", "--demo-users", verbosity=0)

    def login(self, who):
        res = self.client.post(f"{API}/auth/login", {"email": f"{who}@meridian.test", "password": PW}, format="json")
        self.assertEqual(res.status_code, 200, res.content)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['token']}")
        return res.data


class AuthTests(ApiTestBase):
    def test_register_login_me(self):
        res = self.client.post(f"{API}/auth/register", {
            "email": "New.User@Example.com", "password": "S3cure-pass-phrase", "firstName": "New",
            "lastName": "User", "role": "author"}, format="json")
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(res.data["user"]["email"], "new.user@example.com")
        self.assertEqual(res.data["user"]["roles"], ["researcher", "author"])
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['token']}")
        me = self.client.get(f"{API}/auth/me")
        self.assertEqual(me.data["firstName"], "New")

    def test_register_cannot_self_assign_admin(self):
        res = self.client.post(f"{API}/auth/register", {
            "email": "x@example.com", "password": "S3cure-pass-phrase", "firstName": "X", "lastName": "Y", "role": "admin"},
            format="json")
        self.assertEqual(res.status_code, 400)

    def test_duplicate_and_weak_password(self):
        dup = self.client.post(f"{API}/auth/register", {
            "email": "author@meridian.test", "password": "S3cure-pass-phrase", "firstName": "A", "lastName": "B"}, format="json")
        self.assertEqual(dup.status_code, 400)
        self.assertIn("already exists", dup.data["detail"])
        weak = self.client.post(f"{API}/auth/register", {
            "email": "weak@example.com", "password": "12345678", "firstName": "A", "lastName": "B"}, format="json")
        self.assertEqual(weak.status_code, 400)

    def test_bad_login(self):
        res = self.client.post(f"{API}/auth/login", {"email": "author@meridian.test", "password": "nope"}, format="json")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.data["detail"], "Invalid email or password.")

    def test_me_requires_auth(self):
        self.assertEqual(self.client.get(f"{API}/auth/me").status_code, 401)


class CatalogTests(ApiTestBase):
    def test_public_lists_match_frontend_shapes(self):
        journals = self.client.get(f"{API}/journals").data
        self.assertEqual(len(journals), 4)
        self.assertEqual(set(journals[0]), {"id", "title", "issn", "scope", "subject", "accessType", "latestVolume"})
        art = self.client.get(f"{API}/articles/a-1001").data
        for key in ["contentType", "journalId", "keywords", "fullTextAvailable", "parentTitle", "publicationDate", "citationCount"]:
            self.assertIn(key, art)
        self.assertEqual(art["contentType"], "article")
        book = self.client.get(f"{API}/books/b-2001").data
        self.assertEqual(len(book["chapters"]), 3)
        cs = self.client.get(f"{API}/case-studies/cs-3001").data
        self.assertTrue(cs["instructorResourcesAvailable"])
        self.assertEqual(self.client.get(f"{API}/articles/nope").status_code, 404)

    def test_articles_filter_and_related(self):
        res = self.client.get(f"{API}/articles", {"journalId": "j-digital-health"}).data
        self.assertEqual([a["id"] for a in res], ["a-1003"])
        related = self.client.get(f"{API}/articles/a-1001/related").data
        self.assertTrue(related and all(a["id"] != "a-1001" for a in related))

    def test_search(self):
        res = self.client.get(f"{API}/search", {"q": "supply chains"}).data
        titles = [i["title"] for i in res["items"]]
        self.assertIn("Circular Inventory Models for Regional Food Supply Chains", titles)
        self.assertIn("Sustainable Operations & Supply Chains", titles)  # the journal itself
        self.assertEqual(res["total"], len(res["items"]))
        everything = self.client.get(f"{API}/search").data
        self.assertEqual(everything["total"], 4 + 3 + 2 + 2)
        books = self.client.get(f"{API}/search", {"contentType": "book"}).data
        self.assertTrue(all(i["contentType"] == "book" for i in books["items"]))
        oa = self.client.get(f"{API}/search", {"accessType": "open_access", "contentType": "article"}).data
        self.assertEqual({i["id"] for i in oa["items"]}, {"a-1001", "a-1002"})
        by_author = self.client.get(f"{API}/search", {"q": "Fernandes"}).data
        self.assertEqual(by_author["items"][0]["id"], "a-1001")
        paged = self.client.get(f"{API}/search", {"pageSize": 5, "page": 2}).data
        self.assertEqual(len(paged["items"]), 5)
        self.assertEqual(paged["total"], 11)
        last = self.client.get(f"{API}/search", {"pageSize": 5, "page": 3}).data
        self.assertEqual(len(last["items"]), 1)


class WorkflowTests(ApiTestBase):
    def test_author_submission_flow(self):
        self.login("author")
        mine = self.client.get(f"{API}/submissions", {"scope": "mine"}).data
        self.assertEqual({s["id"] for s in mine}, {"sub-501", "sub-502", "sub-503", "sub-441", "sub-455", "sub-460"})
        s = next(x for x in mine if x["id"] == "sub-502")
        for key in ["title", "contentType", "journalOrSeries", "status", "submittedAt", "lastUpdatedAt"]:
            self.assertIn(key, s)
        bad = self.client.post(f"{API}/submissions", {"title": "T", "contentType": "article", "authorNames": "A"}, format="json")
        self.assertEqual(bad.status_code, 400)
        ok = self.client.post(f"{API}/submissions", {
            "title": "A brand new paper", "abstract": "abs", "contentType": "article",
            "targetJournalId": "j-digital-health", "authorNames": "R. Fernandes"}, format="json")
        self.assertEqual(ok.status_code, 201)
        self.assertTrue(ok.data["id"].startswith("sub-"))
        # authors cannot record decisions or see the admin area
        self.assertEqual(self.client.post(f"{API}/editorial-decisions", {"submissionId": ok.data["id"], "decision": "accept"}, format="json").status_code, 403)
        self.assertEqual(self.client.get(f"{API}/admin/users").status_code, 403)

    def test_researcher_sees_only_own_and_visitor_blocked(self):
        self.login("researcher")
        self.assertEqual(self.client.get(f"{API}/submissions").data, [])
        res = self.client.post(f"{API}/submissions", {"title": "Case", "contentType": "case_study"}, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(self.client.post(f"{API}/editorial-decisions", {"submissionId": res.data["id"], "decision": "accept"}, format="json").status_code, 403)
        self.client.credentials()
        self.assertEqual(self.client.get(f"{API}/submissions").status_code, 401)

    def test_editor_queue_and_decisions(self):
        self.login("editor")
        queue = self.client.get(f"{API}/submissions").data
        by_id = {q["id"]: q for q in queue}
        self.assertNotIn("sub-503", by_id)  # drafts stay private
        self.assertEqual(by_id["sub-460"]["lastDecision"], "accept")
        self.assertEqual(by_id["sub-455"]["authorName"], "K. Novak")
        self.assertEqual(by_id["sub-455"]["daysInStage"], 2)
        # invalid transition
        bad = self.client.post(f"{API}/editorial-decisions", {"submissionId": "sub-460", "decision": "accept"}, format="json")
        self.assertEqual(bad.status_code, 400)
        # accept -> publish creates a catalog article
        ok = self.client.post(f"{API}/editorial-decisions", {"submissionId": "sub-460", "decision": "publish"}, format="json")
        self.assertEqual(ok.status_code, 201, ok.content)
        self.assertEqual(ok.data["status"], "published")
        arts = self.client.get(f"{API}/articles", {"journalId": "j-applied-linguistics"}).data
        self.assertIn("Learner Feedback Loops in Adaptive Assessment Platforms", [a["title"] for a in arts])
        # author got an alert
        self.login("author")
        alerts = self.client.get(f"{API}/alerts").data
        self.assertTrue(any("published" in a["message"] for a in alerts))

    def test_review_assignment_flow(self):
        self.login("editor")
        res = self.client.post(f"{API}/review-assignments", {"submissionId": "sub-501", "reviewerEmail": "reviewer@meridian.test"}, format="json")
        self.assertEqual(res.status_code, 201, res.content)
        dup = self.client.post(f"{API}/review-assignments", {"submissionId": "sub-501", "reviewerEmail": "reviewer@meridian.test"}, format="json")
        self.assertEqual(dup.status_code, 400)
        self.login("reviewer")
        mine = self.client.get(f"{API}/review-assignments").data
        self.assertEqual({r["id"] for r in mine} >= {"rev-701", "rev-702"}, True)
        self.assertEqual(set(mine[0]), {"id", "submissionId", "submissionTitle", "journal", "dueDate", "status"})
        acc = self.client.patch(f"{API}/review-assignments/rev-702", {"status": "accepted"}, format="json")
        self.assertEqual(acc.data["status"], "accepted")
        self.assertEqual(self.client.patch(f"{API}/review-assignments/rev-702", {"status": "accepted"}, format="json").status_code, 400)


class EngagementAndAdminTests(ApiTestBase):
    def test_bookmarks(self):
        self.login("researcher")
        self.assertEqual(self.client.get(f"{API}/bookmarks").data, [])
        res = self.client.post(f"{API}/bookmarks", {"contentId": "a-1001", "contentType": "article"}, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["title"], "Task-Based Instruction and Learner Autonomy in Hybrid Classrooms")
        again = self.client.post(f"{API}/bookmarks", {"contentId": "a-1001", "contentType": "article"}, format="json")
        self.assertEqual(again.status_code, 200)
        self.assertEqual(len(self.client.get(f"{API}/bookmarks").data), 1)
        self.assertEqual(self.client.post(f"{API}/bookmarks", {"contentId": "zzz", "contentType": "article"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(f"{API}/bookmarks/{res.data['id']}").status_code, 204)

    def test_institutional(self):
        self.login("librarian")
        usage = self.client.get(f"{API}/admin/analytics").data
        self.assertEqual(usage[0], {"month": "Apr", "downloads": 1120})
        subs = self.client.get(f"{API}/subscriptions").data
        self.assertEqual(len(subs), 2)
        self.login("author")
        self.assertEqual(self.client.get(f"{API}/subscriptions").status_code, 403)

    def test_admin_users_and_audit(self):
        self.login("admin")
        users = self.client.get(f"{API}/admin/users").data
        self.assertEqual(len(users), 6)
        self.assertEqual(set(users[0]), {"id", "name", "email", "roles", "status"})
        target = next(u for u in users if u["email"] == "researcher@meridian.test")
        res = self.client.patch(f"{API}/admin/users/{target['id']}", {"roles": ["researcher", "reviewer"]}, format="json")
        self.assertEqual(res.data["roles"], ["researcher", "reviewer"])
        logs = self.client.get(f"{API}/admin/audit-logs").data
        self.assertEqual(set(logs[0]), {"id", "actor", "action", "target", "timestamp"})
        self.assertIn("Updated user (roles)", logs[0]["action"])

    def test_suspended_user_cannot_login(self):
        self.login("admin")
        users = self.client.get(f"{API}/admin/users").data
        target = next(u for u in users if u["email"] == "researcher@meridian.test")
        self.client.patch(f"{API}/admin/users/{target['id']}", {"status": "suspended"}, format="json")
        self.client.credentials()
        res = self.client.post(f"{API}/auth/login", {"email": "researcher@meridian.test", "password": PW}, format="json")
        self.assertIn(res.status_code, (401, 403))


class SpaTests(ApiTestBase):
    def test_health_and_unknown_api(self):
        res = self.client.get("/healthz")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ok"})
        self.assertEqual(self.client.get(f"{API}/nope").status_code, 404)
