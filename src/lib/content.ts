import site from "@/data/site.json";
import team from "@/data/team.json";
import projects from "@/data/projects.json";

export { site, team };

export type Project = (typeof projects)[number];

export const getProjects = (): Project[] => projects;
export const getProject = (slug: string) => projects.find((p) => p.slug === slug) ?? null;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://leadingproperties.ae").replace(
  /\/$/,
  "",
);

export const nav = [
  { label: "Home", href: "/" },
  {
    label: "Commercial",
    href: "/properties?category=commercial",
    children: [
      { label: "Rent", href: "/properties?category=commercial&purpose=rent" },
      { label: "Sale", href: "/properties?category=commercial&purpose=sale" },
    ],
  },
  { label: "Residentials", href: "/properties?category=residential" },
  {
    label: "New Projects",
    href: "/projects",
    children: [
      { label: "All Projects", href: "/projects" },
      { label: "Tilal Binghatti", href: "/projects/tilal-binghatti" },
      { label: "Damac", href: "/projects/damac" },
    ],
  },
  { label: "About us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];
