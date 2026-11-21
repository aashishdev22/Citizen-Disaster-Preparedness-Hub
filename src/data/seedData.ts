import {
  AlertItem,
  AppNotification,
  DisasterGuide,
  EmergencyContact,
  EvacuationPlan,
  FamilyMember,
  IncidentReport,
  KitItem,
  ShelterItem,
  UserProfile,
  VolunteerMember,
  VolunteerRequest,
  WeatherForecastSnapshot,
} from '../types';

export const AVATAR_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrDLg40tbrO5J_V_36H-J-G4aOBDioFjMF4XTfQoOFmrZ3Ft4hBlGwgR0dcC9E27sC8mmNhnBQufUOef0NS73T3rx9RL_wQLs5pKjid10GNQQB07GDk2eXAZUxW9iZkewfxwyWVf8b7TUS3COlthfU4lOyc_XDdKyhctdeVKa3CdyTzlnKD7bTNCqyXdnMhvcpeZquaE--fJZJl8JEwC1pxnoMLCupW5tYchvMIPjkfPneLixFVN3XBWBw';

export const WATERLOGGING_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrCOmlRhnLf7tPIn4NPC0nEJ35vXXoTTS9L8ryS22q2XjlOC5KXhrWCMOaoKEFvDO85aboEAaSgZ0FsO1W9wW1K9v7Q5xNc23nVsoBm44_4oSXQ_3Q98uWT1ebAmRw6rlO39DKeuIrSgsNhRyi4k1wlj5pVvJ_ns9RSY4ryiMHcml95QPRzlmo2TNjOJzAZjMGqxeT_LyQybYbYMurd0htMQ7KI0aUqNngra1A7-2Ac18cJl8rR1-_RpZ64U-HB6-Cw';

export const LOCATION_OPTIONS = [
  { label: 'Dadar West, Mumbai', tag: 'Current GPS', district: 'Mumbai Suburban, Maharashtra' },
  { label: 'Kurla East, Mumbai', tag: '', district: 'Mumbai Suburban, Maharashtra' },
  { label: 'Bandra West, Mumbai', tag: '', district: 'Mumbai Suburban, Maharashtra' },
];

export const INITIAL_USER: UserProfile = {
  name: 'Aarav Sharma',
  phone: '+91 98204 51234',
  email: 'aarav.sharma@example.in',
  locationLabel: 'Dadar West, Mumbai',
  districtState: 'Mumbai Suburban, Maharashtra',
  avatarUrl: AVATAR_IMAGE_URL,
  isGuest: false,
};

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-mithi',
    severity: 'critical',
    severityLabel: 'Critical • Flood',
    categories: ['critical', 'flood'],
    icon: 'flood',
    title: 'Mithi River Crosses Danger Mark',
    shortTitle: 'Mithi River Water Level Advisory',
    area: 'Kurla West, Sion, Chunabhatti • Source: BMC & SDMA',
    source: 'BMC Disaster Cell & Maharashtra SDMA',
    distanceTime: '4.2 km away • 18m ago',
    summary:
      'Water level reached 2.9m due to continuous downpour and incoming high tide. Evacuate ground-floor basements and avoid Sion–Kurla road.',
    instructions:
      'Move immediately to higher floors or BMC Kurla Relief Camp. Do not drive through submerged underpasses. Disconnect ground-floor electrical mains.',
    dos: ['Move to higher ground', 'Keep 112 & torch handy'],
    donts: ["Don't walk in floodwater", "Don't touch fallen wires"],
    isRead: false,
  },
  {
    id: 'alert-imd-orange',
    severity: 'warning',
    severityLabel: 'Warning • Heavy Rain',
    categories: ['weather'],
    icon: 'thunderstorm',
    title: 'IMD Orange Alert: Very Heavy Rain',
    shortTitle: 'IMD Orange Alert: Very Heavy Rain',
    area: 'Mumbai City & Suburban • Source: IMD Mumbai',
    source: 'India Meteorological Department (IMD)',
    distanceTime: 'Your Area • 45m ago',
    summary:
      '115–204 mm rainfall forecast over the next 12 hours with gusty winds up to 50 km/h. Stay indoors unless travel is essential.',
    instructions:
      'Charge power banks, keep emergency kit ready, and avoid coastal promenades during 17:40 IST high tide.',
    dos: ['Charge power banks & phones', 'Keep emergency kit ready'],
    donts: ['Avoid coastal promenades', 'Avoid non-essential travel'],
    isRead: false,
  },
  {
    id: 'alert-incois',
    severity: 'advisory',
    severityLabel: 'Advisory • High Swell',
    categories: ['weather'],
    icon: 'waves',
    title: 'INCOIS High Wave Advisory',
    shortTitle: 'INCOIS High Wave Advisory',
    area: 'Dadar Chowpatty, Worli Sea Face • Source: INCOIS',
    source: 'INCOIS & Coast Guard',
    distanceTime: '1.8 km away • 2h ago',
    summary:
      'High waves of 3.2m–3.8m forecast along Konkan coast. Fishermen advised not to venture into sea.',
    instructions:
      'High waves of 3.2m–3.8m forecast along Konkan coast. Avoid seafront promenades during high tide at 17:40 IST.',
    dos: ['Stay away from seawalls & jetties', 'Monitor coast guard advisories'],
    donts: ['Do not venture into the sea', 'Avoid beach promenades at high tide'],
    isRead: false,
  },
  {
    id: 'alert-palghar',
    severity: 'info',
    severityLabel: 'Information • Seismic',
    categories: ['quake'],
    icon: 'earthquake',
    title: 'Minor Tremor M 3.1 — Palghar',
    shortTitle: 'Minor Tremor M 3.1 — Palghar',
    area: 'Palghar District • Source: NCS (National Center for Seismology)',
    source: 'National Center for Seismology (NCS)',
    distanceTime: '92 km away • 5h ago',
    summary:
      'No damage reported. No tsunami threat. Review Drop, Cover, and Hold On guide as a precaution.',
    instructions:
      'No structural damage reported in Mumbai or Palghar. Check home emergency exits and review earthquake readiness.',
    dos: ['Review Drop, Cover & Hold On', 'Secure heavy wall shelves'],
    donts: ['Do not spread unverified rumors', 'Do not use elevators during tremors'],
    isRead: true,
  },
];

