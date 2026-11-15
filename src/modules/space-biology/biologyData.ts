import {
  BioStructureDef,
  SpaceflightTopicDef,
  BiomarkerGeneData,
  HeatmapSample,
} from './types';
import { NasaOsdrStudyMetadata } from '../../services/nasa/types';

// ============================================================================
// 1. 3D BIOLOGICAL STRUCTURES CATALOG (8 Systems)
// ============================================================================
export const BIO_STRUCTURES: BioStructureDef[] = [
  {
    id: 'human_cell',
    name: 'Human Cell (Astronaut Model)',
    category: 'cellular',
    modelType: 'conceptual',
    scientificName: 'Homo sapiens (Somatic Cell)',
    scaleDescription: 'Diameter ~ 15–20 µm (Microns)',
    summary:
      'Human cellular architecture illustrating plasma membrane fluidity, energetic mitochondrial clusters, and the genetic nucleus undergoing microgravity stress and high-energy cosmic radiation exposure.',
    spaceflightRelevance:
      'In microgravity, fluid shear dynamics decrease while intracellular tension through the actin cytoskeleton is disrupted. Mitochondria experience oxidative stress from cosmic radiation, altering ATP synthesis and accelerating cellular senescence.',
    nasaStudyRef: 'OSD-168',
    organelles: [
      {
        id: 'nucleus',
        name: 'Cell Nucleus & Chromatin',
        color: '#818CF8',
        position: [0, 0, 0],
        description: 'Contains double-stranded genomic DNA wrapped around histone octamers.',
        spaceflightImpact: 'Susceptible to double-strand breaks from high-LET galactic cosmic rays (HZE ions).',
      },
      {
        id: 'mitochondria_1',
        name: 'Mitochondria (Cluster Alpha)',
        color: '#F59E0B',
        position: [1.4, 0.8, 0.6],
        description: 'Cellular powerplants generating ATP via oxidative phosphorylation.',
        spaceflightImpact: 'Exhibits down-regulated electron transport chain proteins and elevated reactive oxygen species (ROS).',
      },
      {
        id: 'mitochondria_2',
        name: 'Mitochondria (Cluster Beta)',
        color: '#F59E0B',
        position: [-1.2, -0.9, -0.4],
        description: 'Mitochondrial network maintaining cellular energetic equilibrium.',
        spaceflightImpact: 'Altered membrane potential observed in ISS astronaut peripheral blood mononuclear cells (PBMCs).',
      },
      {
        id: 'er_network',
        name: 'Endoplasmic Reticulum',
        color: '#38BDF8',
        position: [0.8, -0.6, 1.0],
        description: 'Folded membrane network synthesizing lipids and processing membrane proteins.',
        spaceflightImpact: 'Triggers unfolded protein response (UPR) under chronic microgravity proteotoxic stress.',
      },
      {
        id: 'cytoskeleton',
        name: 'Actin Microfilament Network',
        color: '#34D399',
        position: [0, 1.8, 0],
        description: 'Structural microfilaments maintaining cellular morphology and mechanotransduction.',
        spaceflightImpact: 'Undergoes depolymerization and disorganization in the absence of gravitational tension vectors.',
      },
    ],
  },
  {
    id: 'dna_helix',
    name: 'DNA Double Helix',
    category: 'molecular',
    modelType: 'conceptual',
    scientificName: 'Deoxyribonucleic Acid (B-DNA)',
    scaleDescription: 'Width ~ 2.0 nm, Pitch ~ 3.4 nm (10 bp/turn)',
    summary:
      'Antiparallel double helix carrying human genetic instructions, formed by adenine-thymine and guanine-cytosine nucleotide base pairs linked by phosphodiester backbones.',
    spaceflightRelevance:
      'Galactic cosmic radiation (HZE nuclei like 56Fe) produces clustered, complex double-strand breaks (DSBs) that challenge non-homologous end joining (NHEJ) and homologous recombination repair pathways.',
    nasaStudyRef: 'OSD-168',
    organelles: [
      {
        id: 'base_pairs',
        name: 'Complementary Base Pairs (A-T / G-C)',
        color: '#00E5FF',
        position: [0, 0, 0],
        description: 'Hydrogen-bonded purines and pyrimidines encoding genetic code.',
        spaceflightImpact: 'Direct ion track hits cause clustered base damage and apurinic/apyrimidinic (AP) sites.',
      },
      {
        id: 'sugar_phosphate',
        name: 'Sugar-Phosphate Backbone',
        color: '#818CF8',
        position: [0.8, 0, 0],
        description: 'Deoxyribose and phosphate units linked by phosphodiester bonds.',
        spaceflightImpact: 'Target of hydroxyl radical (•OH) radiolytic cleavage from cosmic ray water radiolysis.',
      },
      {
        id: 'dsb_break_zone',
        name: 'Radiation Double-Strand Break (DSB)',
        color: '#EF4444',
        position: [0, 1.2, 0],
        description: 'Simulated cleavage where both complementary strands are simultaneously severed.',
        spaceflightImpact: 'Triggers rapid phosphorylation of histone H2AX (forming γ-H2AX foci) and 53BP1 recruitment.',
      },
    ],
  },
  {
    id: 'rna_molecule',
    name: 'Transfer & Messenger RNA',
    category: 'molecular',
    modelType: 'conceptual',
    scientificName: 'Ribonucleic Acid (Single-Strand Folding)',
    scaleDescription: 'Length ~ 70–90 nt (tRNA) / 1–5 kb (mRNA)',
    summary:
      'Single-stranded ribonucleotide polymer featuring stem-loop hairpins, cloverleaf tertiary motifs, and uracil bases replacing thymine.',
    spaceflightRelevance:
      'Transcriptomic analysis through NASA GeneLab RNA-Seq reveals systemic up-regulation of DNA damage response (CDKN1A) and oxidative stress defense genes across spaceflight missions.',
    nasaStudyRef: 'OSD-104',
    organelles: [
      {
        id: 'hairpin_loop',
        name: 'Anticodon Loop & Stem',
        color: '#34D399',
        position: [0, 1.0, 0],
        description: 'Intramolecular base-pairing creating stable stem-loop hairpins.',
        spaceflightImpact: 'Epitranscriptomic modifications (m6A RNA methylation) adapt rapidly to microgravity.',
      },
      {
        id: 'acceptor_stem',
        name: '3′ Amino Acid Acceptor Stem',
        color: '#00E5FF',
        position: [0, -1.0, 0],
        description: 'Terminal CCA sequence where cognate amino acids are enzymatically esterified.',
        spaceflightImpact: 'Translational fidelity and ribosome elongation rates fluctuate during spaceflight adaptation.',
      },
    ],
  },
  {
    id: 'protein_structure',
    name: 'Protein Conformation & Crystals',
    category: 'molecular',
    modelType: 'dataset_derived',
    scientificName: 'Macromolecular Folding & Crystal Lattice',
    scaleDescription: 'Molecular Weight ~ 50–250 kDa',
    summary:
      'Polypeptide chains folded into alpha-helices, beta-pleated sheets, and functional catalytic binding pockets.',
    spaceflightRelevance:
      'In the absence of gravity-driven buoyancy and convection currents, protein crystals grown in microgravity on the ISS achieve significantly higher internal lattice order and diffraction resolution than Earth-grown controls.',
    nasaStudyRef: 'OSD-255',
    organelles: [
      {
        id: 'alpha_helix',
        name: 'Alpha-Helical Domains',
        color: '#F59E0B',
        position: [0.6, 0.4, 0],
        description: 'Right-handed coiled polypeptide backbone stabilized by hydrogen bonds.',
        spaceflightImpact: 'Microgravity crystallization eliminates sedimentation, yielding atomic-resolution x-ray diffraction.',
      },
      {
        id: 'beta_sheet',
        name: 'Beta-Pleated Sheets',
        color: '#38BDF8',
        position: [-0.6, -0.4, 0],
        description: 'Laterally connected polypeptide strands forming flat structural planes.',
        spaceflightImpact: 'Investigated on the ISS to design targeted therapeutic inhibitors for Alzheimer and Parkinson amyloid fibrils.',
      },
    ],
  },
  {
    id: 'plant_cell',
    name: 'Plant Cell (Arabidopsis)',
    category: 'cellular',
    modelType: 'conceptual',
    scientificName: 'Arabidopsis thaliana (Thale Cress)',
    scaleDescription: 'Length ~ 30–50 µm',
    summary:
      'Model plant cell featuring rigid cellulose cell wall, large central hydraulic vacuole, starch statoliths, and photosynthesizing chloroplasts.',
    spaceflightRelevance:
      'Plants on the ISS lack gravitational settling of amyloplast statoliths in columella root cells. Without gravity, roots exhibit skewing and waving patterns, relying strictly on directed light gradients (phototropism).',
    nasaStudyRef: 'OSD-120',
    organelles: [
      {
        id: 'cell_wall',
        name: 'Cellulose Cell Wall',
        color: '#10B981',
        position: [0, 0, 0],
        description: 'Cross-linked cellulose microfibril and pectin outer protective matrix.',
        spaceflightImpact: 'Microgravity alters cell wall peroxidase enzymatic cross-linking, reducing structural rigidity.',
      },
      {
        id: 'vacuole',
        name: 'Central Vacuole',
        color: '#06B6D4',
        position: [0, 0, 0],
        description: 'Large hydraulic chamber maintaining turgor pressure and ion homeostasis.',
        spaceflightImpact: 'Undergoes osmotic shifts due to altered transpiration in microgravity airflow chambers.',
      },
      {
        id: 'chloroplasts',
        name: 'Chloroplasts (Photosystem)',
        color: '#22C55E',
        position: [1.2, 0.7, 0.4],
        description: 'Thylakoid membranes harboring chlorophyll a/b for photosynthetic light harvesting.',
        spaceflightImpact: 'Veggie and APH facilities optimize red/blue LED light ratios to maintain photosynthetic yields.',
      },
      {
        id: 'statoliths',
        name: 'Amyloplast Statoliths (Gravity Sensors)',
        color: '#FBBF24',
        position: [0, -1.2, 0],
        description: 'Dense starch-storing plastids that sediment to detect gravitational down vectors.',
        spaceflightImpact: 'Fail to sediment in microgravity, forcing roots to depend entirely on blue-light phototropism.',
      },
    ],
  },
  {
    id: 'microorganism',
    name: 'Microorganism & Biofilm',
    category: 'organism',
    modelType: 'conceptual',
    scientificName: 'Bacillus subtilis / Spacecraft Microbiome',
    scaleDescription: 'Length ~ 2–4 µm',
    summary:
      'Single-celled prokaryotic bacterium with protective peptidoglycan cell wall, motility flagella, and sticky extracellular polymeric substances (EPS).',
    spaceflightRelevance:
      'NASA microbial tracking on the ISS demonstrates that microgravity enhances extracellular matrix production, creating thicker and more antibiotic-tolerant biofilms on water recycling conduits and internal space habitat hulls.',
    nasaStudyRef: 'OSD-60',
    organelles: [
      {
        id: 'bacterial_capsule',
        name: 'Capsule & Cell Wall',
        color: '#A855F7',
        position: [0, 0, 0],
        description: 'Thick peptidoglycan layer protecting bacterial cytoplasm and nucleoid DNA.',
        spaceflightImpact: 'Thickens under microgravity fluid-shear reduction, conferring elevated survival against sanitizers.',
      },
      {
        id: 'flagella',
        name: 'Motility Flagella',
        color: '#EC4899',
        position: [1.6, 0, 0],
        description: 'Rotary helical protein filaments driven by proton motive force.',
        spaceflightImpact: 'Flagellar motility genes down-regulated as bacteria switch into sessile biofilm colonies.',
      },
      {
        id: 'biofilm_matrix',
        name: 'EPS Biofilm Shield Matrix',
        color: '#C084FC',
        position: [-0.5, 0.4, 0.6],
        description: 'Hydrated extracellular polysaccharide and protein matrix binding bacterial clusters.',
        spaceflightImpact: 'Forms column-like vertical biofilm architectures not observed under Earth 1g gravity.',
      },
    ],
  },
  {
    id: 'bone_tissue',
    name: 'Trabecular Bone Tissue (Osteopenia)',
    category: 'tissue',
    modelType: 'dataset_derived',
    scientificName: 'Trabecular Bone Remodeling Unit',
    scaleDescription: 'Strut Thickness ~ 100–200 µm',
    summary:
      'Spongy bone lattice matrix where specialized osteoclast cells resorb calcified bone while osteoblasts synthesize new collagen scaffolding.',
    spaceflightRelevance:
      'Without skeletal load-bearing in microgravity, osteoclast bone resorption accelerates while osteoblast bone formation is suppressed, resulting in 1.0–1.5% bone mineral density loss per month in astronaut weight-bearing bones (hip, spine, calcaneus).',
    nasaStudyRef: 'OSD-54',
    organelles: [
      {
        id: 'bone_strut',
        name: 'Mineralized Hydroxyapatite Matrix',
        color: '#E2E8F0',
        position: [0, 0, 0],
        description: 'Rigid composite of Type I collagen fibrils mineralized with calcium phosphate hydroxyapatite.',
        spaceflightImpact: 'Becomes thin and porous as calcium leaches into bloodstream, increasing kidney stone risk.',
      },
      {
        id: 'osteoclast',
        name: 'Osteoclast (Bone Resorbing Cell)',
        color: '#EF4444',
        position: [0.8, 0.5, 0.3],
        description: 'Large multinucleated cell secreting acid phosphatase to dissolve mineralized bone.',
        spaceflightImpact: 'Hyperactivated in microgravity due to lack of piezo-electric mechanotransduction.',
      },
      {
        id: 'osteoblast',
        name: 'Osteoblast (Bone Forming Cell)',
        color: '#38BDF8',
        position: [-0.8, -0.4, -0.2],
        description: 'Monomorphic cell depositing osteoid organic collagen matrix.',
        spaceflightImpact: 'Suppressed by elevated sclerostin (SOST gene) and inhibited Wnt/beta-catenin signaling.',
      },
    ],
  },
  {
    id: 'muscle_sarcomere',
    name: 'Skeletal Muscle Sarcomere',
    category: 'tissue',
    modelType: 'dataset_derived',
    scientificName: 'Myofibril Sarcomere (Contractile Unit)',
    scaleDescription: 'Resting Length ~ 2.2 µm between Z-discs',
    summary:
      'Elementary contractile machine of skeletal muscle consisting of parallel actin thin filaments interdigitating with myosin thick filaments bounded by lateral Z-discs.',
    spaceflightRelevance:
      'Postural slow-twitch (Type I) muscle fibers in the calf (soleus) experience rapid ubiquitin-proteasome protein degradation in space, causing up to 20% loss of muscle volume on 6-month missions if resistive exercise is not performed.',
    nasaStudyRef: 'OSD-104',
    organelles: [
      {
        id: 'z_disc',
        name: 'Z-Disc Anchoring Boundaries',
        color: '#6366F1',
        position: [-1.4, 0, 0],
        description: 'Proteinaceous transverse partition anchoring actin filaments through alpha-actinin.',
        spaceflightImpact: 'Shows structural misalignment and Z-line streaming after prolonged microgravity disuse.',
      },
      {
        id: 'myosin_thick',
        name: 'Myosin Thick Filaments (A-Band)',
        color: '#F43F5E',
        position: [0, 0, 0],
        description: 'Bipolar hexameric motor protein assemblies with ATP-hydrolyzing globular heads.',
        spaceflightImpact: 'Heavy chain degradation driven by up-regulation of MuRF-1 (TRIM63) and Atrogin-1 (FBXO32).',
      },
      {
        id: 'actin_thin',
        name: 'Actin Thin Filaments (I-Band)',
        color: '#38BDF8',
        position: [0.8, 0.3, 0],
        description: 'Filamentous F-actin polymers wrapped with regulatory troponin and tropomyosin complexes.',
        spaceflightImpact: 'Reduced calcium sensitivity and decreased cross-bridge binding force in orbit.',
      },
    ],
  },
];

