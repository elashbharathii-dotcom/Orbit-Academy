import {
  ChapterDefinition,
  JournalEntry,
  PlayerChoice,
  CampaignEndingDefinition,
  DialogueNode,
} from '../types/storyTypes';

// =========================================================================
// CAMPAIGN CHAPTER DEFINITIONS
// =========================================================================
export const CAMPAIGN_CHAPTERS: ChapterDefinition[] = [
  {
    id: 1,
    title: 'CHAPTER 1',
    subtitle: 'THE AWAKENING',
    solEstimate: 'SOL 01 – 04',
    overview:
      'Following a catastrophic class-5 dust squall in Jezero Crater, Outpost Alpha suffered localized power failure and decompression in auxiliary compartments. You awaken in the airlock module with auxiliary life-support operational. You must assess the habitat, inventory survival rations, and secure volatile water ice from the delta basin.',
    objectives: [
      {
        id: 'ch1_obj_inspect_hab',
        title: 'Inspect Habitat Compartments',
        description: 'Examine Outpost Alpha command facilities and assess system status.',
        completed: false,
      },
      {
        id: 'ch1_obj_review_cargo',
        title: 'Review Equipment & Survival Cargo',
        description: 'Open your EVA Cargo backpack [C] and inspect the base vault terminal.',
        completed: false,
      },
      {
        id: 'ch1_obj_oxygen_loop',
        title: 'Replenish EVA Suit Oxygen',
        description: 'Use the MOXIE atmospheric oxygen processor inside the airlock.',
        completed: false,
      },
      {
        id: 'ch1_obj_water_reserves',
        title: 'Harvest Subsurface Water Ice',
        description: 'Gather water ice from the delta glacial seam outcrop.',
        completed: false,
        relatedMissionId: 'mis_scientific_survey',
      },
    ],
  },
  {
    id: 2,
    title: 'CHAPTER 2',
    subtitle: 'REBUILDING HOPE',
    solEstimate: 'SOL 05 – 12',
    overview:
      'Survival is stabilized, but Outpost Alpha remains completely isolated from Earth. With sub-zero nights plunging toward -115°C, life-support cryocoolers and thermal heaters will deplete emergency batteries. You must scavenge mission debris, renovate the Engineering Workshop, and align the communications array.',
    objectives: [
      {
        id: 'ch2_obj_recover_materials',
        title: 'Scavenge Titanium & Structural Scrap',
        description: 'Gather scrap metal and electronic components scattered across the basin.',
        completed: false,
      },
      {
        id: 'ch2_obj_repair_workshop',
        title: 'Restore the Engineering Workshop to Level 1',
        description: 'Provide materials at the Renovation Terminal to bring fabrication tools online.',
        completed: false,
        relatedFacilityId: 'engineering_workshop',
      },
      {
        id: 'ch2_obj_restore_power',
        title: 'Attain Energy Grid Stability',
        description: 'Accumulate at least 90.0 kWh in base batteries during peak sunlight.',
        completed: false,
        relatedMissionId: 'mis_energy_independence',
      },
      {
        id: 'ch2_obj_activate_comms',
        title: 'Restore Communications Room & Earth Uplink',
        description: 'Renovate the Communications facility and establish telemetry with Mission Control.',
        completed: false,
        relatedMissionId: 'mis_restore_comms',
      },
    ],
  },
  {
    id: 3,
    title: 'CHAPTER 3',
    subtitle: 'BEYOND THE HORIZON',
    solEstimate: 'SOL 13 – 25',
    overview:
      'With direct telemetry to Earth re-established, NASA and Orbit Academy authorize deep exploratory sorties. Precursor rover missions and uncrewed landers left critical hardware scattered across Jezero Crater. You must inspect your 6-wheel rover, chart ancient paleolake deltas, and recover salvageable avionics.',
    objectives: [
      {
        id: 'ch3_obj_prep_rover',
        title: 'Mount and Test the 6-Wheel Exploration Rover',
        description: 'Board the rover, check suspension telemetry, and test throttle mechanics.',
        completed: false,
      },
      {
        id: 'ch3_obj_recover_avionics',
        title: 'Salvage Opportunity-Beta Flight Avionics',
        description: 'Locate the abandoned precursor rover at [38, 0, -32] and extract its core.',
        completed: false,
        relatedMissionId: 'mis_forgotten_rover',
      },
      {
        id: 'ch3_obj_scan_geology',
        title: 'Conduct Planetary Spectrometry Survey',
        description: 'Use the Visor Scanner [V] to analyze 5 unique geological formations.',
        completed: false,
        relatedMissionId: 'mis_scientific_survey',
      },
      {
        id: 'ch3_obj_reach_paleolake',
        title: 'Extract Jezero Delta Sedimentary Core',
        description: 'Traverse west to the ancient river delta outcrop at [-40, 0, 22].',
        completed: false,
        relatedMissionId: 'mis_deep_core_samples',
      },
    ],
  },
  {
    id: 4,
    title: 'CHAPTER 4',
    subtitle: 'THE UNKNOWN SIGNAL',
    solEstimate: 'SOL 26 – 40',
    overview:
      'A periodic, ultra-low frequency harmonic carrier wave is detected echoing through Outpost Alpha seismic sensors. Triangulation places the origin deep inside the volcanic basalt lava tube southwest of the outpost. Precursor expedition records indicate Dr. Elena Vance made an unclassified discovery in the subterranean vault before the base evacuated.',
    objectives: [
      {
        id: 'ch4_obj_detect_signal',
        title: 'Triangulate the Subterranean Transmission',
        description: 'Drive southwest to the Lava Tube entrance at [-35, 0, -42].',
        completed: false,
        relatedMissionId: 'mis_unidentified_signal',
      },
      {
        id: 'ch4_obj_descend_vault',
        title: 'Descend into the Subterranean Cavern Vault',
        description: 'Navigate the underground basalt ramp to reach the subterranean geothermal vault.',
        completed: false,
        relatedMissionId: 'mis_subterranean_frontier',
      },
      {
        id: 'ch4_obj_scan_prebiotic_ice',
        title: 'Spectrally Analyze Ancient Glacial Clathrate Core',
        description: 'Scan the 3.9-billion-year-old subterranean permafrost ice wall for biosignatures.',
        completed: false,
        relatedMissionId: 'mis_subterranean_frontier',
      },
      {
        id: 'ch4_obj_recover_vance_log',
        title: 'Uncover Dr. Vance Confidential Research Log',
        description: 'Recover the encrypted expedition memory module from the cavern terminal.',
        completed: false,
      },
    ],
  },
  {
    id: 5,
    title: 'CHAPTER 5',
    subtitle: 'A NEW BEGINNING',
    solEstimate: 'SOL 41 – 60',
    overview:
      'The discovery of prebiotic organic clathrates changes our understanding of Mars. However, human survival on the Red Planet requires food self-sufficiency, resilient closed-loop life support, and expanded living quarters. You must operationalize the Bio-Dome greenhouse and scale up base habitation.',
    objectives: [
      {
        id: 'ch5_obj_upgrade_greenhouse',
        title: 'Renovate Bio-Dome Greenhouse to Level 2 (Operational)',
        description: 'Fabricate pressurized hydroponic conduits and ultraviolet grow lamps.',
        completed: false,
        relatedFacilityId: 'greenhouse',
      },
      {
        id: 'ch5_obj_harvest_crops',
        title: 'Complete a Full Aeroponic Potato Harvest Cycle',
        description: 'Irrigate seedlings, monitor nutrient delivery, and harvest fresh food rations.',
        completed: false,
        relatedMissionId: 'mis_expand_greenhouse',
      },
      {
        id: 'ch5_obj_expand_living_quarters',
        title: 'Upgrade Crew Living Quarters to Level 1+',
        description: 'Restore radiation-shielded bunk berths and personal sanitation modules.',
        completed: false,
        relatedFacilityId: 'living_quarters',
      },
      {
        id: 'ch5_obj_blueprint_research',
        title: 'Unlock At Least Two Advanced Research Blueprints',
        description: 'Spend acquired research points in the Science Lab terminal.',
        completed: false,
      },
    ],
  },
  {
    id: 6,
    title: 'CHAPTER 6',
    subtitle: 'THE FINAL DECISION',
    solEstimate: 'SOL 61+',
    overview:
      'Outpost Alpha has transformed from a crippled shelter into a self-sustaining planetary foothold. Earth Mission Control and the Orbit Academy Council present four formal directives for the future of the settlement. Your discoveries, upgrades, and final decision will determine humanity’s permanent legacy on Mars.',
    objectives: [
      {
        id: 'ch6_obj_survey_readiness',
        title: 'Verify Planetary Settlement Readiness',
        description: 'Ensure critical life support, power, and facilities meet permanent colonial safety standards.',
        completed: false,
      },
      {
        id: 'ch6_obj_review_discoveries',
        title: 'Review Catalog of Scientific Discoveries',
        description: 'Examine your field journal [J] and verify all expedition milestones.',
        completed: false,
      },
      {
        id: 'ch6_obj_transmit_decision',
        title: 'Transmit Final Settlement Mandate to Earth',
        description: 'Convene at the Command Centre console and select the destiny of Mars Outpost Alpha.',
        completed: false,
      },
    ],
  },
];

