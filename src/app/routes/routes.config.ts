/**
 * Path constants, for anywhere a route is referenced outside `AppRouter`
 * (redirects, breadcrumbs, tests) without hardcoding strings.
 */
export const ROUTES = {
  home: "/",
  search: "/search",
  journals: "/journals",
  journal: (id: string) => `/journals/${id}`,
  article: (id: string) => `/articles/${id}`,
  books: "/books",
  book: (id: string) => `/books/${id}`,
  caseStudies: "/case-studies",
  caseStudy: (id: string) => `/case-studies/${id}`,
  publish: "/publish",
  newSubmission: "/publish/submissions/new",
  submissionDashboard: "/publish/submissions",
  reviewerDashboard: "/review",
  editorDashboard: "/editorial",
  adminDashboard: "/admin",
  openAccess: "/open-access",
  researchServices: "/research-services",
  institutions: "/institutions",
  about: "/about",
  signIn: "/sign-in",
  register: "/register",
  bookmarks: "/account/bookmarks",
  alerts: "/account/alerts",
};