export const INITIAL_SHELTERS: ShelterItem[] = [
  {
    id: 'shelter-dadar',
    type: 'shelter',
    name: 'BMC Dadar Relief Shelter',
    shortName: 'BMC Dadar Shelter',
    badgeText: '180 / 300 beds open',
    distance: '1.4 km',
    driveTime: '6 min drive',
    address: 'Gokhale Road, Dadar West • Wheelchair Accessible',
    facilities: 'Drinking water, backup generator, medical desk, wheelchair ramp',
    phone: '+91 22 2430 1122',
    icon: 'night_shelter',
    mapX: 66,
    mapY: 31,
  },
  {
    id: 'hospital-kem',
    type: 'hospital',
    name: 'KEM Hospital Trauma Center',
    shortName: 'KEM Hospital',
    badgeText: '24/7 Emergency Open',
    distance: '2.1 km',
    driveTime: '9 min drive',
    address: 'Acharya Donde Marg, Parel • Ambulance Bay',
    facilities: 'Trauma ICU, ambulance bay, blood bank, dialysis unit',
    phone: '+91 22 2413 6051',
    icon: 'local_hospital',
    mapX: 33,
    mapY: 68,
  },
  {
    id: 'fire-dadar',
    type: 'emergency',
    name: 'Dadar Fire & Rescue Station',
    shortName: 'Dadar Fire & Rescue',
    badgeText: '2 Rescue Boats Ready',
    distance: '1.8 km',
    driveTime: '7 min drive',
    address: 'Shivaji Park • 2 Inflatable Rescue Boats',
    facilities: 'Flood rescue unit, ambulance dispatch, 112 relay',
    phone: '101',
    icon: 'local_fire_department',
    mapX: 34,
    mapY: 22,
  },
  {
    id: 'shelter-matunga',
    type: 'shelter',
    name: 'Matunga Community Hall Camp',
    shortName: 'Matunga Relief Camp',
    badgeText: '95 / 150 beds open',
    distance: '3.0 km',
    driveTime: '11 min drive',
    address: 'Bhandarkar Road, Matunga East • First Aid Desk',
    facilities: 'Hot meals, elder care volunteers, drinking water, charging station',
    phone: '+91 22 2414 3300',
    icon: 'night_shelter',
    mapX: 78,
    mapY: 52,
  },
];

