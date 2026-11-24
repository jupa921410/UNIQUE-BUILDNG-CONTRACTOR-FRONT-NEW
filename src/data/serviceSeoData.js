import { PHASE1_CITIES } from './serviceAreasData.js';

export const confirmedServiceAreas = PHASE1_CITIES.map(({ city }) => city);

export const serviceSeoData = {
  'condo-renovations': {
    intro: 'Condo renovations require a clear scope for the unit and coordination with the wider building. We plan finishes, access, protection and trade work together.',
    faqs: [
      { question: 'Do you coordinate condo building requirements?', answer: 'We review association requirements, construction hours, delivery access and shared-space protection during planning.' },
      { question: 'Can you remodel a condo kitchen and bathroom?', answer: 'Yes. The scope is tailored to the existing layout, building systems, chosen finishes and applicable approvals.' },
    ],
  },
  'new-construction': {
    intro: 'Unique Building Contractors provides coordinated new-home construction across Tampa Bay, from early planning and permitting through inspections and final finishes.',
    faqs: [
      { question: 'What is included in new home construction?', answer: 'The scope can include site planning, foundation, framing, building systems, interior and exterior finishes, inspections, and overall construction coordination.' },
      { question: 'Who coordinates permits and inspections for new construction?', answer: 'New construction requires a full building permit through the applicable local authority, covering foundation, framing, electrical, plumbing, mechanical, and final inspections. Unique Building Contractors manages all permit applications and schedules every required inspection milestone as the licensed contractor of record (CBC1268844).' },
      { question: 'Can you work with an architect or designer?', answer: 'Yes. The construction team can coordinate with the project architect, engineers, and designers so approved plans and field work remain aligned throughout the build.' },
      { question: 'What areas in Tampa Bay do you serve for new construction?', answer: 'Unique Building Contractors serves the full Tampa Bay region for new construction, including Hillsborough, Pinellas, Pasco, and Sarasota counties. We manage permitting directly with the applicable local authority for each project location.' },
    ],
  },
  remodeling: {
    intro: 'Our remodeling work ranges from targeted interior improvements to whole-home renovations and structural layout changes, with each scope evaluated for the existing home.',
    faqs: [
      { question: 'How long does a home remodel take?', answer: 'Timing varies with design decisions, project size, material availability, permit review, and existing conditions. A project-specific schedule is prepared after the scope is defined.' },
      { question: 'Can you change an existing floor plan?', answer: 'Yes, when the existing structure and approved plans allow it. Structural changes — such as removing load-bearing walls — require engineering evaluation, appropriate structural solutions, and permits through the applicable local authority.' },
      { question: 'Do remodeling projects in Tampa Bay require permits?', answer: 'Whole-home and structural remodeling projects in Florida typically require building permits for any work involving structural changes, electrical, plumbing, or HVAC modifications. Unique Building Contractors manages the permit application and all required inspections through the applicable local authority — Hillsborough County, Pinellas County, Pasco County, or Sarasota County depending on project location.' },
      { question: 'Can you work in a home while the family is still living there?', answer: 'Yes. Most of our remodeling projects take place in occupied homes. We develop phasing plans, install dust containment barriers, and schedule high-impact work around your household routine to keep disruption to a minimum.' },
    ],
  },
  additions: {
    intro: 'Home additions in Tampa, Clearwater and across Tampa Bay are planned to connect new living space with the home\'s existing structure, systems, roofline, and architectural character — with zoning, flood-zone and permit requirements reviewed before design is final.',
    related: [
      { to: '/services/adu-in-law-suites', label: 'ADUs, in-law suites & extended family residences' },
      { to: '/service-areas/tampa-fl', label: 'Home additions in Tampa' },
      { to: '/service-areas/clearwater-fl', label: 'Home additions in Clearwater' },
    ],
    faqs: [
      { question: 'Do you build home additions in Tampa and Clearwater?', answer: 'Yes. Unique Building Contractors builds room additions, primary-suite additions, in-law suites and garage conversions in Tampa, Clearwater and surrounding Tampa Bay communities in Hillsborough, Pinellas and Pasco counties. Our office is located at 4500 140th Ave N #214, Clearwater, FL 33762.' },
      { question: 'Can a home addition include an in-law suite?', answer: 'Yes. An attached addition can be designed as a private suite with a bedroom, bathroom and living area, and in some cases a separate entrance or kitchenette, subject to local zoning rules. See our ADU and in-law suite page for detached units and extended family residences.' },
      { question: 'What types of home additions do you build?', answer: 'Projects may include bedroom or primary-suite additions, expanded living areas, enclosed patios or sunrooms, garage conversions, and in-law or guest suites, subject to the property layout and approved scope.' },
      { question: 'Will an addition match the existing home?', answer: 'Matching the existing roofline, exterior materials, interior transitions, and architectural details is a core part of our planning and construction process. We evaluate compatibility before finalizing the design.' },
      { question: 'Do home additions in Florida require permits?', answer: 'Home additions require building permits through the local authority having jurisdiction, covering structural, electrical, plumbing, and HVAC work. Unique Building Contractors prepares and submits all permit applications, coordinates with the applicable county or city building department, and manages every milestone inspection through project closeout as the contractor of record.' },
      { question: 'How do you handle the structural tie-in between new and existing space?', answer: 'Structural integration — including roofline tie-ins, foundation connections, and load calculations — is evaluated before construction begins. We coordinate with licensed structural engineers when required and manage all related permit documentation.' },
    ],
  },
  'adu-in-law-suites': {
    intro: 'ADUs, in-law suites and extended family residences give Tampa Bay families private living space on the same property. Each project starts with a property-specific review of zoning, setbacks, utilities and permits.',
    related: [
      { to: '/services/additions', label: 'Home additions in Tampa & Clearwater' },
      { to: '/service-areas/tampa-fl', label: 'Contractor in Tampa' },
      { to: '/service-areas/clearwater-fl', label: 'Contractor in Clearwater' },
    ],
    faqs: [
      { question: 'What is the difference between an ADU, an in-law suite and an extended family residence?', answer: 'An in-law suite is usually an attached part of the main home with its own bedroom, bathroom and living area. An accessory dwelling unit (ADU) is a separate, self-contained living unit — attached or detached — on the same lot. "Extended family residence" is a term some local land development codes use for living space intended for family members. Which option is allowed, and how it is defined, depends on your jurisdiction and zoning.' },
      { question: 'Can I build an ADU or in-law suite on my property in Tampa Bay?', answer: 'It depends on the property. Zoning district, lot size, setbacks, lot coverage, flood zone, utilities and HOA or deed restrictions all affect what can be built. We review these items for your address and confirm requirements with the applicable county or city before design is finalized.' },
      { question: 'Should the unit be attached or detached?', answer: 'Attached in-law suites can share the home\'s structure and systems and may be simpler where the lot is tight. Detached ADUs offer more privacy but need their own foundation, utility connections and setbacks. We compare both options for your lot, budget priorities and household needs during planning.' },
      { question: 'Do ADUs and in-law suites require permits?', answer: 'Yes. New living space requires building permits covering structural, electrical, plumbing and mechanical work, and some jurisdictions require additional zoning or land-use approval. Unique Building Contractors prepares and submits permit applications and manages every required inspection as the licensed contractor of record (CBC1268844).' },
      { question: 'How much does an ADU or in-law suite cost?', answer: 'Cost depends on size, attached versus detached construction, site work, utility connections, finishes and permit requirements. We provide a project-specific estimate after reviewing the property and defining the scope — call (813) 523-7828 to schedule a free estimate.' },
      { question: 'Can a garage be converted into an in-law suite?', answer: 'Often, yes. A garage conversion can create a bedroom, bathroom and living area, but it requires review of parking requirements, floor elevation, insulation, windows and egress, and the needed permits. We evaluate whether your garage is a good candidate before design begins.' },
    ],
  },
  'kitchens-bathrooms': {
    intro: 'Kitchen and bathroom remodeling can combine layout improvements, durable finishes, cabinetry, countertops, tile, fixtures, and coordinated building systems.',
    faqs: [
      { question: 'How much does kitchen or bathroom remodeling cost?', answer: 'Cost depends on room size, layout changes, material selections, building-system work, and existing conditions. An accurate estimate requires a defined scope and site evaluation.' },
      { question: 'How long does a kitchen or bathroom remodel take?', answer: 'The schedule depends on scope, permits, material lead times, inspections, and unforeseen existing conditions. A project-specific timeline is established during planning.' },
      { question: 'Do kitchen and bathroom remodels require permits in Tampa Bay?', answer: 'Kitchen and bathroom remodeling projects that involve plumbing relocation, electrical work, or structural changes require permits from the applicable local authority. Cosmetic-only updates — such as cabinet refacing or painting — typically do not. Unique Building Contractors evaluates permit requirements during the planning phase and manages all applicable permits and inspections as the contractor of record.' },
      { question: 'Do you install cabinets and countertops?', answer: 'Yes. The listed kitchen services include custom cabinetry design and installation, and granite, quartz, and dolomite countertop installation coordinated with backsplash and fixture selections.' },
      { question: 'Do you install walk-in or glass showers?', answer: 'Yes. The bathroom remodeling scope can include frameless glass-enclosed showers, custom tile work, curbless entry designs, vanities, and fixtures based on the approved design.' },
      { question: 'Can you change the kitchen or bathroom layout?', answer: 'Yes, when site conditions and the approved structural, plumbing, and electrical scope support the change. Layout modifications are evaluated during the planning phase before construction begins.' },
    ],
  },
  flooring: {
    intro: 'Flooring installation includes careful material selection, subfloor preparation, precise installation, and transitions suited to the home and room conditions.',
    faqs: [
      { question: 'What flooring options are available?', answer: 'Available services include solid and engineered hardwood, porcelain and ceramic tile, luxury vinyl plank (LVP), laminate, and natural stone such as travertine and marble — selected based on room use, subfloor condition, and design goals.' },
      { question: 'Do you remove existing flooring?', answer: 'Removal and disposal can be included in the project scope. The existing flooring type and subfloor condition are evaluated first to determine the appropriate removal method and confirm the subfloor is ready for the new installation.' },
      { question: 'How long does flooring installation take?', answer: 'Timing depends on area, material, pattern complexity, subfloor preparation needs, removal requirements, and transitions between rooms. The schedule is confirmed for each specific installation.' },
      { question: 'Do flooring projects require permits?', answer: 'Standard flooring installation typically does not require a building permit unless the scope includes structural subfloor modifications. Unique Building Contractors evaluates permit requirements based on the specific installation and existing subfloor conditions before work begins.' },
      { question: 'Can you install flooring throughout a home?', answer: 'Yes. Whole-home flooring installation can be planned with coordinated transitions, trim, room use, and material suitability all considered together for a cohesive result.' },
    ],
  },
  projectmanagement: {
    intro: 'Construction management provides coordinated scheduling, cost control, quality review, risk management, and communication from planning through delivery.',
    faqs: [
      { question: 'What does construction management include?', answer: 'Services can include scheduling, budget planning, resource and trade coordination, quality assurance, risk management, subcontractor oversight, and stakeholder reporting tailored to the project type and scope.' },
      { question: 'How are project updates communicated?', answer: 'The management process includes regular progress updates and reporting tied to project milestones, active issues, and schedule status — with a single point of contact responsible for communicating with the owner throughout.' },
      { question: 'Can you manage multiple trades?', answer: 'Yes. Trade coordination — scheduling, sequencing, and quality oversight of multiple subcontractors — is a core part of the construction management service.' },
      { question: 'Does construction management include permit coordination?', answer: 'When Unique Building Contractors serves as the licensed contractor of record (CBC1268844), permit filing and inspection coordination with the applicable local authority are included as part of the management scope. Specific responsibilities are confirmed during project planning based on the project type and jurisdiction.' },
    ],
  },
};
