import { VerifiedEmergencyContact, ActionChecklistItem, IncidentType } from '@/types';

export const VERIFIED_EMERGENCY_CONTACTS: VerifiedEmergencyContact[] = [
  {
    service: 'National Emergency Response Support System (ERSS)',
    number: '112',
    category: 'national',
    description: 'All-in-one unified emergency helpline across India (Police, Fire, Ambulance, Disaster). Available 24/7.',
    descriptionTelugu: 'భారతదేశ వ్యాప్తంగా ఏకీకృత అత్యవసర హెల్ప్‌లైన్ (పోలీస్, ఫైర్, అంబులెన్స్, విపత్తు). 24/7 అందుబాటులో ఉంటుంది.',
    isVerified: true,
    hours: '24/7 / 365 Days',
  },
  {
    service: 'Fire & Rescue Services',
    number: '101',
    category: 'national',
    description: 'Immediate fire brigade dispatch and structural collapse extraction.',
    descriptionTelugu: 'అగ్నిమాపక మరియు రక్షణ దళాల తక్షణ సహాయం.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'Emergency Medical Services (Ambulance)',
    number: '108',
    category: 'medical',
    description: 'Trained paramedics, basic & advanced life support ambulances for trauma, stroke, and critical care.',
    descriptionTelugu: 'అత్యవసర వైద్య రవాణా మరియు అంబులెన్స్ సేవలు.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'State Disaster Management Authority (SDMA)',
    number: '1070',
    category: 'disaster',
    description: 'State-level disaster control room during floods, cyclones, and industrial emergencies.',
    descriptionTelugu: 'రాష్ట్ర విపత్తు నిర్వహణ విభాగం కంట్రోల్ రూమ్.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'District Emergency Operations Centre (DEOC)',
    number: '1077',
    category: 'disaster',
    description: 'District collectorate crisis response desk for localized relief and evacuation coordination.',
    descriptionTelugu: 'జిల్లా విపత్తు అత్యవసర నిర్వహణ కేంద్రం.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'National Disaster Response Force (NDRF) HQ',
    number: '011-24363260',
    category: 'disaster',
    description: 'Central command for federal flood rescue boats, hazmat teams, and canine search units.',
    descriptionTelugu: 'జాతీయ విపత్తు ప్రతిస్పందన దళం (NDRF) ప్రధాన కార్యాలయం.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'Janani Shishu Suraksha (Maternal & Infant Ambulance)',
    number: '102',
    category: 'medical',
    description: 'Dedicated transport for pregnant mothers and newborns.',
    descriptionTelugu: 'గర్భిణీ స్త్రీలు మరియు నవజాత శిశువుల కోసం ప్రత్యేక అంబులెన్స్ సేవ.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'Women Distress Helpline',
    number: '1091',
    category: 'national',
    description: 'Immediate safety support and crisis response for women.',
    descriptionTelugu: 'మహిళల భద్రత మరియు అత్యవసర సహాయ హెల్ప్‌లైన్.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'National Childline Emergency',
    number: '1098',
    category: 'national',
    description: 'Rescue and protection for unaccompanied minors, lost children, and infants in crisis.',
    descriptionTelugu: 'ఆపదలో ఉన్న పిల్లల కోసం జాతీయ రక్షణ హెల్ప్‌లైన్.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'Chennai Municipal Corporation Flood Control',
    number: '1913',
    category: 'city',
    description: 'Greater Chennai Corporation (GCC) 24x7 control room for waterlogging, tree falls, and boat deployment.',
    descriptionTelugu: 'చెన్నై మునిసిపల్ కార్పొరేషన్ వరద మరియు సహాయ నియంత్రణ కేంద్రం.',
    isVerified: true,
    hours: '24/7 During Monsoon/Crisis',
  },
  {
    service: 'Hyderabad GHMC Disaster Management Desk',
    number: '040-21111111',
    category: 'city',
    description: 'Greater Hyderabad Municipal Corporation monsoon emergency helpline and emergency rescue team dispatch.',
    descriptionTelugu: 'హైదరాబాద్ జిహెచ్ఎంసి విపత్తు నిర్వహణ హెల్ప్‌లైన్.',
    isVerified: true,
    hours: '24/7',
  },
  {
    service: 'Bengaluru BBMP Emergency Control Desk',
    number: '080-22660000',
    category: 'city',
    description: 'Bruhat Bengaluru Mahanagara Palike storm water overflow and fallen tree clearance desk.',
    descriptionTelugu: 'బెంగళూరు బిబిఎంపి అత్యవసర సహాయ కేంద్రం.',
    isVerified: true,
    hours: '24/7',
  },
];