export const INITIAL_GUIDES: DisasterGuide[] = [
  {
    id: 'flood',
    title: 'Flood Safety',
    subtitle: 'Evacuation & water safety',
    searchKeywords: 'flood safety monsoon urban waterlogging',
    icon: 'flood',
    iconColorClass: 'text-light-secondary',
    downloaded: true,
    bookmarked: false,
    beforeSteps: [
      'Seal Aadhaar, property papers, and medical prescriptions in a waterproof zip pouch inside your emergency kit.',
      'Charge power banks and keep 3 days of drinking water (3L per person/day) and dry snacks ready.',
      'Identify the nearest elevated BMC/municipal relief shelter and agree on a family meeting point.',
    ],
    duringWarning:
      'Just 15 cm of moving floodwater can knock you down. Never walk or drive through submerged roads or underpasses.',
    duringDos: [
      'Switch off main electricity and LPG gas valve before evacuating.',
      'Move to upper floors or designated relief shelters immediately.',
      'Listen to official AIR/NDMA/IMD updates on battery radio or app.',
    ],
    duringDonts: [
      'Do not touch wet electrical poles, switches, or fallen cables.',
      'Do not drive into flooded underpasses or fast-flowing drains.',
    ],
    afterSteps: [
      'Drink only boiled or chlorinated water until municipal supply is cleared.',
      'Watch for snakes, insects, and structural cracks before re-entering ground floors.',
      'Report damaged roads or electric hazards via Community Incident Reporting.',
    ],
  },
  {
    id: 'earthquake',
    title: 'Earthquake',
    subtitle: 'Drop, Cover, Hold On',
    searchKeywords: 'earthquake seismic tremor drop cover hold on',
    icon: 'earthquake',
    iconColorClass: 'text-light-primary',
    downloaded: true,
    bookmarked: false,
    beforeSteps: [
      'Bolt heavy bookcases, geysers, and wardrobes to wall studs and keep heavy items on lower shelves.',
      'Identify safe cover spots in every room away from windows, mirrors, and overhead fans.',
      'Store sturdy shoes and a flashlight beside your bed for night tremors.',
    ],
    duringWarning:
      'Most earthquake injuries happen from falling objects and running outside during shaking. Drop, Cover, and Hold On immediately.',
    duringDos: [
      'Drop to your hands and knees, take cover under a sturdy table, and protect your head and neck.',
      'If outdoors, move into an open space away from buildings, trees, and streetlights.',
      'Stay inside until shaking stops completely, then use stairs to exit.',
    ],
    duringDonts: [
      'Do not use elevators during or immediately after an earthquake.',
      'Do not stand in doorways or near glass windows.',
    ],
    afterSteps: [
      'Expect aftershocks and check for gas leaks before switching on electrical appliances.',
      'Use SMS or Family Safety Check-In instead of voice calls to keep networks clear.',
      'Inspect building columns for deep cracks before re-entering.',
    ],
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    subtitle: 'Extinguisher & smoke exit',
    searchKeywords: 'fire safety smoke extinguisher burn evacuation',
    icon: 'local_fire_department',
    iconColorClass: 'text-light-error',
    downloaded: true,
    bookmarked: false,
    beforeSteps: [
      'Install smoke alarms on every level and keep an ABC fire extinguisher near the kitchen exit.',
      'Keep stairwells and emergency exit corridors clear of shoe racks or clutter.',
      'Know the location of the main LPG shutoff valve and building fire assembly point.',
    ],
    duringWarning:
      'Smoke rises quickly and is more lethal than flames. Stay low below the smoke layer while exiting.',
    duringDos: [
      'Alert neighbors, trigger the fire alarm, and evacuate using the nearest smoke-free staircase.',
      'Test closed doors with the back of your hand before opening; seal gaps with wet cloth if trapped.',
      'Call 101 or 112 once safely outside.',
    ],
    duringDonts: [
      'Never use lifts during a fire emergency.',
      'Never pour water on an oil or electrical fire.',
    ],
    afterSteps: [
      'Do not re-enter the building until the Fire Brigade declares it structurally safe.',
      'Seek immediate medical attention for smoke inhalation even if symptoms seem mild.',
      'Document property damage after authorities clear the site.',
    ],
  },
  {
    id: 'cyclone',
    title: 'Cyclone',
    subtitle: 'Coastal shelter & storm',
    searchKeywords: 'cyclone storm wind coastal shelter',
    icon: 'cyclone',
    iconColorClass: 'text-light-warning',
    downloaded: true,
    bookmarked: false,
    beforeSteps: [
      'Trim dead tree branches and secure loose tin sheets, flower pots, and outdoor furniture.',
      'Stock 72 hours of drinking water, dry food, candles/flashlights, and fully charged power banks.',
      'Follow IMD cyclone track bulletins and evacuate coastal low-lying homes early when advised.',
    ],
    duringWarning:
      'A sudden calm during a cyclone may be the eye of the storm—violent winds will resume from the opposite direction.',
    duringDos: [
      'Stay in an interior windowless room or designated cyclone shelter.',
      'Unplug electrical appliances and turn off gas connections.',
      'Keep listening to AIR radio or official NDMA alerts.',
    ],
    duringDonts: [
      'Do not step outside during the calm eye of the cyclone.',
      'Do not shelter under unstable sheds or tall trees.',
    ],
    afterSteps: [
      'Wait for official all-clear before leaving shelters.',
      'Avoid loose power lines and flooded roads.',
      'Boil drinking water and report downed poles to civic authorities.',
    ],
  },
  {
    id: 'tsunami',
    title: 'Tsunami',
    subtitle: 'High ground alerts',
    searchKeywords: 'tsunami wave coast sea high ground',
    icon: 'tsunami',
    iconColorClass: 'text-light-primary',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Know if your home or workplace lies in a coastal inundation zone.',
      'Map out a walking route to ground at least 30 meters above sea level or 2 km inland.',
    ],
    duringWarning:
      'If you feel a strong coastal earthquake or see the sea recede unusually fast, move inland immediately without waiting for sirens.',
    duringDos: [
      'Move on foot to high ground or upper floors of reinforced concrete buildings.',
      'Follow INCOIS tsunami bulletins.',
    ],
    duringDonts: [
      'Never go to the beach to watch receding water or incoming waves.',
      'Do not return after the first wave—subsequent waves are often larger.',
    ],
    afterSteps: [
      'Stay on high ground until official all-clear is broadcast.',
      'Stay clear of debris-filled floodwaters and damaged docks.',
    ],
  },
  {
    id: 'landslide',
    title: 'Landslide',
    subtitle: 'Hill slope warning signs',
    searchKeywords: 'landslide hill slope mudslide rockfall',
    icon: 'landslide',
    iconColorClass: 'text-light-warning',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Watch for tilting trees, fresh cracks in retaining walls, or muddy water emerging from slopes.',
      'Keep slope drainage channels clear before monsoon onset.',
    ],
    duringWarning:
      'Unusual rumbling sounds or sudden changes in stream water flow indicate an imminent landslide.',
    duringDos: [
      'Evacuate perpendicular to the landslide path to stable high ground.',
      'Alert neighbors and district disaster control (1070 / 112).',
    ],
    duringDonts: [
      'Do not stay near steep embankments or hill bases during intense rainfall.',
      'Do not cross active debris flows.',
    ],
    afterSteps: [
      'Stay away from the slide area as secondary slides can occur hours later.',
      'Check for broken water mains and power cables.',
    ],
  },
  {
    id: 'heatwave',
    title: 'Heatwave',
    subtitle: 'Hydration & heatstroke',
    searchKeywords: 'heatwave sunstroke hydration summer heat',
    icon: 'wb_sunny',
    iconColorClass: 'text-light-error',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Stock ORS packets, cotton clothing, and window shading before peak summer months.',
      'Check on elderly neighbors and outdoor workers daily.',
    ],
    duringWarning:
      'Avoid direct sun exposure between 12:00 PM and 3:00 PM when heat indices peak.',
    duringDos: [
      'Drink water and ORS/lemon water regularly even if not thirsty.',
      'Cover your head with a damp cloth, hat, or umbrella outdoors.',
    ],
    duringDonts: [
      'Never leave children or pets inside parked vehicles.',
      'Avoid alcohol, excessive caffeine, and strenuous midday activity.',
    ],
    afterSteps: [
      'Cool heatstroke victims with wet cloths and fan immediately while calling 108.',
      'Rest in shaded, ventilated rooms and continue rehydrating.',
    ],
  },
  {
    id: 'lightning',
    title: 'Lightning',
    subtitle: '30-30 rule & indoor safety',
    searchKeywords: 'lightning thunderstorm bolt 30-30 rule',
    icon: 'bolt',
    iconColorClass: 'text-light-warning',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Monitor IMD thunderstorm warnings and unplug sensitive electronics before storms arrive.',
      'Plan indoor shelter options during outdoor work or farming.',
    ],
    duringWarning:
      'When thunder roars, go indoors. Follow the 30-30 rule: seek shelter if thunder follows lightning within 30 seconds.',
    duringDos: [
      'Take shelter inside a concrete building or hard-topped metal vehicle with windows closed.',
      'Stay away from windows, plumbing, and corded electrical devices.',
    ],
    duringDonts: [
      'Never shelter under isolated trees, metal sheds, or open fields.',
      'Do not swim or touch water bodies during thunderstorms.',
    ],
    afterSteps: [
      'Wait at least 30 minutes after the last thunderclap before going outside.',
      'Lightning strike victims are safe to touch—begin CPR immediately and call 108/112.',
    ],
  },
  {
    id: 'chemical',
    title: 'Chemical',
    subtitle: 'Gas leak & sealing rooms',
    searchKeywords: 'chemical emergencies gas leak hazmat toxic',
    icon: 'science',
    iconColorClass: 'text-light-error',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Keep plastic sheeting, duct tape, and N95 masks in your emergency kit.',
      'Know industrial plants or fuel depots near your neighborhood.',
    ],
    duringWarning:
      'If a toxic plume is reported, shelter-in-place indoors unless authorities order immediate upwind evacuation.',
    duringDos: [
      'Close all windows, switch off AC/exhaust fans, and seal door gaps with wet towels.',
      'Cover nose and mouth with a damp cloth if moving upwind.',
    ],
    duringDonts: [
      'Do not ignite matches, lighters, or electrical switches near suspected gas leaks.',
      'Do not walk downwind of a visible chemical cloud.',
    ],
    afterSteps: [
      'Wash exposed skin and eyes with clean running water for 15 minutes.',
      'Discard exposed open food and wait for official air-quality clearance.',
    ],
  },
  {
    id: 'road-safety',
    title: 'Road Safety',
    subtitle: 'Golden hour & 108/112',
    searchKeywords: 'road accidents traffic golden hour 108',
    icon: 'car_crash',
    iconColorClass: 'text-light-primary',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Carry a basic trauma kit, reflective warning triangle, and glass-breaker tool in your vehicle.',
      'Save ICE (In Case of Emergency) contacts on your phone lock screen.',
    ],
    duringWarning:
      'Quick first-hour medical care (Golden Hour) dramatically improves survival after road trauma.',
    duringDos: [
      'Ensure scene safety, switch on hazard lights, and call 108 / 112 with exact highway landmarks.',
      'Apply firm gentle pressure on bleeding wounds with clean cloth.',
    ],
    duringDonts: [
      'Do not move victims with suspected spine/neck injuries unless there is immediate fire danger.',
      'Do not remove embedded objects or helmets abruptly.',
    ],
    afterSteps: [
      'Good Samaritans are legally protected in India when assisting accident victims.',
      'Hand over clear timeline details to responding paramedics.',
    ],
  },
  {
    id: 'collapse',
    title: 'Collapse',
    subtitle: 'Whistle & trapped survival',
    searchKeywords: 'building collapse trapped whistle rubble',
    icon: 'domain_disabled',
    iconColorClass: 'text-light-warning',
    downloaded: false,
    bookmarked: false,
    beforeSteps: [
      'Report severe structural cracks, leaning pillars, or basement seepage to BMC immediately.',
      'Keep an emergency whistle and dust mask accessible.',
    ],
    duringWarning:
      'If trapped under debris, conserve oxygen and energy—tap on pipes or blow a whistle instead of shouting continuously.',
    duringDos: [
      'Cover mouth and nose with cloth to filter concrete dust.',
      'Signal rescuers by tapping rhythmically on metal pipes or blowing a whistle.',
    ],
    duringDonts: [
      'Do not light matches or lighters due to potential gas leaks.',
      'Do not kick up dust or shift unstable beams.',
    ],
    afterSteps: [
      'Keep rescue access roads clear for NDRF and Fire Brigade cranes.',
      'Seek trauma and crush-injury medical screening.',
    ],
  },
  {
    id: 'first-aid',
    title: 'First Aid',
    subtitle: 'CPR, bleeding & burns',
    searchKeywords: 'first aid cpr bleeding burns medical',
    icon: 'medical_services',
    iconColorClass: 'text-light-success',
    downloaded: true,
    bookmarked: false,
    beforeSteps: [
      'Keep sterile gauze, bandages, antiseptic wipes, adhesive tape, and gloves stocked and unexpired.',
      'Practice hands-only CPR rhythm (100–120 compressions per minute).',
    ],
    duringWarning:
      'Check responsiveness and breathing first. Call 108 / 112 early while starting life-saving care.',
    duringDos: [
      'For cardiac arrest: push hard and fast at the center of the chest (5 cm depth).',
      'For minor burns: cool under clean running water for 20 minutes.',
      'For severe bleeding: apply steady direct pressure with sterile gauze.',
    ],
    duringDonts: [
      'Never apply toothpaste, butter, or ice directly onto burns.',
      'Never give food or liquids to an unconscious person.',
    ],
    afterSteps: [
      'Monitor vital signs until ambulance arrival and keep the patient warm.',
      'Restock used items in your Emergency Kit Checklist.',
    ],
  },
];

