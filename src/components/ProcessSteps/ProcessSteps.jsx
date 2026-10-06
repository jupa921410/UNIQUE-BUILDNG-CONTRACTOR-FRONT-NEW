import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  FileSignature, 
  PenTool, 
  Truck, 
  Eye, 
  Home, 
  CheckSquare, 
  Smile,
  ClipboardCheck,
  Search,
  MessageSquare,
  Award
} from 'lucide-react';
import './ProcessSteps.css';

const processContent = {
  default: [
    {
      phase: "Phase 1: Planning",
      steps: [
        {
          icon: <Calendar size={28} />,
          title: "Step 1",
          text: "Schedule a complimentary in-home consultation and pricing break down."
        },
        {
          icon: <Users size={28} />,
          title: "Step 2",
          text: "Meet with one of our design and renovation experts for a complimentary in-home consultation and estimate."
        },
        {
          icon: <FileSignature size={28} />,
          title: "Step 3",
          text: "Sign renovation agreement. Apply and get approved for financing. (Financing optional)"
        }
      ]
    },
    {
      phase: "Phase 2: Design & Logistics",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Step 4",
          text: "Meet with one of our design professionals to make your dream a reality."
        },
        {
          icon: <Truck size={28} />,
          title: "Step 5",
          text: "Available materials and selections will be delivered."
        },
        {
          icon: <Eye size={28} />,
          title: "Step 6",
          text: "Meet with your design and production team for a pre-renovation walkthrough to review all aspects of the project and do an on-site materials inspection."
        }
      ]
    },
    {
      phase: "Phase 3: Execution & Delivery",
      steps: [
        {
          icon: <Home size={28} />,
          title: "Step 7",
          text: "Our team executes a quality home renovation project. The client receives consistent communication throughout the project."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Step 8",
          text: "Final punch list is completed, and the job is closed out."
        },
        {
          icon: <Smile size={28} />,
          title: "Step 9",
          text: "Clients love the renovation and enjoy their beautifully remodeled home."
        }
      ]
    }
  ],
  'remodeling': [
    {
      phase: "Phase 1: Discovery",
      steps: [
        {
          icon: <Search size={28} />,
          title: "Consultation",
          text: "Book your free on-site assessment and receive a detailed project investment breakdown."
        },
        {
          icon: <Users size={28} />,
          title: "Expert Meeting",
          text: "Connect with our renovation specialists to discuss your vision and get an accurate project quote."
        },
        {
          icon: <ClipboardCheck size={28} />,
          title: "Agreement",
          text: "Secure your project with a signed contract and explore our flexible financing options."
        }
      ]
    },
    {
      phase: "Phase 2: Selection",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Design Session",
          text: "Collaborate with our design experts to finalize every aesthetic detail of your future space."
        },
        {
          icon: <Truck size={28} />,
          title: "Material Delivery",
          text: "All premium materials and hand-picked selections are shipped directly to your location."
        },
        {
          icon: <Eye size={28} />,
          title: "Site Walkthrough",
          text: "Conduct a pre-build walkthrough with your team to verify materials and construction logistics."
        }
      ]
    },
    {
      phase: "Phase 3: Transformation",
      steps: [
        {
          icon: <Award size={28} />,
          title: "Build Phase",
          text: "Construction begins with precision. Stay informed with regular updates and dedicated support."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Quality Check",
          text: "We perform a comprehensive final inspection to ensure every detail meets our high standards."
        },
        {
          icon: <Smile size={28} />,
          title: "Completion",
          text: "Step into your transformed environment and start enjoying the home of your dreams."
        }
      ]
    }
  ],
  'new-construction': [
    {
      phase: "Phase 1: Foundation",
      steps: [
        {
          icon: <Calendar size={28} />,
          title: "Site Visit",
          text: "Arrange an exclusive site discovery session and total construction budget analysis."
        },
        {
          icon: <Users size={28} />,
          title: "Strategy",
          text: "Engage with our lead architects and engineers for a personalized project evaluation."
        },
        {
          icon: <FileSignature size={28} />,
          title: "Commitment",
          text: "Formalize the construction partnership with a signed agreement and financial approval."
        }
      ]
    },
    {
      phase: "Phase 2: Development",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Creative Phase",
          text: "Embark on a design journey to curate the perfect architectural style for your new build."
        },
        {
          icon: <Truck size={28} />,
          title: "Logistics",
          text: "Sourced building materials and curated finishes arrive safely at your new property."
        },
        {
          icon: <Eye size={28} />,
          title: "Alignment",
          text: "Join our production team for a detailed site inspection and project alignment meeting."
        }
      ]
    },
    {
      phase: "Phase 3: Realization",
      steps: [
        {
          icon: <Home size={28} />,
          title: "Execution",
          text: "Our master craftsmen bring your vision to life with unparalleled attention to structural quality."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Final Review",
          text: "We conclude the build with a meticulous walkthrough and final project sign-off."
        },
        {
          icon: <Smile size={28} />,
          title: "Turnover",
          text: "Experience the ultimate in custom living within your newly constructed residence."
        }
      ]
    }
  ],
  'kitchens-bathrooms': [
    {
      phase: "Phase 1: Concepts",
      steps: [
        {
          icon: <MessageSquare size={28} />,
          title: "First Step",
          text: "Request a free in-home consultation to discuss your kitchen or bathroom layout and pricing."
        },
        {
          icon: <Users size={28} />,
          title: "Consult",
          text: "Sit down with our interior designers to review material options and get a detailed estimate."
        },
        {
          icon: <FileSignature size={28} />,
          title: "Launch",
          text: "Finalize the renovation agreement and secure financing if needed for your upgrade."
        }
      ]
    },
    {
      phase: "Phase 2: Elements",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Detailing",
          text: "Work closely with our design professionals to select fixtures, tiles, and finishes."
        },
        {
          icon: <Truck size={28} />,
          title: "Sourcing",
          text: "Your chosen cabinets, countertops, and materials are delivered to the job site."
        },
        {
          icon: <Eye size={28} />,
          title: "Inspection",
          text: "Meet with the production team for a final check of all materials before installation begins."
        }
      ]
    },
    {
      phase: "Phase 3: Craft",
      steps: [
        {
          icon: <Award size={28} />,
          title: "Installation",
          text: "Our team executes a high-quality renovation with constant communication at every stage."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Punch List",
          text: "The final touches are completed, ensuring everything is polished and functional."
        },
        {
          icon: <Smile size={28} />,
          title: "Reveal",
          text: "Fall in love with your beautifully remodeled and modernized living space."
        }
      ]
    }
  ],
  'additions': [
    {
      phase: "Phase 1: Expansion Planning",
      steps: [
        {
          icon: <Calendar size={28} />,
          title: "Initial Talk",
          text: "Schedule a free consultation to evaluate your property's potential for expansion and get a pricing overview."
        },
        {
          icon: <Users size={28} />,
          title: "Expert Review",
          text: "Meet with our structural experts to discuss how to seamlessly integrate your new addition with your existing home."
        },
        {
          icon: <FileSignature size={28} />,
          title: "Finalizing",
          text: "Sign the expansion agreement and get quick approval for financing to start your home's growth."
        }
      ]
    },
    {
      phase: "Phase 2: Architectural Details",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Design",
          text: "Work with our design professionals to ensure your addition matches your home's unique architectural style."
        },
        {
          icon: <Truck size={28} />,
          title: "Arrival",
          text: "All necessary building materials and custom selections are delivered to your property for the build."
        },
        {
          icon: <Eye size={28} />,
          title: "Site Check",
          text: "Perform a pre-construction walkthrough with the team to review structural plans and material quality."
        }
      ]
    },
    {
      phase: "Phase 3: Building & Delivery",
      steps: [
        {
          icon: <Home size={28} />,
          title: "Construction",
          text: "Our team expertly builds your new space while keeping you updated with constant, clear communication."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Review",
          text: "A final punch list is carefully completed to ensure every detail of your addition is perfect."
        },
        {
          icon: <Smile size={28} />,
          title: "Celebration",
          text: "Enjoy your expanded living area and the added value and comfort of your beautifully remodeled home."
        }
      ]
    }
  ],
  'flooring': [
    {
      phase: "Phase 1: Surface Discovery",
      steps: [
        {
          icon: <Search size={28} />,
          title: "Assessment",
          text: "Book a complimentary in-home consultation to measure your spaces and discuss premium flooring options."
        },
        {
          icon: <Users size={28} />,
          title: "Expert Advice",
          text: "Meet with our flooring specialists to choose the best materials and get a comprehensive installation estimate."
        },
        {
          icon: <ClipboardCheck size={28} />,
          title: "Approval",
          text: "Secure your flooring project with a signed agreement and explore our flexible financing plans."
        }
      ]
    },
    {
      phase: "Phase 2: Material Prep",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Selection",
          text: "Finalize your material choices with our design pros to ensure a perfect match for your home's interior."
        },
        {
          icon: <Truck size={28} />,
          title: "Logistics",
          text: "Your premium flooring materials and necessary supplies are delivered directly to your home."
        },
        {
          icon: <Eye size={28} />,
          title: "Inspection",
          text: "Meet with the installation team for a pre-job walkthrough to inspect materials and prep the site."
        }
      ]
    },
    {
      phase: "Phase 3: Precision Install",
      steps: [
        {
          icon: <Award size={28} />,
          title: "Installation",
          text: "Our expert installers lay your new floors with precision, providing regular progress updates."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Final Polish",
          text: "We complete a final walkthrough to ensure every plank and tile is perfectly placed and finished."
        },
        {
          icon: <Smile size={28} />,
          title: "New Look",
          text: "Transform the feel of your home and enjoy the lasting beauty of your professional floor renovation."
        }
      ]
    }
  ],
  'projectmanagement': [
    {
      phase: "Phase 1: Project Scoping",
      steps: [
        {
          icon: <Calendar size={28} />,
          title: "Intake",
          text: "Schedule an initial project consultation to outline your management needs and budget requirements."
        },
        {
          icon: <Users size={28} />,
          title: "Coordination",
          text: "Meet with our senior project managers to develop a strategic oversight plan and resource estimate."
        },
        {
          icon: <FileSignature size={28} />,
          title: "Onboarding",
          text: "Formalize the management partnership with a signed agreement and clear project milestones."
        }
      ]
    },
    {
      phase: "Phase 2: Operational Design",
      steps: [
        {
          icon: <PenTool size={28} />,
          title: "Strategy",
          text: "Our professionals design a custom project roadmap to ensure your construction goals become a reality."
        },
        {
          icon: <Truck size={28} />,
          title: "Resources",
          text: "We coordinate the delivery of all critical resources and selections needed for project success."
        },
        {
          icon: <Eye size={28} />,
          title: "Verification",
          text: "Conduct a pre-operational walkthrough with the entire production team to align on all project aspects."
        }
      ]
    },
    {
      phase: "Phase 3: Oversight & Closing",
      steps: [
        {
          icon: <Home size={28} />,
          title: "Management",
          text: "Our team manages every facet of the renovation, ensuring quality and consistent communication."
        },
        {
          icon: <CheckSquare size={28} />,
          title: "Close-out",
          text: "A final management punch list is completed to ensure the job is closed out to the highest standards."
        },
        {
          icon: <Smile size={28} />,
          title: "Success",
          text: "Project completed on time and within budget. Enjoy the peace of mind of a professionally managed home."
        }
      ]
    }
  ]
};

const ProcessSteps = ({ serviceId }) => {
  const phases = processContent[serviceId] || processContent.default;

  return (
    <section className="process-steps-section">
      <div className="container">
        <div className="process-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge">Our Process</span>
            <h2>How We Bring Your Vision To Life</h2>
            <p>A streamlined, transparent three-phase journey from initial concept to your dream home.</p>
          </motion.div>
        </div>

        <div className="phases-container">
          {phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="phase-block">
              <motion.div 
                className="phase-title-wrapper"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: phaseIndex * 0.1 }}
              >
                <span className="phase-number">{phase.phase}</span>
                <div className="phase-line"></div>
              </motion.div>

              <div className="steps-grid">
                {phase.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    className="step-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (phaseIndex * 3 + stepIndex) * 0.1 
                    }}
                  >
                    <div className="step-icon-wrapper">
                      {step.icon}
                    </div>
                    <span className="step-number">{step.title}</span>
                    <h4>{step.title.includes('Step') ? phase.phase.split(':')[0] + ' - ' + step.title : step.title}</h4>
                    <p>{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