// =========================================================================
// JOURNAL ENTRIES (AUDIO LOGS, TRANSMISSIONS, DISCOVERIES, REFLECTIONS)
// =========================================================================
export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal_sol_01',
    title: 'Personal Log: After the Squall',
    category: 'campaign',
    solDate: 'SOL 01 - 06:14 LMST',
    author: 'Astronaut (Field Specialist)',
    preview: 'The habitat pressure alarm woke me. Dust particles hung in the emergency red strobes...',
    content:
      'The storm was unlike anything models predicted. A class-5 synoptic squall swept across Syrtis Major, tearing into Jezero Crater with 140 km/h wind gusts. The exterior solar inverter banks took a direct kinetic hit from saltating basalt pebbles.\n\nAuxiliary oxygen reserves dropped to 34% before the automated airlock bulkheads sealed. I am alone here, but the structural hull is sound. My primary objective is simple: keep the reactor running, extract water ice from the permafrost, and do not panic.',
    unlocked: true,
  },
  {
    id: 'journal_audio_vance_01',
    title: 'Audio Log: Dr. Vance — First Landing',
    category: 'audio_log',
    solDate: 'PRECURSOR SOL -410',
    author: 'Dr. Elena Vance (Ares Expedition Lead)',
    preview: '“Touchdown in Jezero. The sky is an extraordinary pale salmon-pink...”',
    content:
      '“Touchdown verified. The descent skycrane performed with surgical precision, leaving us nestled safely between the delta fan and the western crater wall. The sky is an extraordinary pale salmon-pink, tinted by micron-sized ferric oxide dust.\n\nWe came here to answer humanity’s oldest question: did life ever arise on this desert world? The orbital radar showed hydrated minerals below, but feeling the crunch of Martian soil beneath our boots... that is something no simulation can capture.”',
    unlocked: true,
  },
  {
    id: 'journal_transmission_houston_01',
    title: 'Earth Uplink: First Contact Re-established',
    category: 'transmission',
    solDate: 'SOL 08 - 14:22 LMST',
    author: 'Flight Director Hayes (Houston Mission Control)',
    preview: '“Outpost Alpha, Houston reading your carrier wave 5 by 5! Do you copy?”',
    content:
      '“Outpost Alpha, this is Houston CapCom reading your high-gain carrier wave 5 by 5! Telemetry packets are streaming across the Deep Space Network through the Goldstone dishes.\n\nWe tracked the storm front from the Mars Reconnaissance Orbiter and feared structural breach when your transponder vanished. Hearing your confirmation that reactor core integrity and suit life-support remain green is the greatest relief in the history of human spaceflight. We are standing by to support your restoration timetable.”',
    unlocked: false,
    relatedMissionId: 'mis_restore_comms',
  },
  {
    id: 'journal_discovery_delta_clay',
    title: 'Geological Analysis: Paleolake Delta Clays',
    category: 'discovery',
    solDate: 'SOL 15 - 11:45 LMST',
    author: 'Planetary Mass Spectrometry Suite',
    preview: 'Spectrometric verification of layered phyllosilicates and smectite clay beds...',
    content:
      'Sample extraction from coordinates [-40, 0, 22] confirms rich layered smectite clays with exceptional cation-exchange capacity. Formed during the late Noachian era (~3.75 billion years ago), these sediments settled in calm, neutral-pH surface water.\n\nCrucially, phyllosilicate clay lattices have the unique property of encapsulating organic molecules, shielding them from UV photodegradation. If ancient microbial life inhabited Jezero Paleolake, this outcrop is where its chemical signatures remain sealed.',
    unlocked: false,
    coordinates: [-40, 0, 22],
  },
  {
    id: 'journal_audio_vance_02',
    title: 'Audio Log: Dr. Vance — The Subterranean Echo',
    category: 'audio_log',
    solDate: 'PRECURSOR SOL -142',
    author: 'Dr. Elena Vance (Ares Expedition Lead)',
    preview: '“Our seismometers picked up an anomaly beneath the southern basalt ridges...”',
    content:
      '“Our broadband seismometers picked up an anomaly. It isn’t a thermal tectonic tremor or an impact shock. It is a periodic resonant vibration centered in the deep lava tube conduit southwest of Outpost Alpha.\n\nCommander Reyes thinks it’s acoustic wind whistling through a basalt skylight, but the frequency is too orderly—exactly 14.2 Hz, modulated every 48 seconds. Tomorrow, Chen and I are taking the pressurized rover to map the cave interior. Something down there is reflecting our radar pings.”',
    unlocked: false,
  },
  {
    id: 'journal_discovery_subterranean_ice',
    title: 'Astrobiology File: Prebiotic Glacial Clathrates',
    category: 'discovery',
    solDate: 'SOL 29 - 18:30 LMST',
    author: 'Field Spectrometry Scan 08-CAVE',
    preview: 'Pristine subterranean glacial core showing trapped methane clathrates and amino acids...',
    content:
      'Spectrometric analysis of subterranean glacier core at [-30, -5.2, -68] reveals pristine ice shielded from galactic cosmic radiation for 3.9 billion years. Radionuclide testing indicates zero cosmic ray ablation.\n\nMass spectrometer readings confirm trace methane clathrate cages containing glycine precursors and polycyclic aromatic structures. This is definitive physical evidence that Mars possessed a prebiotic chemical environment capable of generating the building blocks of life.',
    unlocked: false,
    coordinates: [-30, -5.2, -68],
  },
  {
    id: 'journal_transmission_council_01',
    title: 'Council Mandate: The Crossroads of Mars',
    category: 'transmission',
    solDate: 'SOL 50 - 09:15 LMST',
    author: 'International Mars Coalition & Orbit Academy',
    preview: '“Your achievements at Outpost Alpha have proven that Mars is not merely survivable...”',
    content:
      '“To the Outpost Alpha Expedition Specialist:\n\nYour achievements over the past fifty Sols have proven what generations of scientists dreamed: Mars is not merely survivable—it can be a home for humankind.\n\nWith multiple facilities operational, a flourishing bio-dome, and unprecedented astrobiological discoveries recorded, the Coalition hereby transfers full command authority to you. In Chapter 6, you will formalize the long-term mandate for this settlement. The entire world on Earth is watching.”',
    unlocked: false,
  },
];