export const INITIAL_KIT_ITEMS: KitItem[] = [
  {
    id: 'kit-water',
    category: 'Water & Food',
    label: 'Drinking water (3L per person/day)',
    shortLabel: 'Drinking water (3L/person/day)',
    checked: true,
  },
  {
    id: 'kit-food',
    category: 'Water & Food',
    label: 'Ready-to-eat food & dry biscuits',
    shortLabel: 'Ready-to-eat dry food',
    checked: true,
  },
  {
    id: 'kit-firstaid',
    category: 'Medical',
    label: 'First aid kit & antiseptic',
    shortLabel: 'First aid kit & antiseptic',
    checked: true,
  },
  {
    id: 'kit-ors',
    category: 'Medical',
    label: 'ORS packets & 7-day regular medicines',
    shortLabel: 'ORS & 7-day medicines',
    checked: false,
  },
  {
    id: 'kit-flashlight',
    category: 'Electronics',
    label: 'LED Flashlight & 20,000mAh power bank',
    shortLabel: 'Flashlight & power bank',
    checked: true,
  },
  {
    id: 'kit-batteries',
    category: 'Electronics',
    label: 'Spare AA batteries & battery FM radio',
    shortLabel: 'Spare AA batteries & FM radio',
    checked: false,
  },
  {
    id: 'kit-docs',
    category: 'Documents',
    label: 'Aadhaar, PAN & insurance in waterproof pouch',
    shortLabel: 'Aadhaar, PAN & insurance',
    checked: true,
  },
  {
    id: 'kit-cash',
    category: 'Documents',
    label: 'Printed emergency phone numbers & cash',
    shortLabel: 'Emergency contacts & cash',
    checked: true,
  },
  {
    id: 'kit-whistle',
    category: 'Safety Gear',
    label: 'Emergency whistle, N95 masks & sanitizer',
    shortLabel: 'Whistle, N95 masks & sanitizer',
    checked: true,
  },
  {
    id: 'kit-clothes',
    category: 'Safety Gear',
    label: 'Extra clothes, blanket & multi-tool',
    shortLabel: 'Extra clothes & multi-tool',
    checked: true,
  },
  {
    id: 'kit-meeting',
    category: 'Family Plan',
    label: 'Family meeting point agreed',
    shortLabel: 'Meeting point agreed',
    checked: true,
  },
  {
    id: 'kit-drill',
    category: 'Family Plan',
    label: 'Evacuation route practiced with elders',
    shortLabel: 'Evacuation route practiced',
    checked: false,
  },
];