// ============================================================================
// 2. SPACEFLIGHT BIOLOGY LEARNING EXPERIENCES (8 Modules with OSDR Ties)
// ============================================================================
export const SPACEFLIGHT_TOPICS: SpaceflightTopicDef[] = [
  {
    id: 'microgravity_fluids',
    title: 'Cephalic Fluid Shift & SANS',
    system: 'Cardiovascular & Neuro-Ocular',
    badge: 'CARDIO-NEURAL',
    iconName: 'Activity',
    severity: 'high',
    summary:
      'Without Earth gravity pulling bodily fluids down, approximately 2 liters of venous blood and interstitial fluid shift from the legs upward into the chest and head.',
    physiologicalMechanism:
      'Headward fluid redistribution raises central venous pressure and elevates jugular vein diameter. Prolonged cephalic venous congestion leads to Spaceflight-Associated Neuro-Ocular Syndrome (SANS), characterized by optic disc edema, globe flattening, and hyperopic refractive shift.',
    cellularPathway:
      'Endothelial mechanotransduction alteration, decreased nitric oxide (eNOS) signaling, and increased blood-brain barrier permeability.',
    clinicalImplication:
      'Astronauts experience puffy facial edema, sinus congestion, altered intracranial pressure, and progressive visual acuity loss during long-duration ISS expeditions.',
    countermeasures: [
      'Lower Body Negative Pressure (LBNP) suits (Chibis)',
      'Daily cardiovascular ergometer intervals',
      'Venous return compression cuffs',
    ],
    osdrStudy: {
      accession: 'OSD-137',
      title: 'Vascular Remodeling and Endothelial Gene Expression during Spaceflight',
      organism: 'Mus musculus / Homo sapiens',
      mission: 'SpaceX CRS-12 / ISS Expeditions',
      platform: 'Illumina RNA-Seq & Flow Cytometry',
      summaryFindings:
        'Demonstrated down-regulation of vascular smooth muscle contractile genes and significant remodeling of cerebral arterial wall thickness in microgravity.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-137',
    },
    keyGenes: ['NOS3', 'VEGFA', 'EDN1', 'ICAM1'],
  },
  {
    id: 'radiation_dna',
    title: 'Galactic Cosmic Radiation & DNA Breaks',
    system: 'Genomic Integrity & Cellular Aging',
    badge: 'GENOMIC DAMAGE',
    iconName: 'Dna',
    severity: 'critical',
    summary:
      'Astronauts outside Earth protective magnetosphere receive chronic high-LET galactic cosmic rays and sudden solar particle events that cause complex clustered DNA lesions.',
    physiologicalMechanism:
      'Heavy charged iron (56Fe) and silicon ions generate dense ionization tracks across chromosomes, causing double-strand breaks that are refractory to conventional non-homologous end joining (NHEJ) repair. In the NASA Twins Study, telomeres lengthened in space and rapidly shortened upon Earth return.',
    cellularPathway:
      'ATM/ATR kinase phosphorylation cascade, p53 stabilization, induction of CDKN1A (p21) cell cycle inhibitor, and elevated mitochondrial oxidative stress.',
    clinicalImplication:
      'Lifelong elevation in lifetime excess risk of cancer mortality (REICM), premature cataract formation, accelerated cardiovascular disease, and central nervous system cognitive deficits.',
    countermeasures: [
      'Polyethylene hydrogen-rich composite hull shielding',
      'Internal water wall crew quarters shielding',
      'Dietary antioxidant supplementation and radioprotective pharmaceuticals',
    ],
    osdrStudy: {
      accession: 'OSD-168',
      title: 'NASA Twins Study: Multi-Omics and Genomic Integrity in Monozygotic Twins',
      organism: 'Homo sapiens (Twin Astronauts)',
      mission: 'ISS One-Year Mission (Expeditions 43–46)',
      platform: 'Whole Genome Sequencing, RNA-Seq, Telomere Length Assay',
      summaryFindings:
        'Revealed persistent chromosomal inversions, thousands of differentially expressed genes, and a rapid surge in short telomeres within 48 hours post-landing.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-168',
    },
    keyGenes: ['CDKN1A', 'TERT', 'ATM', 'TP53', 'SOD2'],
  },
  {
    id: 'muscle_atrophy',
    title: 'Skeletal Muscle Atrophy & Proteolysis',
    system: 'Musculoskeletal System',
    badge: 'MUSCLE LOSS',
    iconName: 'Flame',
    severity: 'high',
    summary:
      'Postural antigravity muscles lose up to 20% of their mass and 30% of their force generation capacity within months if daily high-resistance exercise is not performed.',
    physiologicalMechanism:
      'The absence of gravitational biomechanical strain halts muscle mechanosensitive signaling (mTORC1), while simultaneously hyperactivating ubiquitin-proteasome E3 ligases (MuRF1 and Atrogin-1) that dismantle myofibrillar contractile proteins.',
    cellularPathway:
      'Suppression of IGF1-Akt-mTOR anabolic cascade and elevation of FOXO transcription factors inducing TRIM63 (MuRF1) and FBXO32.',
    clinicalImplication:
      'Profound weakness upon landing on planetary surfaces, impaired balance, elevated fatigue, and vulnerability to tendon strain during EVA surface exploration.',
    countermeasures: [
      'Advanced Resistive Exercise Device (ARED) squats, deadlifts, and heel raises',
      'High-protein branch-chain amino acid (BCAA) dietary regimens',
      'Neuromuscular electrical stimulation (NMES)',
    ],
    osdrStudy: {
      accession: 'OSD-104',
      title: 'Transcriptomic Profiling of Soleus and Extensor Digitorum Longus in Rodent Research-1',
      organism: 'Mus musculus',
      mission: 'SpaceX CRS-4 / ISS Rodent Research-1',
      platform: 'Illumina HiSeq 2500 RNA-Seq',
      summaryFindings:
        'Showed substantial up-regulation of muscle-wasting ubiquitin ligases TRIM63 and FBXO32 specifically in postural slow-twitch soleus muscles.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-104',
    },
    keyGenes: ['TRIM63', 'FBXO32', 'MYOG', 'IGF1', 'FOXO3'],
  },
  {
    id: 'bone_osteopenia',
    title: 'Disuse Osteopenia & Calcium Demineralization',
    system: 'Skeletal & Mineral Metabolism',
    badge: 'BONE LOSS',
    iconName: 'Shield',
    severity: 'critical',
    summary:
      'Astronauts lose 1.0% to 1.5% of bone mineral density per month in weight-bearing bones, shedding calcium into the bloodstream at rates 10 times faster than severe terrestrial osteoporosis.',
    physiologicalMechanism:
      'Bone fluid flow through osteocyte canaliculi ceases in weightlessness, eliminating shear stress mechanotransduction. Osteocytes secrete sclerostin, shutting down osteoblast bone building while osteoclast bone resorption continues unchecked.',
    cellularPathway:
      'SOST (sclerostin) up-regulation, suppression of LRP5/6 Wnt/beta-catenin signaling, and elevation of RANKL-mediated osteoclastogenesis.',
    clinicalImplication:
      'Elevated risk of bone fractures upon Martian surface operations, permanent micro-architectural trabecular perforation, and severe nephrolithiasis (kidney stones) from hypercalciuria.',
    countermeasures: [
      'ARED heavy axial loading exercises (up to 600 lbs load)',
      'Bisphosphonate anti-resorptive infusions prior to flight',
      'Daily Vitamin D3 and potassium citrate supplementation',
    ],
    osdrStudy: {
      accession: 'OSD-54',
      title: 'Micro-CT and Epigenomic Analysis of Murine Femoral Trabeculae in Microgravity',
      organism: 'Mus musculus',
      mission: 'STS-131 Space Shuttle Discovery',
      platform: 'Scanco µCT 40 & Microarray',
      summaryFindings:
        'Quantified a 34% reduction in trabecular bone volume fraction (BV/TV) and severe connectivity loss in distal femoral metaphyses.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-54',
    },
    keyGenes: ['SOST', 'ALPL', 'RUNX2', 'TNFSF11', 'COL1A1'],
  },
  {
    id: 'immune_dysregulation',
    title: 'Immune Dysregulation & Viral Reactivation',
    system: 'Immune & Lymphoid System',
    badge: 'IMMUNODEFICIENCY',
    iconName: 'Activity',
    severity: 'moderate',
    summary:
      'The spaceflight environment suppresses cell-mediated immunity, dampening T-cell proliferation and permitting dormant herpesviruses to reactivate.',
    physiologicalMechanism:
      'Synergistic stress from microgravity, circadian disruption, confined isolation, and ionizing radiation suppresses early T-cell receptor (TCR) signal transduction. Natural killer (NK) cell cytotoxicity drops by up to 50%.',
    cellularPathway:
      'Inhibition of protein kinase C theta (PRKCQ), decreased IL-2 transcription, and dysregulated Th1/Th2 cytokine balance.',
    clinicalImplication:
      'Subclinical shedding of Epstein-Barr virus (EBV), Varicella-Zoster virus (VZV), and Cytomegalovirus (CMV), delayed wound healing, and persistent hypersensitivity rashes.',
    countermeasures: [
      'Prophylactic antiviral medications (Acyclovir/Valacyclovir)',
      'Optimized circadian blue/red LED cabin lighting schedules',
      'Nutritional immunonutrients and stress mitigation protocols',
    ],
    osdrStudy: {
      accession: 'OSD-423',
      title: 'T-Cell Activation Suppression and Cytokine Dynamics on the International Space Station',
      organism: 'Homo sapiens (Astronaut Blood Plasma)',
      mission: 'ISS Expeditions 50–55',
      platform: 'Multiplex Luminex & RNA-Seq',
      summaryFindings:
        'Confirmed substantial suppression of key T-cell activation cytokines IL-2 and IFN-gamma alongside elevated viral DNA copy numbers in saliva.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-423',
    },
    keyGenes: ['IL2', 'IFNG', 'PRKCQ', 'NFKB1', 'TNF'],
  },
  {
    id: 'plant_growth',
    title: 'Plant Hypoxia & Gravitropic Root Skewing',
    system: 'Space Agriculture & Botany',
    badge: 'BIO-REGENERATION',
    iconName: 'Sun',
    severity: 'moderate',
    summary:
      'Plants grown in space for life support and fresh nutrition must overcome root hypoxia caused by the complete absence of gravity-driven air and water convection.',
    physiologicalMechanism:
      'In weightlessness, water forms a suffocating liquid meniscus around root hairs, blocking gas diffusion. Without statolith gravity cues, roots exhibit helical waving and skewing, depending on blue-light phototropic receptors (phototropins) to guide downward growth.',
    cellularPathway:
      'Auxin efflux carrier (PIN2) re-localization, heat shock protein (HSP) induction, and hypoxia core gene (ADH1/PDC1) up-regulation.',
    clinicalImplication:
      'Directly affects the yield and nutritional value of bio-regenerative life support crops (lettuce, dwarf wheat, tomatoes) required for 3-year human Mars expeditions.',
    countermeasures: [
      'Advanced Plant Habitat (APH) porous tube rooting matrices',
      'Forced ventilation fans ensuring continuous air exchange',
      'Optimized Red/Blue/Far-Red narrow-band LED photoperiods',
    ],
    osdrStudy: {
      accession: 'OSD-120',
      title: 'Transcriptional Response of Arabidopsis thaliana in the Veggie Plant Habitat',
      organism: 'Arabidopsis thaliana (Col-0)',
      mission: 'SpaceX CRS-11 / ISS Veggie-03',
      platform: 'Illumina NextSeq 500 RNA-Seq',
      summaryFindings:
        'Demonstrated that root tissues activate profound anaerobic fermentative pathways (ADH1) due to microgravity boundary-layer fluid phenomena.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-120',
    },
    keyGenes: ['PIN2', 'ADH1', 'HSP70', 'PHOT1', 'PDC1'],
  },
  {
    id: 'microbial_biofilms',
    title: 'Microbial Virulence & Biofilm Formation',
    system: 'Microbiology & Spacecraft Hygiene',
    badge: 'PATHOGEN DYNAMICS',
    iconName: 'Globe2',
    severity: 'high',
    summary:
      'Microorganisms on the ISS adapt to reduced fluid shear by producing thicker extracellular biofilm shields and displaying heightened resistance to common antibiotics.',
    physiologicalMechanism:
      'Low fluid shear in microgravity mimics the quiescent microenvironment of the human gastrointestinal and respiratory tracts, triggering global regulatory cascades (Hfq RNA chaperone) that up-regulate virulence factors and stress resistance.',
    cellularPathway:
      'Hfq-dependent small regulatory RNA (sRNA) cascades, rpoS general stress response, and multi-drug efflux pump activation.',
    clinicalImplication:
      'Biofilms clog environmental control and life support system (ECLSS) water processing lines, corrode metallic habitat alloys, and pose infection risks to immunocompromised astronauts.',
    countermeasures: [
      'Antimicrobial surface coatings (silver and copper nanostructures)',
      'HEPA filtration and UV-C disinfection cycles in air ducts',
      'Routine swab metagenomic surveillance and deep biocidal wipe-downs',
    ],
    osdrStudy: {
      accession: 'OSD-60',
      title: 'Whole-Genome Sequencing and Biofilm Profiling of ISS Bacillus subtilis Isolates',
      organism: 'Bacillus subtilis / Staphylococcus',
      mission: 'ISS Surface Microbiome Swab Surveys',
      platform: 'PacBio & Illumina Whole Genome Sequencing',
      summaryFindings:
        'Identified mutations in sporulation and cell-envelope synthesis genes conferring 3-fold higher resistance to quaternary ammonium disinfectants.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-60',
    },
    keyGenes: ['HFQ', 'RPOS', 'ACRA', 'TOLA', 'BSLA'],
  },
  {
    id: 'mars_countermeasures',
    title: 'Long-Duration Mars Transit Health Architecture',
    system: 'Integrated Multi-System Physiology',
    badge: 'MISSION CRITICAL',
    iconName: 'Rocket',
    severity: 'critical',
    summary:
      'A 1,000-day round-trip human expedition to Mars requires an integrated countermeasure suite combining artificial gravity, heavy resistive exercise, and active radiation shielding.',
    physiologicalMechanism:
      'Unmitigated multi-year exposure to microgravity and deep-space GCR causes irreversible structural trabecular bone loss, cardiovascular deconditioning, optic neuropathy, and persistent genomic instability.',
    cellularPathway:
      'Synergistic interplay of cellular DNA repair, antioxidant enzymatic networks (SOD/Catalase), and mechanosensitive musculoskeletal gene transcription.',
    clinicalImplication:
      'Determines whether human explorers can safely perform manual extravehicular operations immediately upon landing in Martian 0.38g gravity after 9 months of weightlessness.',
    countermeasures: [
      'Short-radius human centrifuge artificial gravity (1g at feet)',
      'ARED 2.5 hours/day resistive and aerobic conditioning',
      'Integrated habitat storm shelter with water/fuel shielding',
      'Automated autonomous biomedical diagnostic ultrasound and labs',
    ],
    osdrStudy: {
      accession: 'OSD-255',
      title: 'Integrated Multi-Omics and Physiomic Atlas of Astronaut Health in Long-Duration Spaceflight',
      organism: 'Homo sapiens (ISS Astronaut Cohort)',
      mission: 'ISS Long-Duration Missions (6–12 months)',
      platform: 'Multi-Omics: Genomics, Proteomics, Metabolomics, Epigenomics',
      summaryFindings:
        'Established the fundamental NASA space biology roadmap demonstrating that rigorous resistive exercise preserves 85% of muscle strength and 90% of femoral bone mass.',
      authoritativeUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-255',
    },
    keyGenes: ['CDKN1A', 'SOD2', 'TRIM63', 'ALPL', 'IL2'],
  },
];