/**
 * Generates situation-specific action checklists based on incident type and urgency
 */
export function getActionChecklistForIncident(
  type: IncidentType,
  urgency: string,
  isTeluguPreferred: boolean = false
): ActionChecklistItem[] {
  switch (type) {
    case 'flood':
      return [
        {
          step: 1,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Move immediately to the highest accessible floor or roof terrace. Avoid basements, cellars, and underpasses.',
          instructionTelugu: 'తక్షణమే పై అంతస్తుకు లేదా డాబాపైకి వెళ్ళండి. నేలమాళిగలు మరియు భూగర్భ ప్రాంతాలను నివారించండి.',
        },
        {
          step: 2,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Switch off main electrical breaker and gas cylinders if accessible safely without stepping into water.',
          instructionTelugu: 'నీటిలో అడుగుపెట్టకుండా సురక్షితంగా ఉంటే మెయిన్ స్విచ్ మరియు గ్యాస్ సిలిండర్లను ఆపివేయండి.',
        },
        {
          step: 3,
          category: 'citizen',
          priority: 'high',
          instruction: 'Do not attempt to walk, swim, or drive through flowing water. Even 6 inches of rapid water can sweep adults.',
          instructionTelugu: 'ప్రవహించే నీటిలో నడవడానికి, ఈదడానికి లేదా వాహనం నడపడానికి ప్రయత్నించవద్దు.',
        },
        {
          step: 4,
          category: 'responder',
          priority: 'immediate',
          instruction: 'Deploy inflatable rescue boats with life jackets. Prioritize elderly individuals, infants, and pregnant occupants.',
          instructionTelugu: 'లైఫ్ జాకెట్లతో రబ్బరు రెస్క్యూ బోట్లను పంపండి. వృద్ధులు మరియు పిల్లలకు మొదటి ప్రాధాన్యత ఇవ్వండి.',
        },
        {
          step: 5,
          category: 'citizen',
          priority: 'advisory',
          instruction: 'Signal location using a bright cloth, white sheet, or phone torch from terrace toward search teams.',
          instructionTelugu: 'డాబా పైనుండి రెస్క్యూ బృందాలకు కనిపించేలా తెల్లటి గుడ్డ లేదా మొబైల్ టార్చ్ తో సంకేతం ఇవ్వండి.',
        },
      ];

    case 'fire':
      return [
        {
          step: 1,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Evacuate the premises immediately. Do not stop to retrieve valuables or use elevators.',
          instructionTelugu: 'భవనం నుండి తక్షణమే బయటకు రండి. విలువైన వస్తువుల కోసం ఆగవద్దు, లిఫ్ట్ ఉపయోగించవద్దు.',
        },
        {
          step: 2,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Stay low beneath the rising smoke layer. Cover nose and mouth with a damp cloth if available.',
          instructionTelugu: 'పొగ ఎక్కువగా ఉంటే నేలపై వంగి నడవండి. తడి గుడ్డను ముక్కు మరియు నోటికి అడ్డుగా ఉంచండి.',
        },
        {
          step: 3,
          category: 'citizen',
          priority: 'high',
          instruction: 'Check doors with the back of your hand before turning handles. If door is hot, do not open it.',
          instructionTelugu: 'తలుపులు తెరిచే ముందు చేతి వెనుక భాగంతో తాకి చూడండి. వేడిగా ఉంటే తలుపు తెరవకండి.',
        },
        {
          step: 4,
          category: 'responder',
          priority: 'immediate',
          instruction: 'Connect fire hydrant lines, isolate industrial gas pipelines, and establish a 100m safety perimeter.',
          instructionTelugu: 'ఫైర్ ఇంజిన్ లైన్లు ఏర్పాటు చేయండి, గ్యాస్ పైప్‌లైన్లను ఆపివేయండి, 100 మీటర్ల భద్రతా సరిహద్దును ఏర్పరచండి.',
        },
        {
          step: 5,
          category: 'citizen',
          priority: 'advisory',
          instruction: 'Assemble at designated open assembly point and conduct headcounts of all family or shift members.',
          instructionTelugu: 'బహిరంగ ప్రదేశంలో సమావేశమై కుటుంబ సభ్యులు లేదా సహోద్యోగుల సంఖ్యను సరిచూసుకోండి.',
        },
      ];

    case 'medical':
      return [
        {
          step: 1,
          category: 'medical',
          priority: 'immediate',
          instruction: 'Verify responsiveness and breathing. If unconscious and not breathing normally, begin Hands-Only CPR at 100-120 bpm.',
          instructionTelugu: 'రోగి స్పృహ మరియు శ్వాసను తనిఖీ చేయండి. శ్వాస లేకపోతే తక్షణమే సిపిఆర్ (CPR) ప్రారంభించండి.',
        },
        {
          step: 2,
          category: 'medical',
          priority: 'immediate',
          instruction: 'If bleeding heavily, apply firm, continuous direct pressure with a clean cloth or sterile dressing.',
          instructionTelugu: 'రక్తస్రావం జరుగుతుంటే శుభ్రమైన గుడ్డతో గట్టిగా నొక్కి పట్టుకోండి.',
        },
        {
          step: 3,
          category: 'citizen',
          priority: 'high',
          instruction: 'Do NOT move trauma or collision victims unless there is immediate danger of fire, explosion, or collapse.',
          instructionTelugu: 'అగ్ని లేదా పేలుడు ప్రమాదం లేకపోతే క్షతగాత్రులను కదల్చకండి (వెన్నుపాము గాయాలు కావచ్చు).',
        },
        {
          step: 4,
          category: 'responder',
          priority: 'immediate',
          instruction: 'Dispatch ALS (Advanced Life Support) ambulance with trauma physician. Clear street access for fast egress.',
          instructionTelugu: 'అధునాతన లైఫ్ సపోర్ట్ అంబులెన్స్‌ను పంపండి. వాహనం రావడానికి వీధి మార్గాన్ని క్లియర్ చేయండి.',
        },
      ];

    case 'accident':
      return [
        {
          step: 1,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Turn on hazard warning flashers and place warning triangles/markers 50m behind collision to prevent pileup.',
          instructionTelugu: 'హజార్డ్ లైట్లు ఆన్ చేయండి, ఇతర వాహనాలు ఢీకొనకుండా 50 మీటర్ల వెనుక హెచ్చరిక బోర్డు పెట్టండి.',
        },
        {
          step: 2,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Turn off vehicle ignitions to prevent electrical sparks from igniting spilled fuel.',
          instructionTelugu: 'ఇంధనం లీక్ అయితే మంటలు రాకుండా వాహనాల ఇంజిన్లను ఆపివేయండి.',
        },
        {
          step: 3,
          category: 'responder',
          priority: 'immediate',
          instruction: 'Deploy hydraulic cutters for vehicle extrication and maintain cervical spine immobilization for casualties.',
          instructionTelugu: 'వాహనంలో ఇరుక్కున్న వారిని బయటకు తీయడానికి హైడ్రాలిక్ కట్టర్లను ఉపయోగించండి.',
        },
        {
          step: 4,
          category: 'citizen',
          priority: 'high',
          instruction: 'Call 112 with exact landmark and number of injured passengers. Do not crowd the casualty area.',
          instructionTelugu: 'ఖచ్చితమైన మైలురాయి మరియు క్షతగాత్రుల సంఖ్యతో 112 కు కాల్ చేయండి. గుమిగూడవద్దు.',
        },
      ];

    case 'evacuation':
    default:
      return [
        {
          step: 1,
          category: 'citizen',
          priority: 'immediate',
          instruction: 'Follow emergency evacuation route signs. Take stairs only; never enter elevators.',
          instructionTelugu: 'అత్యవసర నిష్క్రమణ గుర్తులను అనుసరించండి. మెట్లు మాత్రమే ఉపయోగించండి, లిఫ్ట్ వద్దకు వెళ్లవద్దు.',
        },
        {
          step: 2,
          category: 'citizen',
          priority: 'high',
          instruction: 'Keep emergency grab-bag ready with drinking water, identification documents, and essential medications.',
          instructionTelugu: 'త్రాగునీరు, గుర్తింపు కార్డులు, అవసరమైన మందులతో కూడిన బ్యాగ్‌ను వెంట ఉంచుకోండి.',
        },
        {
          step: 3,
          category: 'responder',
          priority: 'immediate',
          instruction: 'Establish triage cordon, organize shuttle buses to nearest designated relief shelter, and register evacuees.',
          instructionTelugu: 'పునరావాస కేంద్రాలకు రవాణా బస్సులను ఏర్పాటు చేయండి మరియు బాధితుల పేర్లను నమోదు చేయండి.',
        },
        {
          step: 4,
          category: 'citizen',
          priority: 'advisory',
          instruction: 'Do not spread unverified rumors. Rely only on official District Collectorate / SDMA broadcasts.',
          instructionTelugu: 'నిరూపించబడని పుకార్లను నమ్మవద్దు మరియు వ్యాప్తి చేయవద్దు. అధికారిక సమాచారం మాత్రమే పాటించండి.',
        },
      ];
  }
}
