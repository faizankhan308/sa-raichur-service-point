const initialServices = [
  {
    id: "home-deep",
    name: "Home Deep Cleaning",
    category: "cleaning",
    price: 1999,
    originalPrice: 2499,
    rating: 4.85,
    reviewCount: 320,
    description: "Intense deep cleaning for your entire apartment or independent house. Includes kitchen degreasing, bathrooms descaling, balcony wash, windows, and mechanized floor scrubbing.",
    benefits: [
      "Spotless tiled floors and wall panels",
      "Thorough degreasing of kitchen cabinets & slab",
      "Disinfected and scrubbed bathrooms",
      "Removal of deep dust layers from hard-to-reach areas"
    ],
    inclusions: [
      "Mechanized and manual floor scrubbing",
      "Balcony wash and window mesh cleaning",
      "Bathroom fittings descaling & mirror polishing",
      "Dusting of fans, lights, switches, and wardrobes"
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "water-tank-sump",
    name: "Water Tank & Sump Cleaning",
    category: "cleaning",
    price: 1199,
    originalPrice: 1499,
    rating: 4.90,
    reviewCount: 380,
    description: "6-stage mechanized cleaning of overhead residential Sintex/plastic water tanks and underground sumps. Removes mud sediment, algae buildup, and sanitizes storage.",
    benefits: [
      "Removes mud sediment and algae buildup",
      "Maintains clean water for drinking & bathing",
      "Avoids pump blockages and valve rust",
      "UV disinfection to kill lingering pathogens"
    ],
    inclusions: [
      "Mechanized dewatering of dirty water",
      "High-pressure jet wash of walls & floor",
      "Vacuuming sludge slurry",
      "UV ray sterilizer scanning",
      "Anti-bacterial wall spray treatment"
    ],
    image: "/water-tank-sump.png"
  },
  {
    id: "sofa-cleaning",
    name: "Sofa Cleaning",
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
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    category: "cleaning",
    price: 599,
    originalPrice: 799,
    rating: 4.70,
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
    id: "mattress-cleaning",
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
    id: "kitchen-chimney",
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
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bathroom-deep",
    name: "Bathroom Deep Cleaning",
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
    id: "floor-scrubbing",
    name: "Floor Scrubbing & Polishing",
    category: "cleaning",
    price: 999,
    originalPrice: 1299,
    rating: 4.80,
    reviewCount: 110,
    description: "Mechanized floor scrubbing and polishing using professional single-disc machines to restore the natural shine of your tiles, marble, or granite.",
    benefits: [
      "Removes deep-set dirt, grime, and footprints",
      "Restores shine and luster to dull floors",
      "Protects flooring with a clean shine barrier"
    ],
    inclusions: [
      "Machine scrubbing with specialized tile cleaners",
      "Stain removal treatment",
      "Washing and drying of floor area",
      "Application of high-shine protective polish"
    ],
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80"
  },
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
    image: "/ac-service.jpg"
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
    image: "/plumbing.jpg"
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
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
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
    image: "/pest-control.png"
  },
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
  }
];

module.exports = initialServices;
