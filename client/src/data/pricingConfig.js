// S A Raichur Service Point - Centralized Pricing and Options Configuration
// Set any value to 0 to enable the "Contact for Quote" flow.

export const pricingConfig = {
  // Home Deep Cleaning
  "home-deep": {
    "1 BHK": 4999,
    "2 BHK": 5999,
    "3 BHK": 7999,
    "Duplex House": 0, // 0 = Contact for Quote
    "Bungalow": 0,
    "Commercial Place": 0,
    "Shop": 0,
    "Office": 0
  },

  // Water Tank & Sump Cleaning
  "water-tank-sump": {
    // Overhead Tank Capacity Options
    "overhead": {
      "500L": 0,
      "1000L": 0,
      "2000L": 0,
      "5000L": 0
    },
    // Underground Sump Capacity Options
    "underground": {
      "1000L": 0,
      "2000L": 0,
      "5000L": 0
    },
    // Surcharges or custom rates can be added here
    "ring-type": 0,
    "box-type": 0
  },

  // Sofa & Furniture Cleaning
  "sofa-cleaning": {
    "1 Seater": 0,
    "2 Seater": 0,
    "3 Seater": 0,
    "4 Seater": 0,
    "5 Seater": 0
  },

  // Carpet Cleaning
  "carpet-cleaning": {
    "ratePerSqFt": 0, // Price per sq. ft.
    "minCharge": 0    // Minimum charge for carpet cleaning
  },

  // Mattress Cleaning
  "mattress-cleaning": {
    "Single": 0,
    "Double": 0,
    "Queen": 0,
    "King": 0
  },

  // Packers & Movers
  "packers-movers": {
    "1 BHK": 0,
    "2 BHK": 0,
    "3 BHK": 0,
    "Duplex": 0,
    "Bungalow": 0,
    "Other": 0,
    "chargePerFloor": 0 // Additional charge per floor level
  }
};

export default pricingConfig;