// ============================================================================
// 3. MULTI-OMICS GENE BIOMARKER EXPRESSION DATASETS
// ============================================================================
export const BIOMARKER_GENES: BiomarkerGeneData[] = [
  {
    symbol: 'CDKN1A',
    name: 'Cyclin Dependent Kinase Inhibitor 1A (p21)',
    pathway: 'DNA Damage Response & Cell Cycle Arrest',
    flightExpression: 3.42,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 2.85,
    pVal: 0.00018,
    significance: 'significant',
    direction: 'up',
    description:
      'Primary cellular checkpoint arrested in G1 phase following cosmic radiation-induced DNA double-strand breaks. Elevated across both flight and 1g centrifuge spaceflight conditions.',
    studyAccession: 'OSD-168',
  },
  {
    symbol: 'SOD2',
    name: 'Superoxide Dismutase 2 (Mitochondrial)',
    pathway: 'Antioxidant Defense & ROS Scavenging',
    flightExpression: 2.18,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 1.74,
    pVal: 0.0024,
    significance: 'significant',
    direction: 'up',
    description:
      'Encodes mitochondrial manganese superoxide dismutase clearing toxic superoxide anions generated by radiation and metabolic stress during spaceflight.',
    studyAccession: 'OSD-104',
  },
  {
    symbol: 'TRIM63',
    name: 'Tripartite Motif Containing 63 (MuRF1)',
    pathway: 'Skeletal Muscle Proteolysis & Atrophy',
    flightExpression: 4.85,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 1.15,
    pVal: 0.00004,
    significance: 'significant',
    direction: 'up',
    description:
      'Muscle-specific ubiquitin ligase targeting sarcomeric myosin heavy chain for proteasomal degradation. Notably normalized back to baseline in in-flight 1g centrifuge controls.',
    studyAccession: 'OSD-104',
  },
  {
    symbol: 'ALPL',
    name: 'Alkaline Phosphatase (Tissue-Nonspecific)',
    pathway: 'Osteoblast Differentiation & Bone Mineralization',
    flightExpression: 0.38,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 0.92,
    pVal: 0.0008,
    significance: 'significant',
    direction: 'down',
    description:
      'Essential enzyme for bone matrix calcification. Suppressed in microgravity due to absent skeletal strain, reflecting osteoblast quiescence and bone demineralization.',
    studyAccession: 'OSD-54',
  },
  {
    symbol: 'IL2',
    name: 'Interleukin 2 (T-Cell Growth Factor)',
    pathway: 'Adaptive Immunity & T-Cell Proliferation',
    flightExpression: 0.29,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 0.65,
    pVal: 0.0011,
    significance: 'significant',
    direction: 'down',
    description:
      'Key cytokine driving T-cell expansion. Substantially repressed in astronaut blood samples during orbital flight, contributing to latent viral reactivation.',
    studyAccession: 'OSD-423',
  },
  {
    symbol: 'GPX1',
    name: 'Glutathione Peroxidase 1',
    pathway: 'Peroxide Detoxification',
    flightExpression: 1.84,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 1.55,
    pVal: 0.0062,
    significance: 'significant',
    direction: 'up',
    description:
      'Cytosolic peroxidase converting hydrogen peroxide to water, elevated in rodent and astronaut tissues to counteract cosmic radiation-induced lipid peroxidation.',
    studyAccession: 'OSD-137',
  },
  {
    symbol: 'COL1A1',
    name: 'Collagen Type I Alpha 1 Chain',
    pathway: 'Extracellular Matrix & Bone Architecture',
    flightExpression: 0.45,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 0.88,
    pVal: 0.0019,
    significance: 'significant',
    direction: 'down',
    description:
      'Major structural protein of bone osteoid and tendon connective tissue. Shows diminished synthesis under continuous zero-gravity unloading.',
    studyAccession: 'OSD-54',
  },
  {
    symbol: 'PRKCQ',
    name: 'Protein Kinase C Theta',
    pathway: 'T-Cell Receptor Mechanosignaling',
    flightExpression: 0.41,
    groundControlExpression: 1.0,
    centrifugeControlExpression: 0.78,
    pVal: 0.0035,
    significance: 'significant',
    direction: 'down',
    description:
      'Essential kinase translocating to the immunological synapse. Inhibited by microgravity, impairing downstream NF-kappaB nuclear translocation.',
    studyAccession: 'OSD-423',
  },
];

