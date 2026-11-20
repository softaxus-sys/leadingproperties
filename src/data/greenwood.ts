/**
 * Central configuration for the Aldar Greenwood (Dubai Silicon Oasis) campaign page.
 *
 * Every figure here is PRELIMINARY marketing information and is not confirmed by Aldar.
 * Edit this file to update prices, payment terms, stats, images or FAQs; the page reads from it.
 */

export const SLUG = "aldar-greenwood-dubai-silicon-oasis";
export const PAGE_PATH = `/${SLUG}`;
export const CAMPAIGN = "aldar-greenwood-dsl";

export const project = {
  name: "Greenwood by Aldar",
  shortName: "Greenwood",
  workingNameNote: "Project working name",
  location: "Dubai Silicon Oasis, Dubai, UAE",
  developer: "Aldar Properties",
  partner: "Dubai Holding",
  launch: "To be announced",
  /** Google Maps pin supplied for the campaign (resolves to these coordinates). */
  mapUrl: "https://maps.app.goo.gl/5C5xPQTTt8v4kD2w7",
  lat: 25.138122,
  lng: 55.4112739,
};

export const stats = [
  { value: "~8,000", label: "Planned homes" },
  { value: "3", label: "Development phases" },
  { value: "~1,200", label: "Anticipated Phase 1 homes" },
  { value: "3–5", label: "Bedroom options" },
];

export const heroHighlights = [
  "Dubai Silicon Oasis",
  "Townhouses & Villas",
  "3 to 5 Bedroom Options",
  "Indicative prices around AED 3M",
  "Expected 55/45 payment plan",
];

export const propertyOptions = [
  "3 Bedroom Townhouse",
  "4 Bedroom Townhouse",
  "3 Bedroom Villa",
  "4 Bedroom Villa",
  "4 Bedroom Twin Villa",
  "5 Bedroom Villa",
  "Not Decided",
] as const;

export const residences: {
  beds: string;
  kind: string;
  title: string;
  blurb: string;
  option: (typeof propertyOptions)[number];
  /** Drop in an official image path (e.g. "/images/greenwood/3br-townhouse.jpg") when available. */
  image?: string;
}[] = [
  {
    beds: "3",
    kind: "Townhouse",
    title: "3 Bedroom Townhouses",
    blurb: "Contemporary family living with spacious interiors and private outdoor space where applicable.",
    option: "3 Bedroom Townhouse",
  },
  {
    beds: "4",
    kind: "Townhouse",
    title: "4 Bedroom Townhouses",
    blurb: "Larger family layouts in modern architecture, with comfortable living spaces.",
    option: "4 Bedroom Townhouse",
  },
  {
    beds: "3",
    kind: "Villa",
    title: "3 Bedroom Villas",
    blurb: "A private residential lifestyle in a contemporary, family-oriented design.",
    option: "3 Bedroom Villa",
  },
  {
    beds: "4",
    kind: "Villa",
    title: "4 Bedroom Villas",
    blurb: "Larger residential layouts for premium family living.",
    option: "4 Bedroom Villa",
  },
  {
    beds: "4",
    kind: "Twin Villa",
    title: "4 Bedroom Twin Villas",
    blurb: "A twin-villa configuration with spacious layouts.",
    option: "4 Bedroom Twin Villa",
  },
  {
    beds: "5",
    kind: "Villa",
    title: "5 Bedroom Villas",
    blurb: "The largest homes in the community, for a premium residential experience.",
    option: "5 Bedroom Villa",
  },
];

export const communityFeatures = [
  "Landscaped green spaces",
  "Parks and open areas",
  "Walking and cycling opportunities",
  "Family-friendly environments",
  "Schools and educational facilities",
  "Retail and shopping destinations",
  "Workspaces and everyday conveniences",
  "Community gathering spaces",
];

export const payment = {
  plan: "55/45",
  duringConstruction: 55,
  onHandover: 45,
  booking: 5,
  exampleAed: 3_000_000,
};

