import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, X, ArrowRight } from 'lucide-react';
import chadImg from '../../assets/team/chad.jpg';
import julioImg from '../../assets/team/julio.jpg';
import reinayImg from '../../assets/team/rey.jpg';
import jimmiImg from '../../assets/team/jim.jpg';
import './OurTeams.css';

const teamMembers = [
  {
    id: 1,
    name: 'Chad Nead',
    role: 'Founder',
    image: chadImg,
    bio: 'Unique Building Contractors represents the next chapter of two established legacies in the building industry. Chad Nead brings over 20 years of hands-on experience as a trusted remodeling specialist. His expertise centers on complete kitchen and bathroom transformations, along with a broad range of additional commercial and residential construction and renovation projects. Chad’s reputation is built on meticulous craftsmanship, creative problem-solving, strict attention to timelines and budgets, and a commitment to results that consistently exceed client expectations.',
    highlights: ['20+ Years Experience', 'Kitchen & Bath Specialist', 'Residential & Commercial Mastery']
  },
  {
    id: 2,
    name: 'Julio Reyes',
    role: 'Founder',
    image: julioImg,
    bio: 'As a co-founder of Unique Building Contractors, Julio Reyes brings more than 15 years of proven expertise in high-end flooring installations and custom bathroom craftsmanship. He leads vendor relationships, material selection, and finish coordination to ensure every interior space delivers luxury, durability, and the perfect balance of style and performance.',
    highlights: ['Flooring Expert', 'Luxury Finishes', 'Corporate Project Lead']
  },
  {
    id: 3,
    name: 'Reinay Rosete',
    role: 'Founder',
    image: reinayImg,
    bio: 'As a co-founder and operations leader, Reinay Rosete ensures every Unique Building Contractors project is managed with efficiency, professionalism, and clear communication. She specializes in coastal construction challenges, including humidity control, flood-zone compliance, and wind-resistant practices while keeping clients informed and expectations aligned at every stage.',
    highlights: ['Coastal Construction', 'Project Management', 'Client Relations']
  },
  {
    id: 4,
    name: 'James d Turner',
    role: 'Project Management and Consulting',
    image: jimmiImg,
    bio: 'James D. Turner is the field supervisor who keeps each build running smoothly from pre-construction through final inspection. His focus on subcontractor coordination, safety compliance, schedule adherence, and quality control ensures projects stay on time, on budget, and finished to the company’s high standards.',
    highlights: ['Field Supervision', 'Quality Control', 'Safety & Scheduling']
  }
];

export default function OurTeams() {
  const [selectedMember, setSelectedMember] = useState(null);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedMember]);

  return (
    <section className="our-teams section" id="ourteams">
      <div className="container">
        <div className="section-header text-center">
          <div className="section-badge">Our Leadership</div>
          <h2 className="section-title">
            The Experts Behind <span>Your Vision</span>
          </h2>
          <p className="section-subtitle" style={{margin: '16px auto 0'}}>
            Meet the dedicated professionals leading Tampa Bay's premier construction firm.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <motion.div 
              key={member.id}
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelectedMember(member)}
            >
              <div className="team-image-container">
                <img src={member.image} alt={member.name} className="team-image" />
                <div className="team-view-overlay">
                  <span className="view-text">View Profile</span>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-divider"></div>
                <p className="team-bio-short">{member.bio.substring(0, 100)}...</p>
                <button className="read-more-btn">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
            <motion.div 
              className="modal-content glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedMember(null)}>
                <X size={24} />
              </button>

              <div className="modal-body">
                <div className="modal-image-side">
                  <div className="modal-img-wrap">
                    <img src={selectedMember.image} alt={selectedMember.name} />
                  </div>
                  <div className="modal-socials">
                    <a href="#" className="modal-social-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="#" className="modal-social-btn"><Mail size={20} /></a>
                    <a href="tel:8135237828" className="modal-social-btn"><Phone size={20} /></a>
                  </div>
                </div>

                <div className="modal-info-side">
                  <div className="section-badge">{selectedMember.role}</div>
                  <h3 className="modal-name">{selectedMember.name}</h3>
                  <div className="modal-divider"></div>
                  
                  <div className="modal-bio">
                    {selectedMember.bio}
                  </div>

                  <div className="modal-highlights">
                    {selectedMember.highlights.map((h, i) => (
                      <div key={i} className="modal-highlight-item">
                        <div className="dot"></div>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-primary modal-cta" onClick={() => setSelectedMember(null)}>
                    Contact {selectedMember.name.split(' ')[0]}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
