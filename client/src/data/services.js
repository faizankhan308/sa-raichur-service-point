const services = [
  // ==========================================
  // CLEANING SERVICES
  // ==========================================
  {
    id: "home-deep",
    name: "Home Deep Cleaning",
    category: "cleaning",
    price: 1999,
    originalPrice: 2499,
    rating: 4.85,
    reviewCount: 320,
    description: "Intense deep cleaning for your entire apartment or independent house. Includes kitchen, bathrooms, balcony, windows, and floor scrubbing.",
    benefits: [
      "Spotless tiled floors and wall panels",
      "Thorough degreasing of kitchen cabinets & slab",
      "Disinfected and scrubbed bathrooms",
      "Removal of deep dust layers from hard-to-reach areas"
    ],
    inclusions: [
      "Manual and mechanized scrubbing of floors",
      "Balcony wash and window mesh cleaning",
      "Bathroom fitting polishing & descaling",
      "Dusting of fans, lights, switches, and wardrobes"
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "office-deep",
    name: "Office Deep Cleaning",
    category: "cleaning",
    price: 2999,
    originalPrice: 3999,
    rating: 4.9,
    reviewCount: 110,
    description: "Complete commercial sanitization and deep wash for offices, clinics, and customer reception areas. Flexible scheduling to minimize business disruption.",
    benefits: [
      "Improved workplace hygiene and staff safety",
      "Polished, professional looking corporate environment",
      "Thorough carpet and workstation dusting"
    ],
    inclusions: [
      "Disinfection of keyboard, mouse, and desks",
      "Glass partition cleaning and polishing",
      "Mechanized floor polishing & scrubbing",
      "Cafeteria and pantry deep sanitization"
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "commercial-clean",
    name: "Commercial Cleaning",
    category: "cleaning",
    price: 4999,
    originalPrice: 5999,
    rating: 4.8,
    reviewCount: 85,
    description: "Deep scrubbing and sanitation services for malls, warehouses, hotels, and retail stores in Raichur.",
    benefits: [
      "Maintains clean health standards for public visits",
      "Removes industrial dust and stains",
      "Custom schedules for night shifts"
    ],
    inclusions: [
      "Staircase and lobby cleaning",
      "Signage and external wall glass wash",
      "High-pressure wash of entry and parking zones",
      "Restroom deep sanitization"
    ],
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bathroom-deep",
    name: "Bathroom/Washroom Deep Cleaning",
    category: "cleaning",
    price: 399,
    originalPrice: 499,
    rating: 4.75,
    reviewCount: 450,
    description: "Mechanized deep cleaning of wall tiles, commode, taps, and mirror descaling for a germ-free bathroom.",
    benefits: [
      "Stain-free walls and mirrors",
      "Eliminates hard water scaling and foul odors",
      "Kills 99.9% of bacteria and viruses"
    ],
    inclusions: [
      "Acid-based tile stain scrubbing",
      "Polishing of taps, shower head, and health faucet",
      "Sanitizing inside and outside the commode",
      "Drain blockage checks and sanitizing"
    ],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sofa-clean",
    name: "Sofa & Furniture Cleaning",
    category: "cleaning",
    price: 499,
    originalPrice: 699,
    rating: 4.82,
    reviewCount: 280,
    description: "Dry vacuuming, shampooing, scrubbing, and extraction of dirt from fabric or leather sofas, dining chairs, and recliners.",
    benefits: [
      "Removes sweat stains and visual marks",
      "Neutralizes micro-dust and pet hair",
      "Refreshes fabric texture and leaves a pleasant scent"
    ],
    inclusions: [
      "Industrial vacuuming to extract crumbs and dust",
      "Application of organic foam shampoo",
      "Brush scrubbing of cushions and armrests",
      "Suction extraction to speed up drying"
    ],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "carpet-clean",
    name: "Carpet Cleaning",
    category: "cleaning",
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 160,
    description: "Heavy-duty shampooing and vacuum extraction for residential and commercial carpets.",
    benefits: [
      "Restores fabric color and fluffiness",
      "Extracts allergens embedded deep in fabric",
      "Removes beverage/ink stains"
    ],
    inclusions: [
      "Dry vacuuming",
      "Specialized spot treatment for stains",
      "Mechanized injection-extraction wash",
      "Drying layout support"
    ],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mattress-clean",
    name: "Mattress Cleaning",
    category: "cleaning",
    price: 499,
    originalPrice: 699,
    rating: 4.88,
    reviewCount: 95,
    description: "UV vacuuming and sanitizing of mattresses to eliminate dust mites, dead skin, and sweat spots.",
    benefits: [
      "Improves sleep quality and air hygiene",
      "Kills micro-bugs and dust mites",
      "Removes liquid stains"
    ],
    inclusions: [
      "Both-sides deep vacuuming",
      "Enzyme spray treatment for odors",
      "Surface spot scrubbing",
      "Disinfectant spray application"
    ],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "kitchen-clean",
    name: "Kitchen Cleaning",
    category: "cleaning",
    price: 999,
    originalPrice: 1299,
    rating: 4.86,
    reviewCount: 220,
    description: "Degreasing and descaling of kitchen slabs, cabinets, tiles, sinks, and window grills.",
    benefits: [
      "Removes stubborn grease and oil smoke films",
      "Clean cabinet interior/exterior storage environment",
      "Restores sink glossiness"
    ],
    inclusions: [
      "Wiping cabinet cabinets internally & externally",
      "Scrubbing tiles behind the stove and cooktop",
      "Cleaning window pane frames and exhaust fan",
      "Polishing tap fittings & steel sink"
    ],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chimney-clean",
    name: "Kitchen Chimney Cleaning",
    category: "cleaning",
    price: 699,
    originalPrice: 899,
    rating: 4.78,
    reviewCount: 140,
    description: "Complete dismantling and chemical degreasing of chimney mesh filters and inner blower parts.",
    benefits: [
      "Restores high suction capacity of the chimney",
      "Prevents motor failures due to grease buildup",
      "Reduces noise levels during operation"
    ],
    inclusions: [
      "Dismantling filter mesh screens",
      "Hot-water chemical dip to dissolve carbon residues",
      "Cleaning internal baffle plates",
      "Outer body glass cleaning and testing"
    ],
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "water-tank",
    name: "Water Tank Cleaning",
    category: "cleaning",
    price: 799,
    originalPrice: 999,
    rating: 4.91,
    reviewCount: 380,
    description: "6-stage mechanized cleaning of overhead residential plastic/sintex water storage tanks.",
    benefits: [
      "Removes mud sediment and algae buildup",
      "Maintains clean water for drinking & bathing",
      "UV disinfection to kill lingering pathogens"
    ],
    inclusions: [
      "Mechanized dewatering of dirty water",
      "High-pressure jet wash of walls & floor",
      "Vacuuming sludge slurry",
      "UV ray sterilizer scanning"
    ],
    image: "https://images.unsplash.com/photo-1508873696983-2df519fcd3ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sump-clean",
    name: "Underground Tank & Sump Cleaning",
    category: "cleaning",
    price: 1199,
    originalPrice: 1499,
    rating: 4.88,
    reviewCount: 290,
    description: "Deep scrubbing and high-pressure washing for large underground sumps. Removes heavy mud sludge.",
    benefits: [
      "Avoids pump blockages and valve rust",
      "Fresh clean base storage for municipal water",
      "Bactericide wall treatment"
    ],
    inclusions: [
      "Manual wall scrubbing and mud extraction",
      "Vacuuming floor slurry using sludge pumps",
      "High-pressure jet washing",
      "Anti-bacterial chemical spray"
    ],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
  },

  // ==========================================
  // HOME MAINTENANCE SERVICES
  // ==========================================
  {
    id: "ac-service",
    name: "AC Service & Repair",
    category: "maintenance",
    price: 499,
    originalPrice: 699,
    rating: 4.84,
    reviewCount: 510,
    description: "Jet-pump wet wash service for split ACs. Diagnostic checking, filter cleaning, and gas level testing.",
    benefits: [
      "Instantly improves cooling efficiency",
      "Reduces electricity bills",
      "Cleans indoor air circulation"
    ],
    inclusions: [
      "Jet spray wash of indoor cooling coil & fan",
      "Cleaning indoor unit outer cover and filters",
      "Outdoor unit general dusting & pressure wash",
      "Diagnostics of current amp and gas pressure"
    ],
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "plumbing",
    name: "Plumbing Services",
    category: "maintenance",
    price: 149,
    originalPrice: 249,
    rating: 4.78,
    reviewCount: 390,
    description: "Fixing faucet leaks, toilet flushes, pipeline blocks, and pump repairs by expert local plumbers in Raichur.",
    benefits: [
      "Quick fix for water wastage and dripping noise",
      "Certified and fully equipped technicians",
      "Use of quality replacement parts"
    ],
    inclusions: [
      "Leak diagnostics and tap replacement",
      "Flush valve or syphon repair",
      "Water meter or valve installation",
      "Post-work cleanup"
    ],
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "electrical",
    name: "Electrical Services",
    category: "maintenance",
    price: 149,
    originalPrice: 249,
    rating: 4.81,
    reviewCount: 420,
    description: "Safe and verified electrical fixes. Installation of fans, lights, geysers, switchboards, and MCBs.",
    benefits: [
      "Safe installation minimizing short circuits",
      "Quick response for fuse faults",
      "Background-checked expert technicians"
    ],
    inclusions: [
      "Installing ceiling fan/exhaust fan",
      "Replacing faulty switches and sockets",
      "Geyser heating element testing & fix",
      "MCB trip diagnostics"
    ],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "carpenter",
    name: "Carpenter Services",
    category: "maintenance",
    price: 199,
    originalPrice: 299,
    rating: 4.76,
    reviewCount: 190,
    description: "Door alignments, cupboard hinges, lock replacements, drawer track repairs, and new furniture assembly.",
    benefits: [
      "Fixes squeaking doors & loose handles",
      "Professional tools for smooth wooden finishes",
      "Saves time on complex assembly manuals"
    ],
    inclusions: [
      "Hinge replacement and door latch adjustments",
      "Installing cupboard magnetic locks & handles",
      "Assembling ready-to-assemble tables/beds",
      "Drilling work for hanging frames/mirrors"
    ],
    image: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "painting",
    name: "Painting Services",
    category: "maintenance",
    price: 4999,
    originalPrice: 5999,
    rating: 4.89,
    reviewCount: 75,
    description: "Full home painting, accent wall designs, exterior textures, and wallpaper installations. Book a site inspection quote.",
    benefits: [
      "Pristine texture finish matching wall themes",
      "Premium paints (Asian Paints/Berger) with high longevity",
      "Furniture covering and post-cleaning included"
    ],
    inclusions: [
      "Wall surface sanding and putty fills",
      "Primer coat + double topcoat emulsion",
      "Furniture masking and floor plastic covering",
      "Final floor wash to remove paint droplets"
    ],
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pest-control",
    name: "Pest Control",
    category: "maintenance",
    price: 799,
    originalPrice: 999,
    rating: 4.83,
    reviewCount: 310,
    description: "Odorless gel treatment for cockroaches and spray treatment for ants, termites, and bed bugs.",
    benefits: [
      "Long-lasting safety barrier (up to 3 months)",
      "Safe, eco-friendly, and odorless sprays",
      "No need to vacate the kitchen or empty shelves"
    ],
    inclusions: [
      "Gel paste dotting in cabinet corners",
      "Chemical barrier spray under appliances",
      "Drainage opening treatment",
      "Follow-up advice"
    ],
    image: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=600&q=80"
  },

  // ==========================================
  // OTHER SERVICES
  // ==========================================
  {
    id: "solar-panel",
    name: "Solar Panel Cleaning",
    category: "others",
    price: 899,
    originalPrice: 1199,
    rating: 4.87,
    reviewCount: 130,
    description: "Restores up to 25% efficiency lost due to dirt, bird droppings, and industrial dust. Uses specialized soft cleaning brushes.",
    benefits: [
      "Improves power generation output immediately",
      "Avoids hot-spots and micro-cracks in cells",
      "Extends panel life span"
    ],
    inclusions: [
      "Soft wash scrubbing with demineralized water",
      "Removes dried bird droppings and scale stains",
      "Checking bracket bolts and connection wire checks"
    ],
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "solar-heater",
    name: "Solar Water Heater Cleaning",
    category: "others",
    price: 1199,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 90,
    description: "Chemical descaling of solar glass vacuum tubes and storage tank flushing to fix slow water flow.",
    benefits: [
      "Increases water temperature and heating speed",
      "Descales hard water salts blocking joints",
      "Prevents tank leakage and joint rust"
    ],
    inclusions: [
      "Dismantling and flushing glass vacuum tubes",
      "Rinsing tank inner chamber",
      "Replacement of joint washers if dripping",
      "System testing"
    ],
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "car-wash",
    name: "Doorstep Car Wash",
    category: "others",
    price: 499,
    originalPrice: 699,
    rating: 4.84,
    reviewCount: 370,
    description: "Professional high-pressure foam wash and interior vacuuming performed at your own parking space.",
    benefits: [
      "Saves hours driving to local washing garages",
      "Eco-friendly high pressure water guns",
      "Glossy dashboard polish finish"
    ],
    inclusions: [
      "Exterior shampoo foam wash and body dry",
      "Cabin vacuuming (mats, seats, boot)",
      "Glass cleaning and tyre dressing",
      "Dashboard polish wiping"
    ],
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bike-wash",
    name: "Bike Wash",
    category: "others",
    price: 199,
    originalPrice: 299,
    rating: 4.75,
    reviewCount: 150,
    description: "Pressure water cleaning, mud removal, degreasing chain, and chain lube application at your gate.",
    benefits: [
      "Slick look and quiet chain rotation",
      "Removes mud grease from wheels & engine",
      "Done in 20 minutes"
    ],
    inclusions: [
      "High-pressure wash",
      "Active foam scrubbing",
      "Chain wash and diesel spray grease wash",
      "Lubricating drive chain"
    ],
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "home-shifting",
    name: "Home Shifting",
    category: "others",
    price: 3499,
    originalPrice: 4499,
    rating: 4.9,
    reviewCount: 120,
    description: "Safe packing, loading, local transportation, unloading, and unpacking services within Raichur.",
    benefits: [
      "Stress-free local shifting",
      "Zero damage to fragile items",
      "Experienced loaders and drivers"
    ],
    inclusions: [
      "Bubble wrapping electronics and glassware",
      "Packing boxes and carton layout loading",
      "Transporting in closed commercial vehicles",
      "Unloading and sorting boxes into designated rooms"
    ],
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "packers-movers",
    name: "Packers & Movers",
    category: "others",
    price: 4499,
    originalPrice: 5999,
    rating: 4.88,
    reviewCount: 95,
    description: "Inter-city shifting service with high-quality thick-box packing and transport insurance assistance.",
    benefits: [
      "Best packing materials used for long drives",
      "Dedicated point-of-contact advisor",
      "All-India transit permit trucks"
    ],
    inclusions: [
      "Multi-layer cardboard wrapping",
      "Dismantling heavy furniture (beds, wardrobes)",
      "Loading using safety belts & pulleys",
      "Transport, delivery, and unpacking at destination"
    ],
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "decoration",
    name: "Decoration Services",
    category: "others",
    price: 2499,
    originalPrice: 2999,
    rating: 4.85,
    reviewCount: 105,
    description: "Custom balloon arches, backdrop banners, naming ceremonies, birthday setups, and home welcome decors.",
    benefits: [
      "Creative and modern design layouts",
      "Done in 2-3 hours before the party",
      "No damage to wall paints (uses masking tape)"
    ],
    inclusions: [
      "Up to 200 color-themed metallic balloons",
      "Foil star/alphabet balloon set",
      "Ribbons, LED fairy lights, and backdrop draping",
      "Theme layout setup by decor experts"
    ],
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
  }
];

export default services;
export { services };