export const whySix = [
  { title: "Established Developer", text: "A residential development associated with Aldar Properties." },
  { title: "Strategic Dubai Location", text: "Dubai Silicon Oasis and the surrounding growth corridors." },
  {
    title: "Family-Oriented Living",
    text: "A planned combination of residential homes, green spaces and everyday facilities.",
  },
  { title: "Multiple Property Choices", text: "Townhouses, villas and apartments across different configurations." },
  { title: "Future Connectivity", text: "Planned Dubai Metro Blue Line infrastructure serving the wider area." },
  { title: "Flexible Purchase Structure", text: "Expected 55/45 payment structure, subject to confirmation." },
];

/**
 * Representative imagery only: these are renders of OTHER green-community developments already in
 * this site's library, NOT approved Greenwood renders. Replace with authorised project imagery.
 */
export const images = {
  hero: "/images/projects/vindera-1.jpg",
  overview: "/images/projects/golf-meadow-1.webp",
  lifestyle: "/images/projects/sorrento-1.jpg",
};

export const gallery = [
  { src: "/images/projects/vindera-1.jpg", alt: "Landscaped waterside park with low-rise townhouses beyond", caption: "Landscaped community park" },
  { src: "/images/projects/sorrento-1.jpg", alt: "Evening walking path through a green community park", caption: "Walking paths and open lawns" },
  { src: "/images/projects/golf-meadow-1.webp", alt: "Contemporary residences overlooking green open space", caption: "Residences overlooking green space" },
];

export const whatsappMessage =
  "Hello, I am interested in the upcoming Aldar community in Dubai Silicon Oasis. Please share the latest project details, property options, prices and payment plan.";

export const faqs = [
  {
    q: "Where is the upcoming Aldar community located?",
    a: "It is planned in Dubai Silicon Oasis, Dubai. The location pin is shown in the Location section of this page. Final masterplan details are subject to the developer.",
  },
  {
    q: "Who is the developer?",
    a: "The community is associated with Aldar Properties, with Dubai Holding as the development partner, according to the preliminary project information we have received. Please ask us for the latest confirmed details.",
  },
  {
    q: "What property types are available?",
    a: "The planned residential mix includes townhouses, villas and apartments. Townhouse and villa configurations currently indicated are 3 and 4 bedroom townhouses, 3 and 4 bedroom villas, 4 bedroom twin villas and 5 bedroom villas. This mix is preliminary and may change.",
  },
  {
    q: "How many bedrooms are available?",
    a: "Currently indicated options range from 3 to 5 bedrooms across townhouses and villas. Final unit mix and availability will be confirmed by the developer.",
  },
  {
    q: "What is the expected starting price?",
    a: "Indicative pricing is around or below AED 3 million for selected homes. This is an estimate only. Official prices have not been released, so please register to receive the latest price list when it is available.",
  },
  {
    q: "What is the expected payment plan?",
    a: "A 55/45 plan is expected: 55% during construction and 45% on handover. This is subject to official confirmation, and instalment dates have not been published.",
  },
  {
    q: "What is the booking amount?",
    a: "A booking amount of around 5% is expected. This is not yet officially confirmed and may change.",
  },
  {
    q: "How many development phases are planned?",
    a: "Three phases are planned, with approximately 1,200 homes anticipated in Phase 1 out of roughly 8,000 planned homes overall. These figures are preliminary and subject to developer confirmation.",
  },
  {
    q: "When is the project expected to launch?",
    a: "A launch date has not been confirmed. Register your interest and we will share launch information as soon as it is available.",
  },
  {
    q: "Is the community connected to the Dubai Metro Blue Line?",
    a: "The Dubai Metro Blue Line is planned to serve the surrounding area. We have not verified walking distances from the community to any station, so please treat the Blue Line as a planned future infrastructure advantage rather than a confirmed feature of the project.",
  },
  {
    q: "How can I receive the latest brochure and floor plans?",
    a: "Use the “Request Floor Plan” or “Request Brochure” buttons, or complete the enquiry form, and a property consultant will send the materials that are currently available.",
  },
  {
    q: "How can I register my interest?",
    a: "Complete the form at the top of this page or in the Register section, or message us on WhatsApp. There is no obligation to purchase.",
  },
];

export const disclaimer =
  "LeadingProperties.ae is an independent real estate marketing and enquiry platform and is not the official website of Aldar Properties unless expressly authorized. Project information is preliminary and subject to confirmation by the developer. Prices, availability, payment plans, specifications and launch information may change without notice. Images may be representative and are not necessarily actual project images.";