export const INITIAL_EVACUATION_PLAN: EvacuationPlan = {
  origin: 'Shivaji Park, Dadar West',
  destination: 'BMC Dadar Relief Shelter',
  meetingPoint: 'Shivaji Park Gate 2',
  memberCount: 4,
};

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-meera',
    name: 'Meera Sharma',
    status: 'Safe',
    locationTime: 'Home, Dadar West • 12m ago',
    phone: '+919820411111',
  },
  {
    id: 'fam-rajesh',
    name: 'Rajesh Sharma (Father)',
    status: 'Checking In',
    locationTime: 'Thane West • 38m ago',
    phone: '+919820422222',
  },
  {
    id: 'fam-ananya',
    name: 'Ananya Sharma',
    status: 'Offline',
    locationTime: 'Matunga College • Last seen 2h ago',
    phone: '+919820433333',
  },
];

export const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'cnt-meera',
    rank: 1,
    name: 'Meera Sharma',
    relation: 'Spouse',
    phone: '+91 98204 11111',
    canSms: true,
  },
  {
    id: 'cnt-vivek',
    rank: 2,
    name: 'Dr. Vivek Kulkarni',
    relation: 'Family Doctor',
    phone: '+91 98210 77889',
    canSms: false,
  },
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'rep-4081',
    code: '#INC-MH-4081',
    type: 'Flooded Road / Waterlogging',
    title: 'Waterlogging at Hindmata Flyover',
    severity: 'High',
    location: 'Hindmata Junction, Dadar East (19.0112° N, 72.8421° E)',
    description: 'BMC pumping crew on site. Traffic diverted via Dr. Ambedkar Road.',
    submittedAt: '13:50 IST • BMC Dewatering Pump Dispatched',
    status: 'Response Initiated',
    imageUrl: WATERLOGGING_IMAGE_URL,
    timeline: [
      { label: 'Submitted & Verified (13:55 IST)', state: 'done' },
      { label: 'Response Initiated (14:08 IST)', state: 'active' },
      { label: 'Resolved (Pending)', state: 'pending' },
    ],
  },
];