// =========================================================================
// NARRATIVE DIALOGUE SCRIPTS
// =========================================================================
export const CAMPAIGN_DIALOGUES: Record<string, DialogueNode> = {
  // Chapter 1: Awakening Intro
  dia_ch1_intro: {
    id: 'dia_ch1_intro',
    speaker: 'ARES-OS (Suit AI)',
    speakerTitle: 'Ares Mark-IV Suit Telemetry',
    text: 'Airlock repressurization cycle complete. Vital telemetry nominal: Suit O2 at 82%, battery voltage steady. Outpost Alpha auxiliary systems are responding on backup power, but main communications dishes are offline.',
    audioTone: 'comm_beep',
    nextDialogueId: 'dia_ch1_intro_2',
  },
  dia_ch1_intro_2: {
    id: 'dia_ch1_intro_2',
    speaker: 'ARES-OS (Suit AI)',
    speakerTitle: 'Ares Mark-IV Suit Telemetry',
    text: 'Directive: Inspect your Cargo backpack [C], top off EVA oxygen at the MOXIE generator, and harvest water ice from the delta basin to ensure core life support.',
    audioTone: 'data_chime',
  },

  // Chapter 2: Comms Restored
  dia_ch2_comms_online: {
    id: 'dia_ch2_comms_online',
    speaker: 'Mission Control (Houston)',
    speakerTitle: 'NASA Deep Space Operations',
    text: 'Outpost Alpha, this is Houston CapCom! We see your carrier lock on Goldstone transponder 4! Confirm telemetry status! You have no idea how glad we are to hear your beacon alive.',
    audioTone: 'comm_beep',
    choiceId: 'choice_ch2_priority',
  },

  // Chapter 3: Rover Online
  dia_ch3_rover_ready: {
    id: 'dia_ch3_rover_ready',
    speaker: 'Chief Engineer Chen',
    speakerTitle: 'Recorded Maintenance Memo',
    text: '“If anyone is reading this: the 6-wheel rover rocker-bogie differential was calibrated for the steep dunes near Opportunity-Beta. Be careful over basalt scree. Keep an eye on battery draw when running heaters!”',
    audioTone: 'data_chime',
    choiceId: 'choice_ch3_allocation',
  },

  // Chapter 4: Subterranean Signal
  dia_ch4_signal_ping: {
    id: 'dia_ch4_signal_ping',
    speaker: 'ARES-OS (Suit AI)',
    speakerTitle: 'Acoustic Sensor Suite',
    text: 'Warning: Broadband acoustic receiver detecting harmonic resonance at 14.2 Hz beneath the southern rim. Signal epicenter correlates with the ancient lava tube cave system at [-35, 0, -42].',
    audioTone: 'urgent_alarm',
  },

  // Chapter 5: Greenhouse Harvest
  dia_ch5_first_harvest: {
    id: 'dia_ch5_first_harvest',
    speaker: 'Autonomous Base Core',
    speakerTitle: 'Bio-Dome Hydroponic Control',
    text: 'Aeroponic harvest confirmed! 4.0 kg fresh Solanum tuberosum tubers harvested. Nutritional caloric yield: 3,200 kcal. Base food security index increased by 45%. You have officially grown food on another planet.',
    audioTone: 'data_chime',
    choiceId: 'choice_ch5_specialization',
  },

  // Chapter 6: The Crossroads
  dia_ch6_final_crossroads: {
    id: 'dia_ch6_final_crossroads',
    speaker: 'Commander Reyes',
    speakerTitle: 'Coalition Mission Briefing',
    text: '“Expedition Specialist, you have achieved what no crew before could. Outpost Alpha is secure. The time has come to declare the purpose of this frontier. Review your journal discoveries [J] and choose the destiny of Mars.”',
    audioTone: 'comm_beep',
    choiceId: 'choice_ch6_final_destiny',
  },
};

