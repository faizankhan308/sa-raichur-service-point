const services = [
  {
    id: "home-deep",
    name: "Home Deep Cleaning",
    category: "cleaning",
    price: 4999,
    originalPrice: 5999,
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
    id: "office-deep",
    name: "Office Deep Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.80,
    reviewCount: 95,
    description: "Professional deep sanitization and cleaning for offices, commercial cabins, conference rooms, work stations, and receptions.",
    benefits: [
      "Dust-free work environment for staff",
      "Sanitized keyboards, phones, and desks",
      "Deep scrubbed tiles and polished cabins"
    ],
    inclusions: [
      "Dry vacuuming of chairs and carpets",
      "Wet scrubbing of common floor spaces",
      "Sanitizing high-touch surfaces"
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "commercial-cleaning",
    name: "Commercial Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.75,
    reviewCount: 80,
    description: "Large scale cleaning solutions for retail stores, showrooms, warehouses, and hospitality structures.",
    benefits: [
      "Maintains premium brand presentation",
      "Safe non-toxic industrial cleaning agents",
      "Flexible execution slots (before/after business hours)"
    ],
    inclusions: [
      "Heavy duty single-disc floor scrubbing",
      "Glass pane and facade dusting",
      "Restroom deep cleaning & sanitization"
    ],
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bathroom-deep",
    name: "Bathroom Deep Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.75,
    reviewCount: 450,
    description: "Mechanized deep cleaning of bathroom wall tiles, commode, taps, and mirror descaling for a germ-free bathroom.",
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
    id: "washroom-cleaning",
    name: "Washroom Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.78,
    reviewCount: 160,
    description: "Regular cleaning and disinfection of toilets, washbasins, mirrors, and floor tiles to maintain premium hygiene.",
    benefits: [
      "Keeps washrooms odor-free and hygienic",
      "Preventive scaling control on metal fittings",
      "Quick and highly cost-effective upkeep"
    ],
    inclusions: [
      "Thorough scrubbing of toilet bowls and basins",
      "Mirror polishing and dry wiping of slabs",
      "Floor sanitization and deodorizing spray"
    ],
    image: "/washroom-cleaning.png"
  },
  {
    id: "sofa-cleaning",
    name: "Sofa & Furniture Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
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
    image: "/sofa-cleaning.jpg"
  },
  {
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
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
    image: "/carpet-cleaning.jpg"
  },
  {
    id: "mattress-cleaning",
    name: "Mattress Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
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
    image: "/mattress-cleaning.jpg"
  },
  {
    id: "kitchen-cleaning",
    name: "Kitchen Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.76,
    reviewCount: 110,
    description: "Thorough sanitizing and grease removal for tiles, slabs, kitchen cabinets, sink, exhaust fan, and kitchen floor.",
    benefits: [
      "Removes sticky oil layers and grease stains",
      "Sanitizes food preparation counters",
      "Restores luster to stainless steel items"
    ],
    inclusions: [
      "Degreasing cabinets externally & internally (if emptied)",
      "Tile chemical scrubbing and exhaust fan cleaning",
      "Sink wash and slab cleaning"
    ],
    image: "/kitchen-cleaning.png"
  },
  {
    id: "kitchen-chimney",
    name: "Kitchen Chimney Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
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
    image: "/kitchen-chimney.jpg"
  },
  {
    id: "water-tank-sump",
    name: "Water Tank & Sump Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.90,
    reviewCount: 380,
    description: "6-stage mechanized cleaning of overhead residential water tanks and underground sumps. Removes mud sediment, algae buildup, and sanitizes storage.",
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
    image: "/water-tank.jpg"
  },
  {
    id: "water-tank",
    name: "Water Tank Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.85,
    reviewCount: 210,
    description: "Professional cleaning and sanitization of overhead water tanks. Removes mud, algae, and disinfects using UV sterilization.",
    benefits: [
      "Removes mud sediment and algae buildup",
      "Maintains clean water for drinking & bathing",
      "UV disinfection to kill lingering pathogens"
    ],
    inclusions: [
      "Mechanized dewatering of dirty water",
      "High-pressure jet wash of walls & floor",
      "UV ray sterilizer scanning"
    ],
    image: "/water-tank.jpg"
  },
  {
    id: "underground-tank",
    name: "Underground Tank & Sump Cleaning",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
    rating: 4.80,
    reviewCount: 140,
    description: "Deep cleaning and mechanized sludge removal for underground water tanks and sumps. Restores hygiene and prevents contamination.",
    benefits: [
      "Removes deep-set mud sediment and slime",
      "Prevents water pump blockages",
      "Anti-bacterial treatment to kill lingering pathogens"
    ],
    inclusions: [
      "Mechanized dewatering of dirty water",
      "High-pressure jet wash of walls & floor",
      "Vacuuming sludge slurry",
      "Anti-bacterial wall spray treatment"
    ],
    image: "/water-tank.jpg"
  },
  {
    id: "floor-scrubbing",
    name: "Floor Scrubbing & Polishing",
    category: "cleaning",
    price: 0,
    originalPrice: 0,
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
    image: "/floor-scrubbing.jpg"
  },
  {
    id: "home-maintenance",
    name: "Home Maintenance Services",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
    rating: 4.82,
    reviewCount: 75,
    description: "Comprehensive home inspection, minor fixes, and alignment tasks executed by expert local technicians.",
    benefits: [
      "All-in-one check for doors, locks, leaks, and bulbs",
      "Reliable advice on pending structural maintenance",
      "Extremely convenient hourly assistance rates"
    ],
    inclusions: [
      "Checking electrical outlets and plumbing joints",
      "Tightening hinges and latch checks",
      "Report generation for further repairs"
    ],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ac-service",
    name: "AC Service & Repair",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
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
    price: 0,
    originalPrice: 0,
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
    price: 0,
    originalPrice: 0,
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
    id: "carpenter",
    name: "Carpenter Services",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
    rating: 4.80,
    reviewCount: 88,
    description: "Door alignment, drawer track fixes, furniture repair, latch installations, and general woodwork tasks.",
    benefits: [
      "Precise leveling for squeak-free cabinet doors",
      "Heavy duty hardware fitting replacements",
      "Neat finish with professional woodworking machinery"
    ],
    inclusions: [
      "Hinge replacement and lock fitting",
      "Furniture scratch repair and leg level adjustments",
      "Drilling brackets for wall shelves"
    ],
    image: "/carpenter.png"
  },
  {
    id: "painting",
    name: "Painting Services",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
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
    id: "other-services",
    name: "Other Services",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
    rating: 4.70,
    reviewCount: 40,
    description: "Custom handyman works, specialized maintenance requests, and general assistance in Raichur.",
    benefits: [
      "Covers unique maintenance requests not listed",
      "Reliable custom task assessments",
      "Fast response with adaptive tooling"
    ],
    inclusions: [
      "Discussing specific tasks on-site",
      "Providing customized estimates",
      "Ensuring clean work completion"
    ],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pest-control",
    name: "Pest Control",
    category: "maintenance",
    price: 0,
    originalPrice: 0,
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
    price: 0,
    originalPrice: 0,
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
    image: "/solar-panel.jpg"
  },
  {
    id: "solar-water-heater",
    name: "Solar Water Heater Cleaning",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.80,
    reviewCount: 65,
    description: "De-scaling and cleaning of vacuum glass tubes and inner hot water tanks to restore optimal heating efficiency.",
    benefits: [
      "Restores solar heat absorption levels",
      "Prevents corrosion and scale blocks",
      "Ensures hot water flow at higher speeds"
    ],
    inclusions: [
      "Chemical flush of scale sediment",
      "Polishing outer support frame",
      "Glass tube wiping and leakage inspection"
    ],
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "car-wash",
    name: "Doorstep Car Wash",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.79,
    reviewCount: 190,
    description: "Eco-friendly exterior foam wash, dashboard vacuuming, and mirror polishing at your own doorstep.",
    benefits: [
      "Saves fuel and time spent at washing bays",
      "Premium gloss-inducing car shampoo used",
      "Interior dusting and tire shining included"
    ],
    inclusions: [
      "High pressure water jet wash of body & wheels",
      "Interior carpet vacuuming",
      "Glass polishing and dashboard polishing"
    ],
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bike-wash",
    name: "Bike Wash",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.76,
    reviewCount: 145,
    description: "Pressure wash and degreasing for motorcycles and scooters, complete with engine area dust extraction.",
    benefits: [
      "Removes mud grease from chain and sprockets",
      "Doorstep execution convenience",
      "Anti-rust polish application on metallic components"
    ],
    inclusions: [
      "Chain wash and body cleaning",
      "Tire scrub and spray rinse",
      "Hand buffing with protective polish"
    ],
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "packers-movers",
    name: "Packers & Movers",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.88,
    reviewCount: 95,
    description: "Inter-city and intra-city house shifting service with high-quality box packing and loading/unloading assistance.",
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
    image: "/packers-movers.jpg"
  },
  {
    id: "home-shifting",
    name: "Home Shifting",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.86,
    reviewCount: 110,
    description: "Hassle-free household home shifting services across Raichur. Includes professional packing, loading, transport, and unloading.",
    benefits: [
      "Experienced local shifting crew",
      "Careful handling of electronics & fragile items",
      "Safe and covered transport vehicles"
    ],
    inclusions: [
      "Bubble wrapping of fragile items",
      "Loading and secure stacking",
      "Safe transport to new destination",
      "Unloading and placing in designated rooms"
    ],
    image: "/packers-movers.jpg"
  },
  {
    id: "decoration-services",
    name: "Decoration Services",
    category: "others",
    price: 0,
    originalPrice: 0,
    rating: 4.85,
    reviewCount: 78,
    description: "Birthday parties, anniversaries, corporate launches, and balloon decoration works in Raichur.",
    benefits: [
      "Custom themes matching your occasion ideas",
      "Fast decorations within a few hours on-site",
      "Stunning visual setups for photoshoot backdrops"
    ],
    inclusions: [
      "Balloon arches and stage backdrops",
      "LED lights setup",
      "Post-event cleaning of decoration debris"
    ],
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
  }
];

export const getOrderedServices = (apiServices = []) => {
  if (!apiServices || apiServices.length === 0) {
    return services;
  }
  
  // Create a map of API services for quick lookup
  const apiMap = new Map(apiServices.map(s => [s.id, s]));
  
  // Reconstruct services in exact sequence, merging database values
  return services.map(fallbackService => {
    const apiService = apiMap.get(fallbackService.id);
    if (apiService) {
      return {
        ...fallbackService,
        ...apiService,
        id: fallbackService.id, // Enforce strict id matching
        name: fallbackService.name, // Keep exact clean name
        category: fallbackService.category, // Keep exact clean category
        image: fallbackService.image // Enforce local high-quality verified images
      };
    }
    return fallbackService;
  });
};

export default services;
export { services };
