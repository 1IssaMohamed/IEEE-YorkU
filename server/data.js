/**
 * Club Mission Statement
 * Displayed in the About section of the website
 */
export const clubMission = "To foster technological innovation, provide professional development opportunities, and build a strong community for engineering and computing students at York University, upholding the core values of IEEE.";

/**
 * Events Data
 * Each event includes images for the carousel display
 * Categories: "Technical", "Professional", "Project"
 * 
 * To add a new event:
 * 1. Copy an existing event object
 * 2. Update all fields with new information
 * 3. Add image URLs (use Unsplash or your own hosted images)
 * 4. Increment the ID
 */
export const events = [
  {
    id: 1,
    title: "Intro to React Workshop",
    date: "Oct 25, 2025",
    time: "6:00 PM EST",
    location: "Virtual (Zoom)",
    category: "Technical",
    images: [
      { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", caption: "Workshop in progress" },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", caption: "Students coding together" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800", caption: "Team collaboration" }
    ]
  },
  {
    id: 2,
    title: "Networking Night with Alumni",
    date: "Nov 10, 2025",
    time: "7:30 PM EST",
    location: "YorkU Lassonde Building",
    category: "Professional",
    images: [
      { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800", caption: "Networking reception" },
      { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800", caption: "Alumni panel discussion" },
      { url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800", caption: "Students meeting alumni" },
      { url: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800", caption: "Group conversations" }
    ]
  },
  {
    id: 3,
    title: "Robotics Hackathon Prep Session",
    date: "Nov 22, 2025",
    time: "4:00 PM EST",
    location: "Engineering Lab 203",
    category: "Project",
    images: [
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", caption: "Robot assembly" },
      { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800", caption: "Hardware programming" },
      { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800", caption: "Testing robot sensors" }
    ]
  }
];

/**
 * Past Events Data
 * Archive of completed events with photo galleries
 * Same structure as upcoming events but represents historical activities
 */
export const pastEvents = [
  {
    id: 101,
    title: "Industry Night 2025",
    date: "Oct 18, 2025",
    time: "6:00 PM EST",
    location: "Second Student Center",
    images: [
      { url: "/images/events/industrynight2025/DSC_1721-3.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_4036-2.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_4151-2.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_4194-2.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_4998-3.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_5316-2.jpg", caption: "X" },
      { url: "/images/events/industrynight2025/DSC_6488-2.jpg", caption: "X" }
    ]
  },
  {
    id: 102,
    title: "Industry Night 2024",
    date: "Oct 18, 2024",
    time: "6:00 PM EST",
    location: "Second Student Center",
    images: [
      { url: "/images/events/industrynight2024/DSC07199.JPG", caption: "X" },
      { url: "/images/events/industrynight2024/DSC07222.JPG", caption: "X" },
      { url: "/images/events/industrynight2024/DSC07225.JPG", caption: "X" },
      { url: "/images/events/industrynight2024/DSC07236.JPG", caption: "X" },
      { url: "/images/events/industrynight2024/DSC07604.JPG", caption: "X" }
    ]
  }
];

/**
 * Team Members Data
 * Displayed in the Team section as an org chart
 * 
 * Hierarchy levels: 'chair', 'vice', 'director'
 * Leave name empty ("") for open positions
 */
export const team = [
  // Chair
  {
    id: 1,
    name: "",
    role: "Chair",
    program: "",
    level: "chair"
  },
  // Vice Chairs
  {
    id: 2,
    name: "",
    role: "Vice Chair",
    program: "",
    level: "vice"
  },
  {
    id: 3,
    name: "",
    role: "Vice Chair",
    program: "",
    level: "vice"
  },
  // Directors & Officers
  {
    id: 4,
    name: "",
    role: "Secretary",
    program: "",
    level: "director"
  },
  {
    id: 5,
    name: "",
    role: "Web Director",
    program: "",
    level: "director"
  },
  {
    id: 6,
    name: "",
    role: "Events Director",
    program: "",
    level: "director"
  },
  {
    id: 7,
    name: "",
    role: "Treasurer",
    program: "",
    level: "director"
  },
  {
    id: 8,
    name: "",
    role: "Treasurer",
    program: "",
    level: "director"
  },
  {
    id: 9,
    name: "",
    role: "Research Director",
    program: "",
    level: "director"
  },
  {
    id: 10,
    name: "",
    role: "Grad Affairs Director",
    program: "",
    level: "director"
  },
  {
    id: 11,
    name: "",
    role: "Grad Chair",
    program: "",
    level: "director"
  },
  {
    id: 12,
    name: "",
    role: "Technical Director",
    program: "",
    level: "director"
  },
  {
    id: 13,
    name: "",
    role: "Women in Engineering Chair",
    program: "",
    level: "director"
  }
];

/**
 * Sponsors Data
 * Companies and organizations supporting IEEE YorkU
 * 
 * To add a sponsor:
 * 1. Add logo URL (or leave blank for text-only display)
 * 2. Add company name
 * 3. Increment the ID
 */
export const sponsors = [
  {
    id: 1,
    name: "TechCorp",
    logo: "https://via.placeholder.com/200x80/0ea5e9/ffffff?text=TechCorp"
  },
  {
    id: 2,
    name: "InnovateLabs",
    logo: "https://via.placeholder.com/200x80/8b5cf6/ffffff?text=InnovateLabs"
  },
  {
    id: 3,
    name: "FutureSystems",
    logo: "https://via.placeholder.com/200x80/10b981/ffffff?text=FutureSystems"
  }
];

