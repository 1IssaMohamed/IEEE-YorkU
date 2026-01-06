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
    title: "AI/ML Workshop Series",
    date: "Sept 15, 2025",
    time: "5:00 PM EST",
    location: "Bergeron Centre",
    category: "Technical",
    images: [
      { url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800", caption: "Introduction to neural networks" },
      { url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", caption: "Students working on ML models" },
      { url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800", caption: "Live coding demonstration" },
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800", caption: "Q&A session" }
    ]
  },
  {
    id: 102,
    title: "Industry Career Fair 2025",
    date: "Sept 28, 2025",
    time: "10:00 AM EST",
    location: "Student Centre",
    category: "Professional",
    images: [
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", caption: "Company booths" },
      { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800", caption: "Students networking with recruiters" },
      { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800", caption: "Resume review sessions" },
      { url: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800", caption: "Mock interview booth" },
      { url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800", caption: "Career fair attendees" }
    ]
  },
  {
    id: 103,
    title: "Arduino Hardware Jam",
    date: "Oct 5, 2025",
    time: "2:00 PM EST",
    location: "Engineering Lab 101",
    category: "Project",
    images: [
      { url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800", caption: "Arduino circuit boards" },
      { url: "https://images.unsplash.com/photo-1624953901718-e24ee7200b85?w=800", caption: "Soldering station" },
      { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", caption: "Completed IoT projects" }
    ]
  },
  {
    id: 104,
    title: "Welcome Back Social",
    date: "Sept 8, 2025",
    time: "6:30 PM EST",
    location: "York Lanes",
    category: "Professional",
    images: [
      { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800", caption: "Welcome reception" },
      { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800", caption: "Team building activities" },
      { url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800", caption: "New members meet the exec team" },
      { url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800", caption: "Group photo" }
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

