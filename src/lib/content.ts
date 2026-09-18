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
    label: "Properties",
    href: "/properties",
    children: [
      { label: "For Rent", href: "/properties?purpose=rent" },
      { label: "For Sale", href: "/properties?purpose=sale" },
      { label: "Residential", href: "/properties?category=residential" },
      { label: "Commercial", href: "/properties?category=commercial" },
    ],
  },
  { label: "New Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];
