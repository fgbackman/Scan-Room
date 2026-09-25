import { RoomAnalysisResult } from '../types';

export interface DemoRoom {
  id: string;
  title: string;
  roomType: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  analysis: RoomAnalysisResult;
}

export const DEMO_ROOMS: DemoRoom[] = [
  {
    id: 'demo-home-office',
    title: 'Disorganized Home Office & Desk',
    roomType: 'Home Office',
    imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=400&q=80',
    description: 'Tangled cables, stacks of paper documents, loose pens, and overflowing tabletop surface.',
    analysis: {
      roomType: 'Home Office',
      overallScore: 42,
      clutterLevel: 'Substantial',
      executiveSummary: 'This workspace possesses great natural light and functional desk real estate, but visual noise and loose paper clutter are draining focus. By zoning desktop zones and implementing vertical cable and paper management, this can transform into a high-productivity sanctuary.',
      metrics: {
        surfaceClutter: 8,
        storageUtilization: 4,
        floorPathways: 7,
        visualCalmIndex: 3,
      },
      identifiedZones: [
        {
          id: 'zone-1',
          name: 'Primary Desk Surface',
          status: 'Critical Attention',
          observation: 'Multiple uncategorized piles of receipts, loose tech cords, coffee mugs, and notebooks covering 70% of reachable surface.',
          actionRequired: 'Execute a total desk sweep into a triage tray; maintain only keyboard, mouse, and active single-day project notebook on top.',
        },
        {
          id: 'zone-2',
          name: 'Under-Desk Footwell & Cables',
          status: 'Needs Tweaking',
          observation: 'Tangled surge protector and power bricks dangling in the legroom area, creating both safety and visual hazard.',
          actionRequired: 'Install an under-desk cable management tray and bundle cords with velcro wraps.',
        },
        {
          id: 'zone-3',
          name: 'Side Shelving / Bookshelf',
          status: 'Needs Tweaking',
          observation: 'Books placed horizontally and vertically without order, empty boxes taking up premium lower shelf space.',
          actionRequired: 'Discard empty packaging, align books vertically, and insert closed magazine file holders for loose paperwork.',
        },
      ],
      itemTriage: [
        {
          category: 'Keep & Relocate',
          itemNames: ['Current active notebooks', 'Laptop charger', 'Reference tech manuals', 'Ergonomic mousepad'],
          rationale: 'Essential daily productivity tools that currently lack designated homes.',
          suggestedDestination: 'Upper desk drawer with custom acrylic dividers.',
        },
        {
          category: 'Donate / Gift',
          itemNames: ['Duplicate USB cables', 'Old textbooks', 'Unused corporate conference swag mugs'],
          rationale: 'Functional items no longer actively needed taking up critical office space.',
          suggestedDestination: 'Local electronics recycling drive & public library donation bin.',
        },
        {
          category: 'Recycle / Trash',
          itemNames: ['Expired receipts (2021-2023)', 'Dried out ballpoint pens', 'Cardboard shipping boxes'],
          rationale: 'Zero legal retention value and obsolete stationery.',
          suggestedDestination: 'Paper shredder and recycling bin.',
        },
        {
          category: 'Sell / Consign',
          itemNames: ['Second unused external monitor', 'Mechanical keyboard in box'],
          rationale: 'High resale value gadgets currently gathering dust.',
          suggestedDestination: 'List on local marketplace or tech trade-in.',
        },
      ],
      actionPlan: [
        {
          phase: 'Phase 1: 5-Minute Quick Wins',
          estimatedMinutes: 5,
          tasks: [
            {
              id: 'task-1',
              title: 'The Tabletop Sweep',
              description: 'Collect all empty cups, wrappers, junk mail, and dried-up pens into a waste bin.',
              difficulty: 'Easy',
              tips: 'Do not make complex decisions yet—only toss obvious non-essentials.',
            },
            {
              id: 'task-2',
              title: 'Wipe & Clear Screen Perimeter',
              description: 'Remove sticky notes and peripheral clutter from directly around the monitor.',
              difficulty: 'Easy',
              tips: 'Consolidate active to-dos into one single notebook page.',
            },
          ],
        },
        {
          phase: 'Phase 2: 20-Minute Zone Sorting',
          estimatedMinutes: 20,
          tasks: [
            {
              id: 'task-3',
              title: 'Paper Mountain Triage',
              description: 'Sort paperwork into 3 simple folders: Action Required, To File / Scan, and Shred.',
              difficulty: 'Medium',
              tips: 'Digitize tax receipts and discard physical slips when acceptable.',
            },
            {
              id: 'task-4',
              title: 'Cord Containment Sprint',
              description: 'Unplug tangled cords, label each end with washi tape, and guide into a surge strip.',
              difficulty: 'Medium',
              tips: 'Keep only 1 phone charger cable reachable on the desk top.',
            },
          ],
        },
        {
          phase: 'Phase 3: Deep System Organization',
          estimatedMinutes: 35,
          tasks: [
            {
              id: 'task-5',
              title: 'Implement the "One Touch" Drawer System',
              description: 'Slot acrylic drawer dividers into top drawer for pens, paperclips, flash drives.',
              difficulty: 'Medium',
              tips: 'Every tool must have a designated home it can be returned to in 2 seconds.',
            },
            {
              id: 'task-6',
              title: 'Vertical Wall Storage or Pinboard',
              description: 'Mount a corkboard or pegboard to lift references and calendar off the desk.',
              difficulty: 'Challenging',
              tips: 'Leaves 100% of your wood desk clear for actual typing and reading.',
            },
          ],
        },
      ],
      storageSolutions: [
        {
          title: 'Under-Desk Wire Mesh Cable Raceway',
          targetZone: 'Desk Footwell',
          purpose: 'Suspends power strip and excess cabling completely off the floor.',
          budgetLevel: '$',
          diyAlternative: 'Zip-tie surge protector to the underside crossbar using heavy duty velcro strips.',
        },
        {
          title: '3-Tier Minimalist Acrylic Paper Sorter',
          targetZone: 'Desk Right Corner',
          purpose: 'Keeps active priority docs visible without sprawling across the table.',
          budgetLevel: '$$',
          diyAlternative: 'Repurpose shallow cardboard gift box lids decorated with contact paper.',
        },
        {
          title: 'Modular Felt Drawer Organizers',
          targetZone: 'Primary Desk Drawer',
          purpose: 'Prevents pens and small accessories from sliding into a chaotic junk drawer.',
          budgetLevel: '$',
          diyAlternative: 'Use empty clean tea tins or iPhone boxes as compartments.',
        },
      ],
      spatialLayoutTips: [
        'Shift the desk 6 inches away from the wall to create breathing room for cable drops.',
        'Angle your monitor slightly away from the window to eliminate harsh glare and eye strain.',
        'Keep the dominant hand side (right side) completely unobstructed for free arm movement.',
      ],
      motivationalQuote: '“A clear desk reflects and cultivates an uncluttered mind.” — Step by step, focus returns.',
      modelUsed: 'gemini-3.1-pro-preview',
    },
  },
  {
    id: 'demo-bedroom-closet',
    title: 'Overflowing Bedroom Closet & Wardrobe',
    roomType: 'Closet & Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=400&q=80',
    description: 'Hangers jammed together, pile of shoes on the floor, disorganized top shelf with overflowing totes.',
    analysis: {
      roomType: 'Closet & Wardrobe',
      overallScore: 38,
      clutterLevel: 'Substantial',
      executiveSummary: 'The wardrobe suffers from horizontal compression—too many mismatched hangers squeezed together, preventing garments from breathing. The floor has become a drop zone for footwear. With uniform hangers and shelf bins, storage capacity can increase by 40%.',
      metrics: {
        surfaceClutter: 7,
        storageUtilization: 3,
        floorPathways: 4,
        visualCalmIndex: 3,
      },
      identifiedZones: [
        {
          id: 'zone-c1',
          name: 'Main Hanging Rail',
          status: 'Critical Attention',
          observation: 'Severe over-stuffing; garments are crumpled and difficult to browse or slide.',
          actionRequired: 'Apply the hanger-reverse test and cull garments not worn in the past 12 months.',
        },
        {
          id: 'zone-c2',
          name: 'Closet Floor Base',
          status: 'Critical Attention',
          observation: 'Unpaired shoes, shopping bags, and fallen clothes burying the base.',
          actionRequired: 'Elevate footwear onto a 2-tier shoe rack or hanging door organizer; leave floor bare.',
        },
        {
          id: 'zone-c3',
          name: 'Overhead Shelf',
          status: 'Needs Tweaking',
          observation: 'Unlabeled stacks of off-season knitwear leaning and threatening to tumble.',
          actionRequired: 'Install fabric shelf dividers or breathable canvas zip-bins labeled by season.',
        },
      ],
      itemTriage: [
        {
          category: 'Keep & Relocate',
          itemNames: ['Core seasonal capsules', 'Beloved jackets', 'Workwear essentials'],
          rationale: 'Frequently worn favorites that deserve proper velvet hanging space.',
          suggestedDestination: 'Grouped by category (shirts, trousers, dresses) from light to dark.',
        },
        {
          category: 'Donate / Gift',
          itemNames: ['Ill-fitting jeans', 'Duplicates of basic tees', 'Formal shoes worn once'],
          rationale: 'Good condition garments waiting for a second life with someone who will wear them.',
          suggestedDestination: 'Local community clothing bank or shelter.',
        },
        {
          category: 'Recycle / Trash',
          itemNames: ['Stretched wire dry-cleaner hangers', 'Worn out socks', 'Broken plastic bins'],
          rationale: 'Wire hangers damage fabric shoulders and create visual chaos.',
          suggestedDestination: 'Return wire hangers to dry cleaners for reuse; textile recycling for fabric scraps.',
        },
        {
          category: 'Sell / Consign',
          itemNames: ['Designer winter coat unworn', 'Leather handbag with tags'],
          rationale: 'High demand designer pieces capable of fetching substantial resale cash.',
          suggestedDestination: 'Online consignment platforms (Poshmark, ThredUp, or local boutique).',
        },
      ],
      actionPlan: [
        {
          phase: 'Phase 1: 5-Minute Quick Wins',
          estimatedMinutes: 5,
          tasks: [
            {
              id: 'task-c1',
              title: 'Clear the Floor Drop Zone',
              description: 'Pick up all fallen clothes and bags off the closet floor into a central laundry basket.',
              difficulty: 'Easy',
              tips: 'Immediately creates visual space to stand and sort.',
            },
            {
              id: 'task-c2',
              title: 'Purge Broken Hangers',
              description: 'Remove mismatched plastic and wire dry-cleaner hangers.',
              difficulty: 'Easy',
              tips: 'Uniform slim velvet hangers instantly double rail capacity.',
            },
          ],
        },
        {
          phase: 'Phase 2: 20-Minute Zone Sorting',
          estimatedMinutes: 20,
          tasks: [
            {
              id: 'task-c3',
              title: 'The 3-Second Joy & Fit Filter',
              description: 'Go down the rail and pull out anything with tags still on, that feels scratchy, or doesn’t fit.',
              difficulty: 'Medium',
              tips: 'Be ruthlessly honest: if you wouldn’t buy it right now in a store, it’s ready to go.',
            },
            {
              id: 'task-c4',
              title: 'Shoe Pairing & Elevation',
              description: 'Match pairs of shoes and sort by frequency of wear (daily vs occasional).',
              difficulty: 'Medium',
              tips: 'Put occasional formal shoes in clear boxes on the top shelf.',
            },
          ],
        },
        {
          phase: 'Phase 3: Deep System Organization',
          estimatedMinutes: 30,
          tasks: [
            {
              id: 'task-c5',
              title: 'Color & Length Spectrum Hanging',
              description: 'Hang clothes facing the same direction, ordered by sleeve length and ascending shades.',
              difficulty: 'Medium',
              tips: 'Creates a boutique-like visual calm every time you open the doors.',
            },
          ],
        },
      ],
      storageSolutions: [
        {
          title: 'Slim Non-Slip Velvet Hangers (Pack of 50)',
          targetZone: 'Main Rail',
          purpose: 'Saves up to 50% horizontal hanging space and keeps straps from slipping.',
          budgetLevel: '$',
          diyAlternative: 'Wrap rubber bands around the ends of wooden hangers to prevent slips.',
        },
        {
          title: 'Over-The-Door Clear Pocket Organizer',
          targetZone: 'Closet Door Interior',
          purpose: 'Houses scarves, belts, jewelry, sunglasses, or compact footwear.',
          budgetLevel: '$',
          diyAlternative: 'Install adhesive shower curtain hooks on the inside door panel.',
        },
        {
          title: 'Clear Acrylic Shelf Dividers',
          targetZone: 'Top Shelf',
          purpose: 'Keeps folded sweaters and purses from toppling into each other.',
          budgetLevel: '$$',
          diyAlternative: 'Cut sturdy white foam core board to slot between sweater piles.',
        },
      ],
      spatialLayoutTips: [
        'Add a stick-on battery LED puck light to dark closet corners—good lighting halves dressing frustration.',
        'Use the backward hanger trick: turn all hanger hooks backward; when you wear an item, turn it forward.',
        'Keep a designated "Donate Bag" in the closet corner to drop discarded items immediately.',
      ],
      motivationalQuote: '“Your closet should contain only what gives you confidence and delight today.”',
      modelUsed: 'gemini-3.1-pro-preview',
    },
  },
  {
    id: 'demo-kitchen-counter',
    title: 'Cluttered Kitchen Prep Counter',
    roomType: 'Kitchen & Pantry',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    description: 'Appliances crowding prep surface, spice jars scattered, cutting boards leaning precarious.',
    analysis: {
      roomType: 'Kitchen & Pantry',
      overallScore: 48,
      clutterLevel: 'Moderate',
      executiveSummary: 'Counter surfaces are the kitchen’s most valuable real estate. Currently, single-use specialty appliances and random condiments are stealing chopping and plating space. Re-zoning into active cooking triangles will restore culinary joy.',
      metrics: {
        surfaceClutter: 8,
        storageUtilization: 5,
        floorPathways: 8,
        visualCalmIndex: 4,
      },
      identifiedZones: [
        {
          id: 'zone-k1',
          name: 'Main Prep Island / Counter',
          status: 'Critical Attention',
          observation: 'Toaster, air fryer, blender, and bread box clustering near the primary cutting zone.',
          actionRequired: 'Enforce the "Daily Use Only" rule: store appliances used less than 3x/week in lower cabinets.',
        },
        {
          id: 'zone-k2',
          name: 'Stovetop Adjacent Spices',
          status: 'Needs Tweaking',
          observation: '15+ mismatched seasoning jars exposed to steam and grease splatter.',
          actionRequired: 'Transfer to a pull-out spice tier or shallow drawer organizer with uniform labels.',
        },
      ],
      itemTriage: [
        {
          category: 'Keep & Relocate',
          itemNames: ['Waffle maker', 'Electric mixer', 'Extra cutting boards'],
          rationale: 'Great kitchen tools that do not need permanent counter footprint.',
          suggestedDestination: 'Lower corner cabinet or deep pantry drawer.',
        },
        {
          category: 'Donate / Gift',
          itemNames: ['Duplicate garlic press', 'Novelty avocado slicer', 'Mismatched coffee tumblers'],
          rationale: 'Single-task gadgets that clutter drawers when a chef’s knife does the job.',
          suggestedDestination: 'Thrift store kitchen section.',
        },
        {
          category: 'Recycle / Trash',
          itemNames: ['Expired baking powder (2022)', 'Sauce packets from takeout', 'Chipped coffee mugs'],
          rationale: 'Degraded flavor, health risks, and physical breakage.',
          suggestedDestination: 'Food compost and recycling.',
        },
        {
          category: 'Sell / Consign',
          itemNames: ['High-end espresso machine (unopened gift)'],
          rationale: 'High resale demand in current condition.',
          suggestedDestination: 'Kitchen enthusiast forum or marketplace.',
        },
      ],
      actionPlan: [
        {
          phase: 'Phase 1: 5-Minute Quick Wins',
          estimatedMinutes: 5,
          tasks: [
            {
              id: 'task-k1',
              title: 'Takeout Condiment Eviction',
              description: 'Toss stray soy sauce, ketchup packets, and bent plastic straws.',
              difficulty: 'Easy',
              tips: 'Keep maximum 3 in a small magnetic fridge caddy if desired.',
            },
            {
              id: 'task-k2',
              title: 'Clear Sink & Dish Rack',
              description: 'Dry and put away clean dishes; wipe down the stainless steel sink basin.',
              difficulty: 'Easy',
              tips: 'A sparkling empty sink sets a calming tone for the entire kitchen.',
            },
          ],
        },
        {
          phase: 'Phase 2: 20-Minute Zone Sorting',
          estimatedMinutes: 20,
          tasks: [
            {
              id: 'task-k3',
              title: 'Appliance Counter Audit',
              description: 'Put away any appliance not used this morning or yesterday.',
              difficulty: 'Medium',
              tips: 'Only kettle or coffee maker should claim permanent countertop residency.',
            },
          ],
        },
        {
          phase: 'Phase 3: Deep System Organization',
          estimatedMinutes: 25,
          tasks: [
            {
              id: 'task-k4',
              title: 'Create the Cooking Zone',
              description: 'Arrange cooking oils, salt cellar, and pepper grinder onto a clean ceramic tray beside the stove.',
              difficulty: 'Easy',
              tips: 'Trays corral clutter and make wiping counters 5x faster.',
            },
          ],
        },
      ],
      storageSolutions: [
        {
          title: 'Ceramic Catch-All Oil & Salt Tray',
          targetZone: 'Stove Perimeter',
          purpose: 'Contains drips and turns loose bottles into an intentional styled vignette.',
          budgetLevel: '$',
          diyAlternative: 'A flat thrifted dinner plate or marble tile piece.',
        },
        {
          title: 'Expandable Bamboo Drawer Cutlery Tray',
          targetZone: 'Main Prep Drawer',
          purpose: 'Customizes width to fit chef knives, spatulas, and peelers neatly separated.',
          budgetLevel: '$$',
          diyAlternative: 'Repurpose cardboard jewelry boxes or small plastic organizers.',
        },
      ],
      spatialLayoutTips: [
        'Establish a triangle between sink, stove, and fridge with at least 3 feet of completely bare prep counter.',
        'Mount a magnetic knife strip to the backsplash to free up bulky knife block space.',
      ],
      motivationalQuote: '“An uncluttered kitchen invites home cooking, hospitality, and peaceful mornings.”',
      modelUsed: 'gemini-3.1-pro-preview',
    },
  },
];