export const INITIAL_VOLUNTEER_REQUESTS: VolunteerRequest[] = [
  {
    id: 'vreq-1',
    priorityBadge: 'High Priority • Food & Water',
    badgeVariant: 'error',
    distance: '1.4 km away',
    title: '200 Dry Meal Packets Needed',
    organization: 'BMC Dadar Relief Shelter • Requested by Ward Officer',
    actionType: 'offer',
    actionLabel: 'Offer Assistance',
    acceptedLabel: 'Accepted — Coordinator Notified ✓',
    accepted: false,
  },
  {
    id: 'vreq-2',
    priorityBadge: 'Urgent • Blood Donation',
    badgeVariant: 'warning',
    distance: '2.1 km away',
    title: 'O-Negative Blood Donors Needed',
    organization: 'KEM Hospital Blood Bank, Parel • Verified Request',
    actionType: 'call',
    actionLabel: 'Call Blood Bank',
    phone: '+912224136051',
    accepted: false,
  },
  {
    id: 'vreq-3',
    priorityBadge: 'Shelter Support',
    badgeVariant: 'secondary',
    distance: '3.0 km away',
    title: 'First-Aid & Elder Care Volunteers',
    organization: 'Matunga Community Hall Relief Camp',
    actionType: 'shift',
    actionLabel: 'Sign Up for Shift',
    acceptedLabel: 'Accepted — Shift Confirmed ✓',
    accepted: false,
  },
];

