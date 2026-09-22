import { Routes, Route } from "react-router-dom";
import { MainLayout, DashboardLayout } from "../../components/layout";
import { HomePage } from "../../features/home/pages/HomePage";
import { SearchResultsPage } from "../../features/search/pages/SearchResultsPage";
import { JournalsListPage } from "../../features/journals/pages/JournalsListPage";
import { JournalDetailPage } from "../../features/journals/pages/JournalDetailPage";
import { ArticleDetailPage } from "../../features/articles/pages/ArticleDetailPage";
import { BooksListPage } from "../../features/books/pages/BooksListPage";
import { BookDetailPage } from "../../features/books/pages/BookDetailPage";
import { CaseStudiesListPage } from "../../features/caseStudies/pages/CaseStudiesListPage";
import { CaseStudyDetailPage } from "../../features/caseStudies/pages/CaseStudyDetailPage";
import { PublishWithUsPage } from "../../features/publishing/pages/PublishWithUsPage";
import { SubmissionDashboardPage } from "../../features/publishing/pages/SubmissionDashboardPage";
import { NewSubmissionPage } from "../../features/publishing/pages/NewSubmissionPage";
import { ReviewerDashboardPage } from "../../features/peerReview/pages/ReviewerDashboardPage";
import { EditorDashboardPage } from "../../features/editorial/pages/EditorDashboardPage";
import { OpenAccessPage } from "../../features/openAccess/pages/OpenAccessPage";
import { ResearchServicesPage } from "../../features/researchServices/pages/ResearchServicesPage";
import { InstitutionalAccessPage } from "../../features/institutional/pages/InstitutionalAccessPage";
import { AdminDashboardPage } from "../../features/admin/pages/AdminDashboardPage";
import { SignInPage } from "../../features/auth/pages/SignInPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";
import { AboutPage } from "../../pages/AboutPage";
import { AccountBookmarksPage } from "../../pages/AccountBookmarksPage";
import { AccountAlertsPage } from "../../pages/AccountAlertsPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";

/**
 * Central route table. Public routes render inside `MainLayout`
 * (global header/search + footer). The four role dashboards — Author
 * submissions, Reviewer, Editor, Admin — render inside `DashboardLayout`
 * and are gated by `ProtectedRoute` per the role matrix in
 * `constants/roles.ts` (SRS section 1.2 / 9).
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />

        <Route path="/journals" element={<JournalsListPage />} />
        <Route path="/journals/:journalId" element={<JournalDetailPage />} />
        <Route path="/articles/:articleId" element={<ArticleDetailPage />} />

        <Route path="/books" element={<BooksListPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />

        <Route path="/case-studies" element={<CaseStudiesListPage />} />
        <Route path="/case-studies/:caseStudyId" element={<CaseStudyDetailPage />} />

        <Route path="/publish" element={<PublishWithUsPage />} />
        <Route
          path="/publish/submissions/new"
          element={
            <ProtectedRoute roles={["author", "researcher", "editor", "admin"]}>
              <NewSubmissionPage />
            </ProtectedRoute>
          }
        />

        <Route path="/open-access" element={<OpenAccessPage />} />
        <Route path="/research-services" element={<ResearchServicesPage />} />
        <Route path="/institutions" element={<InstitutionalAccessPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/account/bookmarks"
          element={
            <ProtectedRoute>
              <AccountBookmarksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/alerts"
          element={
            <ProtectedRoute>
              <AccountAlertsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="/publish/submissions"
        element={
          <ProtectedRoute roles={["author", "editor", "admin"]}>
            <DashboardLayout
              title="Publishing"
              links={[
                { label: "My submissions", path: "/publish/submissions", end: true },
                { label: "Start a submission", path: "/publish/submissions/new" },
              ]}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<SubmissionDashboardPage />} />
      </Route>

      <Route
        path="/review"
        element={
          <ProtectedRoute roles={["reviewer", "editor", "admin"]}>
            <DashboardLayout title="Peer review" links={[{ label: "My reviews", path: "/review", end: true }]} />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReviewerDashboardPage />} />
      </Route>

      <Route
        path="/editorial"
        element={
          <ProtectedRoute roles={["editor", "admin"]}>
            <DashboardLayout
              title="Editorial"
              links={[{ label: "Submission queue", path: "/editorial", end: true }]}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<EditorDashboardPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout
              title="Administration"
              links={[{ label: "Overview", path: "/admin", end: true }]}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}