// =========================================================================
// PLAYER CHOICES & BRANCHING DIRECTIVES
// =========================================================================
export const CAMPAIGN_CHOICES: Record<string, PlayerChoice> = {
  choice_ch2_priority: {
    id: 'choice_ch2_priority',
    chapterId: 2,
    title: 'DIRECTIVE: INITIAL COLONIAL STRATEGY',
    premise:
      'With the communications array online, Mission Control requests your primary strategic focus for the upcoming Sols. Both paths provide crucial benefits, but dictate how scarce resources will be deployed.',
    options: [
      {
        id: 'opt_ch2_comms_focus',
        label: 'Focus on Earth Uplink & Scientific Telemetry',
        description: 'Prioritize continuous orbital telemetry, satellite weather alerts, and high-bandwidth research data links.',
        consequencesSummary: 'Awards +150 immediate Research Points and reveals upcoming storm warnings 60 seconds earlier.',
        bonusReward: '+150 Research Points & Advanced Weather Telemetry',
        endingBias: 'scientist',
      },
      {
        id: 'opt_ch2_power_focus',
        label: 'Focus on Energy Grid & Cryo-Batteries',
        description: 'Prioritize auxiliary battery expansion and thermal insulation for sub-zero night survival.',
        consequencesSummary: 'Expands base battery capacity by +30 kWh and reduces suit heating power drain during nocturnal EVA by 20%.',
        bonusReward: '+30 kWh Grid Capacity & 20% Suit Heater Efficiency',
        endingBias: 'survivor',
      },
    ],
  },

  choice_ch3_allocation: {
    id: 'choice_ch3_allocation',
    chapterId: 3,
    title: 'RESOURCE ALLOCATION: SALVAGE DEPLOYMENT',
    premise:
      'The salvaged precursor avionics from Opportunity-Beta contain high-grade radiation-hardened microchips. How will you utilize this rare technology?',
    options: [
      {
        id: 'opt_ch3_rover_mobility',
        label: 'Overhaul 6-Wheel Rover Autonomous Range',
        description: 'Install the microchips into the rover guidance computer, unlocking higher top speed and expanded battery range.',
        consequencesSummary: 'Increases rover top speed by 20%, expands rover battery capacity to 150 kWh, and improves autonomous navigation.',
        bonusReward: 'Rover Speed +20% & 150 kWh High-Capacity Battery',
        endingBias: 'explorer',
      },
      {
        id: 'opt_ch3_base_automation',
        label: 'Integrate Chips into Outpost Alpha Vault & 3D Fabrication',
        description: 'Upgrade the central station vault inventory management and 3D printing precision.',
        consequencesSummary: 'Expands Outpost Alpha storage capacity to 600 kg and reduces crafting component costs by 15%.',
        bonusReward: 'Vault Capacity 600 kg & 15% Crafting Material Discount',
        endingBias: 'pioneer',
      },
    ],
  },

  choice_ch5_specialization: {
    id: 'choice_ch5_specialization',
    chapterId: 5,
    title: 'COLONIAL EVOLUTION: SUSTAINABILITY SPECIALIZATION',
    premise:
      'With the Bio-Dome operational, Outpost Alpha is transitioning to permanent habitation. What foundational pillar will you specialize in for the base architecture?',
    options: [
      {
        id: 'opt_ch5_closed_bio',
        label: 'Closed-Loop Bio-Regenerative Ecosystem',
        description: 'Double down on vertical aeroponics, algae photobioreactors, and closed-loop greywater reclamation.',
        consequencesSummary: 'Greenhouse crops mature 40% faster, water recycling efficiency hits 95%, and yields +2 food per harvest.',
        bonusReward: '40% Faster Crop Maturation & 95% Water Reclamation',
        endingBias: 'pioneer',
      },
      {
        id: 'opt_ch5_deep_science',
        label: 'Subterranean Geothermal & Planetary Science Hub',
        description: 'Transform Outpost Alpha into the pre-eminent scientific laboratory for extraterrestrial astrobiology.',
        consequencesSummary: 'Unlocks +300 Research Points and double sample extraction yield from all planetary landmarks.',
        bonusReward: '+300 Research Points & 2x Geological Sample Yield',
        endingBias: 'scientist',
      },
    ],
  },

  choice_ch6_final_destiny: {
    id: 'choice_ch6_final_destiny',
    chapterId: 6,
    title: 'THE FINAL MANDATE: DESTINY OF OUTPOST ALPHA',
    premise:
      'All survival milestones and scientific surveys have been documented. The Earth Coalition and Orbit Academy await your final transmission. What is the permanent mandate of Mars: Last Frontier?',
    options: [
      {
        id: 'opt_ch6_pioneer_colony',
        label: 'Establish the First Permanent Civilian Colony (Ending A)',
        description: 'Open Outpost Alpha to the first wave of civilian pioneers, families, and builders.',
        consequencesSummary: 'Outpost Alpha becomes a thriving permanent city on Mars—humanity’s second home.',
        bonusReward: 'COLONY CHARTER VERIFIED • ENDING A UNLOCKED',
        endingBias: 'pioneer',
      },
      {
        id: 'opt_ch6_scientist_preserve',
        label: 'Declare Mars an International Astrobiological Sanctuary (Ending B)',
        description: 'Protect the ancient Jezero biosphere and dedicate all infrastructure to scientific discovery.',
        consequencesSummary: 'Outpost Alpha stands as the pinnacle of human science, preserving prebiotic extraterrestrial life.',
        bonusReward: 'SANCTUARY ACCORD SIGNED • ENDING B UNLOCKED',
        endingBias: 'scientist',
      },
    ],
  },
};