// ============================================================================
// 4. MULTI-OMICS HEATMAP SAMPLES MATRIX
// ============================================================================
export const HEATMAP_SAMPLES: HeatmapSample[] = [
  {
    sampleId: 'GC-Rep1',
    condition: 'Ground Control',
    replicate: 1,
    missionDurationDays: 30,
    values: { CDKN1A: -1.2, SOD2: -0.9, TRIM63: -1.5, ALPL: 1.4, IL2: 1.3, GPX1: -0.8, COL1A1: 1.2, PRKCQ: 1.1 },
  },
  {
    sampleId: 'GC-Rep2',
    condition: 'Ground Control',
    replicate: 2,
    missionDurationDays: 30,
    values: { CDKN1A: -1.0, SOD2: -1.1, TRIM63: -1.3, ALPL: 1.2, IL2: 1.5, GPX1: -1.0, COL1A1: 1.4, PRKCQ: 1.3 },
  },
  {
    sampleId: 'GC-Rep3',
    condition: 'Ground Control',
    replicate: 3,
    missionDurationDays: 30,
    values: { CDKN1A: -1.3, SOD2: -0.8, TRIM63: -1.4, ALPL: 1.5, IL2: 1.2, GPX1: -0.7, COL1A1: 1.1, PRKCQ: 1.0 },
  },
  {
    sampleId: 'FLT-Rep1',
    condition: 'Spaceflight (uG)',
    replicate: 1,
    missionDurationDays: 30,
    values: { CDKN1A: 2.1, SOD2: 1.8, TRIM63: 2.4, ALPL: -1.8, IL2: -1.9, GPX1: 1.5, COL1A1: -1.7, PRKCQ: -1.8 },
  },
  {
    sampleId: 'FLT-Rep2',
    condition: 'Spaceflight (uG)',
    replicate: 2,
    missionDurationDays: 30,
    values: { CDKN1A: 2.3, SOD2: 1.9, TRIM63: 2.6, ALPL: -1.9, IL2: -2.1, GPX1: 1.7, COL1A1: -1.9, PRKCQ: -1.9 },
  },
  {
    sampleId: 'FLT-Rep3',
    condition: 'Spaceflight (uG)',
    replicate: 3,
    missionDurationDays: 30,
    values: { CDKN1A: 1.9, SOD2: 1.6, TRIM63: 2.2, ALPL: -1.6, IL2: -1.7, GPX1: 1.4, COL1A1: -1.5, PRKCQ: -1.6 },
  },
  {
    sampleId: 'CEN-Rep1',
    condition: 'Centrifuge (ISS 1G)',
    replicate: 1,
    missionDurationDays: 30,
    values: { CDKN1A: 1.5, SOD2: 1.1, TRIM63: -0.2, ALPL: 0.8, IL2: -0.4, GPX1: 1.0, COL1A1: 0.6, PRKCQ: -0.3 },
  },
  {
    sampleId: 'CEN-Rep2',
    condition: 'Centrifuge (ISS 1G)',
    replicate: 2,
    missionDurationDays: 30,
    values: { CDKN1A: 1.7, SOD2: 1.3, TRIM63: -0.1, ALPL: 0.9, IL2: -0.5, GPX1: 1.2, COL1A1: 0.7, PRKCQ: -0.2 },
  },
];