export const INITIAL_VOLUNTEERS: VolunteerMember[] = [
  {
    id: 'vol-1',
    name: 'Dr. Priya Deshmukh',
    verified: true,
    skillsLocation: 'First Aid & Medical • Dadar • Available Now',
    phone: '+919820455555',
  },
  {
    id: 'vol-2',
    name: 'Rohan Patil',
    verified: true,
    skillsLocation: 'Flood Rescue & Logistics • Matunga',
    phone: '+919820466666',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    types: ['emergency', 'alerts'],
    categoryLabel: 'Critical Alert',
    variant: 'error',
    icon: 'flood',
    timeAgo: '18m ago',
    title: 'Mithi River Crosses Danger Mark',
    body: 'Avoid Sion–Kurla road. Tap for shelter routes.',
    read: false,
    targetScreen: 'alerts',
  },
  {
    id: 'notif-2',
    types: ['updates'],
    categoryLabel: 'Family Check-In',
    variant: 'success',
    icon: 'family_restroom',
    timeAgo: '12m ago',
    title: 'Meera Sharma marked Safe',
    body: 'Location: Dadar West.',
    read: false,
    targetScreen: 'family',
  },
  {
    id: 'notif-3',
    types: ['updates'],
    categoryLabel: 'Report Update',
    variant: 'secondary',
    icon: 'assignment_turned_in',
    timeAgo: '35m ago',
    title: 'BMC Dewatering Pump Dispatched',
    body: 'Your report #INC-MH-4081 is in progress.',
    read: false,
    targetScreen: 'report',
  },
];

export const ONBOARDING_SLIDES = {
  en: [
    {
      icon: 'notifications_active',
      bg: 'bg-light-warning-container text-light-on-warning-container',
      title: 'Stay informed with disaster alerts.',
      desc: 'Receive verified IMD, NDMA, and local civic warnings for floods, cyclones, heatwaves, and earthquakes in real time.',
    },
    {
      icon: 'night_shelter',
      bg: 'bg-light-success-container text-light-on-success-container',
      title: 'Know your nearest safe shelter.',
      desc: 'Locate open relief camps, hospitals, and safe evacuation routes near you — even when mobile data is slow.',
    },
    {
      icon: 'medical_services',
      bg: 'bg-light-secondary-container text-light-on-secondary-container',
      title: 'Prepare your emergency kit.',
      desc: 'Track water, medicines, Aadhaar documents, and flashlight readiness with a guided family checklist.',
    },
    {
      icon: 'family_restroom',
      bg: 'bg-light-primary-container text-light-on-primary-container',
      title: 'Keep your family safe.',
      desc: 'Share live check-ins with one tap using “I am Safe” or “Need Help” and set a shared family meeting point.',
    },
    {
      icon: 'sos',
      bg: 'bg-light-error-container text-light-on-error-container',
      title: 'Get help when every second matters.',
      desc: 'Reach 112 National Emergency Services and alert your trusted contacts with your exact GPS coordinates.',
    },
  ],
  hi: [
    {
      icon: 'notifications_active',
      bg: 'bg-light-warning-container text-light-on-warning-container',
      title: 'आपदा अलर्ट से समय पर सतर्क रहें।',
      desc: 'बाढ़, चक्रवात, लू और भूकंप के लिए IMD और NDMA की सत्यापित चेतावनियाँ तुरंत प्राप्त करें।',
    },
    {
      icon: 'night_shelter',
      bg: 'bg-light-success-container text-light-on-success-container',
      title: 'अपना निकटतम सुरक्षित आश्रय जानें।',
      desc: 'आस-पास के राहत शिविर, अस्पताल और सुरक्षित निकासी मार्ग आसानी से खोजें।',
    },
    {
      icon: 'medical_services',
      bg: 'bg-light-secondary-container text-light-on-secondary-container',
      title: 'अपनी आपातकालीन किट तैयार रखें।',
      desc: 'पीने का पानी, दवाइयाँ, जरूरी दस्तावेज़ और टॉर्च की तैयारी चेकलिस्ट से ट्रैक करें।',
    },
    {
      icon: 'family_restroom',
      bg: 'bg-light-primary-container text-light-on-primary-container',
      title: 'अपने परिवार को सुरक्षित रखें।',
      desc: 'एक टैप में “मैं सुरक्षित हूँ” संदेश भेजें और परिवार के मिलने का सुरक्षित स्थान तय करें।',
    },
    {
      icon: 'sos',
      bg: 'bg-light-error-container text-light-on-error-container',
      title: 'हर सेकंड कीमती है — तुरंत मदद पाएं।',
      desc: '112 राष्ट्रीय आपातकालीन सेवा से जुड़ें और अपने सटीक GPS स्थान के साथ मदद बुलाएं।',
    },
  ],
};

