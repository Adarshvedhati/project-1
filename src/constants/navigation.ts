/** Primary navigation, per SRS section 4.1. */
export interface NavItem {
  label: string;
  path: string;
  megaMenu?: NavMegaColumn[];
}

export interface NavMegaColumn {
  heading: string;
  links: { label: string; path: string }[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "Research / Explore",
    path: "/search",
    megaMenu: [
      {
        heading: "Discover",
        links: [
          { label: "All research", path: "/search" },
          { label: "Journals A–Z", path: "/journals" },
          { label: "Books", path: "/books" },
          { label: "Case studies", path: "/case-studies" },
        ],
      },
      {
        heading: "For researchers",
        links: [
          { label: "Saved searches", path: "/account/alerts" },
          { label: "Bookmarks", path: "/account/bookmarks" },
        ],
      },
    ],
  },
  { label: "Journals", path: "/journals" },
  { label: "Books", path: "/books" },
  { label: "Case Studies", path: "/case-studies" },
  {
    label: "Publish With Us",
    path: "/publish",
    megaMenu: [
      {
        heading: "Publishing",
        links: [
          { label: "Author guidelines", path: "/publish" },
          { label: "Start a submission", path: "/publish/submissions/new" },
          { label: "Track a submission", path: "/publish/submissions" },
        ],
      },
      {
        heading: "Review & editorial",
        links: [
          { label: "Reviewer dashboard", path: "/review" },
          { label: "Editor dashboard", path: "/editorial" },
        ],
      },
    ],
  },
  { label: "Open Access", path: "/open-access" },
  { label: "Research Services", path: "/research-services" },
  { label: "About", path: "/about" },
  { label: "For Librarians & Institutions", path: "/institutions" },
];

export const UTILITY_NAV = {
  signIn: { label: "Sign In", path: "/sign-in" },
  register: { label: "Register", path: "/register" },
};