// =========================================================================
// CAMPAIGN ENDINGS (4 DISTINCT EPILOGUES)
// =========================================================================
export const CAMPAIGN_ENDINGS: Record<string, CampaignEndingDefinition> = {
  ending_pioneer: {
    id: 'ending_pioneer',
    code: 'ENDING A',
    title: 'THE PIONEER',
    badge: 'HUMANITY’S SECOND HOME',
    accentColor: '#00F0FF',
    prerequisitesDescription:
      'Completed all essential base renovations, sustained greenhouse harvests, and established multi-kilowatt power autonomy.',
    epilogueText:
      'Six months after your historic broadcast, the massive orbital transfer vehicle *Ares Gateway* fired its deceleration burn above Jezero Crater. Down through the thin salmon sky descended the first thirty civilian colonists—engineers, botanists, teachers, and children.\n\nThey did not arrive at a grim graveyard of rusted metal, but at a thriving, illuminated sanctuary. Lights in the geodesic dome shone out across the red sands. Fresh green leaves sprouted in the hydroponic racks, and pure water recycled through the life-support grid. You proved that humans can do more than merely endure Mars—we can build a civilization here.',
    futureOfMars:
      'Outpost Alpha is officially rechristened “First Port Jezero”. Within five years, four additional geodesic biodomes are completed, forming humanity’s first permanent self-sustaining planetary city.',
  },

  ending_scientist: {
    id: 'ending_scientist',
    code: 'ENDING B',
    title: 'THE SCIENTIST',
    badge: 'ASTROBIOLOGICAL REVELATION',
    accentColor: '#A855F7',
    prerequisitesDescription:
      'Spectrally surveyed all major geological landmarks, analyzed the subterranean glacier clathrate core, and completed advanced research.',
    epilogueText:
      'Your deep-core spectrometry data and cryogenic clathrate samples transmitted via the high-gain dish answered humanity’s oldest mystery: Mars was once alive.\n\nThe prebiotic organic chains and clathrate amino acids discovered in the subterranean lava tube were verified by the International Astrobiology Union. Across Earth, textbooks were rewritten overnight. Humanity realized we are not an isolated fluke in a dead universe, but part of a cosmic tapestry of life that stirs wherever liquid water and minerals embrace.',
    futureOfMars:
      'Jezero Crater is established as the “Vance-Jezero International Astrobiological Preserve”. Strict bio-quarantine protocols protect the ancient aquifers, while research stations from twenty nations conduct foundational interplanetary science.',
  },

  ending_explorer: {
    id: 'ending_explorer',
    code: 'ENDING C',
    title: 'THE EXPLORER',
    badge: 'PLANETARY PATHFINDER',
    accentColor: '#F59E0B',
    prerequisitesDescription:
      'Traversed the full 360m expanse, surveyed the Mawrth Canyon Core Rig, Crater Borealis, and recovered Opportunity-Beta.',
    epilogueText:
      'While others sought the comfort of the hab walls, your gaze remained fixed upon the infinite crimson horizon. In your 6-wheel rocker-bogie rover, you climbed the jagged rim of Crater Borealis, descended the shadowed canyons of Mawrth, and mapped ancient river deltas no human boot had ever touched.\n\nYour telemetry maps and navigational waypoints became the foundational atlas for the entire Martian hemisphere. The wheel tracks of your rover became the highways of tomorrow.',
    futureOfMars:
      'The “Great Jezero Traverse” is charted as the primary exploration corridor for planetary overland expeditions, connecting Outpost Alpha with the vast mineral riches of the Syrtis Highlands.',
  },

  ending_survivor: {
    id: 'ending_survivor',
    code: 'ENDING D',
    title: 'THE SURVIVOR',
    badge: 'IRONCLAD RESILIENCE',
    accentColor: '#10B981',
    prerequisitesDescription:
      'Endured catastrophic dust squalls, preserved suit vitals against freezing sub-zero temperatures, and maintained Outpost Alpha core systems.',
    epilogueText:
      'Mars tested you with everything in its formidable arsenal: -115°C nocturnal freezes, blinding dust storms that choked the sun for Sols, failing life-support regulators, and total acoustic silence from Earth.\n\nYou refused to yield. With wrench in hand, scavenging bolt by bolt and welding panel by panel, you held the line. When the relief expedition finally touched down, they found an astronaut who had stared down a hostile planet alone—and won.',
    futureOfMars:
      'Outpost Alpha stands as an unbreakable monument to human grit. Your survival protocols are standardized across the astronaut training curriculum as the gold standard of extraterrestrial survival.',
  },
};