export function buildLatestWeatherSnapshot(
  location: string = INITIAL_USER.locationLabel,
  cachedAtIso: string = new Date().toISOString()
): WeatherForecastSnapshot {
  return {
    location,
    source: 'IMD Mumbai Bulletin + Local Flood & Tide Risk Model',
    alertLevel: 'IMD Orange Alert',
    temperatureC: 28,
    condition: 'Heavy Rain',
    rainfallMmHr: 42,
    windGustsKmh: 48,
    humidityPct: 94,
    aqi: 42,
    highTideNote: 'High Tide 4.4m at 17:40 IST — avoid coastal promenades & underpasses',
    cachedAtIso,
    hourly: [
      { time: 'Now', icon: 'thunderstorm', iconClass: 'text-light-primary', temp: '28°C', pop: '90% rain' },
      { time: '16:00', icon: 'rainy', iconClass: 'text-light-primary', temp: '27°C', pop: '95% rain' },
      { time: '18:00', icon: 'rainy', iconClass: 'text-light-error', temp: '26°C', pop: '100% rain' },
      { time: '20:00', icon: 'thunderstorm', iconClass: 'text-light-primary', temp: '26°C', pop: '85% rain' },
      { time: '22:00', icon: 'rainy', iconClass: 'text-light-secondary', temp: '25°C', pop: '70% rain' },
    ],
    risks: [
      {
        id: 'risk-flood',
        title: 'Urban Flood & Waterlogging',
        detail: 'High tide 4.4m at 17:40 IST + heavy rain (42 mm/hr)',
        actionTip: 'Avoid Hindmata & Sion-Kurla underpasses. Move to elevated shelters if ground-floor water rises.',
        level: 'High',
        icon: 'flood',
      },
      {
        id: 'risk-coastal',
        title: 'Coastal Gusts & High Swell',
        detail: 'INCOIS 3.2m–3.8m wave swell advisory along Arabian Sea',
        actionTip: 'Stay off Dadar Chowpatty & Worli Sea Face promenades and secure loose balcony items.',
        level: 'Moderate',
        icon: 'cyclone',
      },
      {
        id: 'risk-heat',
        title: 'Heatwave Risk',
        detail: 'Temperatures within monsoon normal (28°C)',
        actionTip: 'Keep clean boiled water and ORS stocked for post-flood sanitation safety.',
        level: 'Low',
        icon: 'wb_sunny',
      },
    ],
    outlook: [
      { day: 'Today', condition: 'Very Heavy Rain • High Tide 17:40', temp: '28° / 24°' },
      { day: 'Tomorrow', condition: 'Moderate to Heavy Showers', temp: '29° / 25°' },
      { day: 'Thu', condition: 'Scattered Monsoon Showers', temp: '30° / 25°' },
      { day: 'Fri', condition: 'Passing Showers • Breezy', temp: '30° / 26°' },
      { day: 'Sat', condition: 'Partly Cloudy & Humid', temp: '31° / 26°' },
    ],
  };
}