// ============================================================================
// 5. CURATED VERIFIED NASA OSDR & GENELAB DATASETS
// ============================================================================
export const VERIFIED_OSDR_STUDIES: NasaOsdrStudyMetadata[] = [
  {
    accession: 'OSD-168',
    title: 'NASA Twins Study: Multi-Omics and Genomic Integrity of Long-Duration Spaceflight',
    description:
      'Comprehensive multi-omics profiling of identical twin astronauts assessing genomic, epigenomic, transcriptomic, metabolomic, and immune parameters across 340 days on the International Space Station.',
    spaceProgram: 'NASA Human Research Program (HRP)',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'ISS Expeditions 43–46 (One-Year Mission)',
    managingNasaCenter: 'NASA Johnson Space Center (JSC)',
    organism: ['Homo sapiens'],
    dataSourceType: 'cgene',
    dataSourceAccession: 'GLDS-168',
    publicReleaseDate: '2019-04-11',
    measurementType: 'Multi-Omics (WGS, RNA-Seq, Telomeres, Metabolomics)',
    technologyPlatform: 'Illumina HiSeq 2500 & PacBio RS II',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-168',
    factors: ['Spaceflight', 'Microgravity', 'Galactic Cosmic Radiation', 'One-Year Duration'],
  },
  {
    accession: 'OSD-104',
    title: 'Transcriptomic Profiling of Mus Musculus Gastrocnemius and Soleus Muscles in Rodent Research-1',
    description:
      'RNA-Seq profiling of calf and soleus muscle tissues from female C57BL/6J mice flown on the ISS for 37 days aboard SpaceX CRS-4, identifying muscle atrophy ubiquitin ligase activation.',
    spaceProgram: 'NASA Space Biology Program',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'SpaceX CRS-4 / Rodent Research-1 (RR-1)',
    managingNasaCenter: 'NASA Ames Research Center (ARC)',
    organism: ['Mus musculus'],
    dataSourceType: 'cgene',
    dataSourceAccession: 'GLDS-104',
    publicReleaseDate: '2017-06-22',
    measurementType: 'Transcriptomics (RNA-Seq)',
    technologyPlatform: 'Illumina HiSeq 2000',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-104',
    factors: ['Microgravity', 'Flight vs Ground Control', 'Soleus Muscle', '37 Days'],
  },
  {
    accession: 'OSD-54',
    title: 'Micro-CT and Epigenomic Analysis of Murine Femoral Metaphyses in Spaceflight',
    description:
      'High-resolution micro-computed tomography (micro-CT) and gene expression analysis of trabecular and cortical bone compartments in mice flown on STS-131, quantifying spaceflight osteopenia.',
    spaceProgram: 'NASA Space Biology Program',
    flightProgram: 'Space Transportation System (Shuttle)',
    missionName: 'STS-131 Space Shuttle Discovery',
    managingNasaCenter: 'NASA Kennedy Space Center (KSC)',
    organism: ['Mus musculus'],
    dataSourceType: 'alsda',
    dataSourceAccession: 'ALSDA-54',
    publicReleaseDate: '2016-02-18',
    measurementType: 'Micro-CT & DNA Microarray',
    technologyPlatform: 'Scanco µCT 40 & Affymetrix GeneChip',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-54',
    factors: ['Microgravity', 'Bone Mineral Density', 'STS-131', '15 Days'],
  },
  {
    accession: 'OSD-120',
    title: 'Transcriptional Response and Gravitropic Hypoxia in Arabidopsis Thaliana Grown in Veggie',
    description:
      'RNA-Seq investigation of Arabidopsis thaliana seedlings germinated and grown on the ISS Veggie facility, revealing substantial root hypoxia and auxin-mediated root skewing.',
    spaceProgram: 'NASA Space Biology Program',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'SpaceX CRS-11 / Veggie-03',
    managingNasaCenter: 'NASA Kennedy Space Center (KSC)',
    organism: ['Arabidopsis thaliana'],
    dataSourceType: 'cgene',
    dataSourceAccession: 'GLDS-120',
    publicReleaseDate: '2018-09-05',
    measurementType: 'Transcriptomics (RNA-Seq)',
    technologyPlatform: 'Illumina NextSeq 500',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-120',
    factors: ['Microgravity', 'Plant Habitat', 'Veggie-03', 'Auxin Skewing'],
  },
  {
    accession: 'OSD-423',
    title: 'T-Cell Activation Suppression and Cytokine Dynamics on the International Space Station',
    description:
      'Comprehensive flow cytometry and multiplex cytokine profiling of peripheral blood mononuclear cells from long-duration ISS crew members, assessing T-cell receptor signaling and latent viral reactivation.',
    spaceProgram: 'NASA Human Research Program (HRP)',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'ISS Expeditions 50–55',
    managingNasaCenter: 'NASA Johnson Space Center (JSC)',
    organism: ['Homo sapiens'],
    dataSourceType: 'alsda',
    dataSourceAccession: 'ALSDA-423',
    publicReleaseDate: '2021-03-14',
    measurementType: 'Flow Cytometry & Luminex Multiplex Cytokine Assay',
    technologyPlatform: 'BD FACSCanto II & Luminex 200',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-423',
    factors: ['Long Duration', 'Spaceflight', 'T-Cell Activation', 'Immune Suppression'],
  },
  {
    accession: 'OSD-60',
    title: 'Metagenomic Sequencing and Disinfectant Resistance of ISS Bacillus Subtilis Isolates',
    description:
      'Whole-genome sequencing and phenotyping of Bacillus subtilis strains isolated from the ISS dining table, cupola, and ECLSS water recycler, discovering elevated biofilm formation and biocide tolerance.',
    spaceProgram: 'NASA Space Biology Program',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'ISS Environmental Microbiome Swab Surveys',
    managingNasaCenter: 'NASA Jet Propulsion Laboratory (JPL)',
    organism: ['Bacillus subtilis'],
    dataSourceType: 'cgene',
    dataSourceAccession: 'GLDS-60',
    publicReleaseDate: '2016-11-29',
    measurementType: 'Whole Genome Sequencing (WGS)',
    technologyPlatform: 'PacBio RS II & Illumina MiSeq',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-60',
    factors: ['Spacecraft Environment', 'Biofilm', 'Disinfectant Resistance'],
  },
  {
    accession: 'OSD-255',
    title: 'Integrated Multi-Omics and Physiomic Atlas of Astronaut Health in Long-Duration Spaceflight',
    description:
      'Landmark multi-omics synthesis across 560 astronaut biospecimens establishing the comprehensive biological hallmarks of spaceflight: mitochondrial dysfunction, DNA damage, and telomere dynamics.',
    spaceProgram: 'NASA Open Science Data Repository (OSDR)',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'ISS Long-Duration Expedition Cohort',
    managingNasaCenter: 'NASA Ames Research Center (ARC)',
    organism: ['Homo sapiens'],
    dataSourceType: 'cgene',
    dataSourceAccession: 'GLDS-255',
    publicReleaseDate: '2020-11-25',
    measurementType: 'Multi-Omics Meta-Analysis',
    technologyPlatform: 'Illumina NovaSeq 6000 & Mass Spectrometry',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-255',
    factors: ['Long Duration', 'Multi-Omics', 'Mitochondrial Stress', 'Countermeasures'],
  },
  {
    accession: 'OSD-379',
    title: 'ESA Spaceflight Biology: Drosophila Melanogaster Cardiovascular Function in Microgravity',
    description:
      'European Space Agency collaboration studying cardiac tube remodeling, myofibrillar structural degradation, and circadian rhythm gene oscillations in fruit flies flown on the ISS.',
    spaceProgram: 'ESA Life Sciences / NASA OSDR Partnership',
    flightProgram: 'International Space Station (ISS)',
    missionName: 'ESA BioLab / ISS Expeditions',
    managingNasaCenter: 'ESA ESTEC & NASA Ames (ARC)',
    organism: ['Drosophila melanogaster'],
    dataSourceType: 'esa',
    dataSourceAccession: 'ESA-OSD-379',
    publicReleaseDate: '2021-08-19',
    measurementType: 'High-Speed Video Optical Coherence & RNA-Seq',
    technologyPlatform: 'Illumina HiSeq 4000',
    authoritativeSourceUrl: 'https://osdr.nasa.gov/osdr/data/dataset/OSD-379',
    factors: ['ESA Study', 'Cardiovascular', 'Microgravity', 'Drosophila'],
  },
];
