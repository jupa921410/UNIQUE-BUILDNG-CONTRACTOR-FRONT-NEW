import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Bath, Building2, CheckCircle2, ChefHat, CircleAlert,
  CircleHelp, Hammer, House, Layers, Lock, Phone, ShieldCheck, Sofa, SquarePlus,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import { API_ENDPOINTS } from '../../config/api';
import { trackFormConversion } from '../../config/conversions';
import {
  BEST_TIMES, BUDGETS, CONTACT_METHODS, DECISION, OWNERSHIP, PROJECT_TYPES,
  PROPERTY_TYPES, REFERRAL_SOURCES, TIMELINES,
} from './options';
import './QualifyPage.css';

const PROJECT_ICONS = {
  new_construction: Building2,
  remodeling: Hammer,
  home_addition: SquarePlus,
  kitchen: ChefHat,
  bathroom: Bath,
  flooring: Layers,
  condo_renovation: Sofa,
  other: CircleHelp,
};

const STEPS = [
  { key: 'project', label: 'Your project', title: 'What are you planning?', hint: 'Pick the option that fits best.' },
  { key: 'timing', label: 'Timing & budget', title: 'When and how much?', hint: 'A rough idea is fine. It helps us recommend the right approach.' },
  { key: 'property', label: 'The property', title: 'Tell us about the property', hint: 'So we know who we will be working with and where.' },
  { key: 'contact', label: 'Contact', title: 'How can we reach you?', hint: 'We reply within 24 hours, by the method you prefer.' },
];

const REQUIRED = {
  project: ['project_type'],
  timing: ['timeline', 'budget_range'],
  property: ['property_owner', 'decision_maker'],
  contact: ['name'],
};

const EMPTY = {
  project_type: '', property_type: '', project_details: '',
  timeline: '', budget_range: '',
  property_owner: '', decision_maker: '', city: '', zip_code: '',
  name: '', email: '', phone: '', preferred_contact: '', best_time: '', referral_source: '',
};

function ChoiceGroup({ name, legend, options, value, onChange, columns = 2, icons, error }) {
  return (
    <fieldset className={`qf-group ${error ? 'has-error' : ''}`}>
      <legend className="qf-legend">{legend}</legend>
      <div className={`qf-choices cols-${columns}`} role="radiogroup">
        {options.map((option) => {
          const Icon = icons?.[option.value];
          const selected = value === option.value;
          return (
            <label key={option.value} className={`qf-choice ${selected ? 'is-selected' : ''} ${Icon ? 'has-icon' : ''}`}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {Icon && <Icon size={22} strokeWidth={1.6} className="qf-choice-icon" aria-hidden="true" />}
              <span>{option.label}</span>
              <span className="qf-choice-check" aria-hidden="true"><CheckCircle2 size={16} /></span>
            </label>
          );
        })}
      </div>
      {error && <p className="qf-error">{error}</p>}
    </fieldset>
  );
}

function Field({ id, label, children, error }) {
  return (
    <div className={`qf-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="qf-error">{error}</p>}
    </div>
  );
}

export default function QualifyPage() {
  const [params] = useSearchParams();
  const ref = params.get('ref') || '';
  const [form, setForm] = useState(EMPTY);
  const [smsConsent, setSmsConsent] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [greeting, setGreeting] = useState('');
  const cardRef = useRef(null);

  const utm = useMemo(() => ({
    utm_source: params.get('utm_source') || (ref ? 'email' : ''),
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  }), [params, ref]);

  // Personalized link (?ref=TOKEN): pre-fill the contact data we already have.
  useEffect(() => {
    if (!ref) return undefined;
    const controller = new AbortController();
    fetch(API_ENDPOINTS.QUALIFY_PREFILL(ref), { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const data = json?.data;
        if (!data) return;
        setForm((current) => ({
          ...current,
          name: current.name || data.name || '',
          email: current.email || data.email || '',
          phone: current.phone || data.phone || '',
        }));
        if (data.name) setGreeting(data.name.split(' ')[0]);
      })
      .catch(() => { /* Link expired or offline: the form still works without pre-fill. */ });
    return () => controller.abort();
  }, [ref]);

  const set = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const onInput = (event) => set(event.target.name)(event.target.value);

  const validate = (stepKey) => {
    const next = {};
    for (const field of REQUIRED[stepKey]) {
      if (!String(form[field] || '').trim()) next[field] = 'Please choose an option.';
    }
    if (stepKey === 'contact') {
      if (!form.name.trim()) next.name = 'Please enter your name.';
      if (!form.phone.trim() && !form.email.trim()) next.phone = 'Add a phone number or an email so we can reach you.';
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const scrollToCard = () => {
    const top = (cardRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const goNext = () => {
    if (!validate(STEPS[step].key)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollToCard();
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    scrollToCard();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step < STEPS.length - 1) { goNext(); return; }
    if (!validate('contact')) return;

    setStatus('sending');
    try {
      const response = await fetch(API_ENDPOINTS.QUALIFY_FORM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          sms_consent: smsConsent === 'yes',
          ref: ref || undefined,
          website,
          ...utm,
        }),
      });

      if (response.status === 422) {
        const json = await response.json();
        const fieldErrors = Object.fromEntries(Object.entries(json.errors || {}).map(([key, messages]) => [key, messages[0]]));
        setErrors(fieldErrors);
        const firstStep = STEPS.findIndex(({ key }) => REQUIRED[key].some((field) => fieldErrors[field]));
        if (firstStep >= 0 && firstStep !== step) setStep(firstStep);
        setStatus(null);
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      setStatus('sent');
      trackFormConversion();
      scrollToCard();
    } catch (error) {
      console.error('Qualification form submission failed:', error);
      setStatus('error');
    }
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="qualify-page">
      <SEO
        title="Get Started — Tell Us About Your Project"
        description="Answer a few quick questions about your construction or remodeling project so the Unique Building Contractors team can prepare for your consultation."
        path="/get-started"
        noindex
      />

      <section className="qf-section">
        <div className="container qf-layout">
          <aside className="qf-intro">
            <div className="section-badge">Project questionnaire</div>
            <h1 className="qf-title">
              {greeting ? <>Hi {greeting}, let’s plan <span>your project</span>.</> : <>Let’s plan <span>your project</span>.</>}
            </h1>
            <p className="qf-lead">
              Four short steps, about two minutes. Your answers help us come prepared, so your first call is about
              real options for your home and not just paperwork.
            </p>

            <ol className="qf-steps" aria-label="Form steps">
              {STEPS.map((s, index) => (
                <li key={s.key} className={index === step && status !== 'sent' ? 'is-current' : index < step || status === 'sent' ? 'is-done' : ''}>
                  <span className="qf-step-dot">{index < step || status === 'sent' ? <CheckCircle2 size={16} /> : index + 1}</span>
                  {s.label}
                </li>
              ))}
            </ol>

            <ul className="qf-trust">
              <li><ShieldCheck size={18} /> Florida Certified Building Contractor · CBC1268844</li>
              <li><House size={18} /> Serving homeowners across Tampa Bay</li>
              <li><Lock size={18} /> Your information stays private</li>
            </ul>
          </aside>

          <div className="qf-card" ref={cardRef}>
            {status === 'sent' ? (
              <motion.div className="qf-success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <CheckCircle2 size={60} strokeWidth={1.5} className="qf-success-icon" />
                <h2>Thank you{greeting ? `, ${greeting}` : ''}!</h2>
                <p>We received your answers. A member of our team will review them and reach out within <strong>24 hours</strong> to talk about next steps.</p>
                <div className="qf-success-actions">
                  <a href="tel:+18135237828" className="btn btn-primary"><Phone size={18} /> Call (813) 523-7828</a>
                  <Link to="/portfolio" className="btn btn-secondary">See our work <ArrowRight size={18} /></Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="qf-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
                <div className="qf-card-head">
                  <span className="qf-step-count">Step {step + 1} of {STEPS.length}</span>
                  <h2>{current.title}</h2>
                  <p>{current.hint}</p>
                </div>

                {status === 'error' && (
                  <div className="qf-banner" role="alert">
                    <CircleAlert size={20} />
                    <span>Something went wrong. Please try again or call us at <strong>(813) 523-7828</strong>.</span>
                  </div>
                )}

                {/* Honeypot: hidden from people, bots fill it in. */}
                <div className="qf-hp" aria-hidden="true">
                  <label htmlFor="qf-website">Website</label>
                  <input id="qf-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={current.key}
                    className="qf-body"
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -28 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {current.key === 'project' && (
                      <>
                        <ChoiceGroup name="project_type" legend="Type of project *" options={PROJECT_TYPES} value={form.project_type} onChange={set('project_type')} icons={PROJECT_ICONS} columns={4} error={errors.project_type} />
                        <ChoiceGroup name="property_type" legend="Type of property" options={PROPERTY_TYPES} value={form.property_type} onChange={set('property_type')} columns={3} />
                        <Field id="project_details" label="Briefly describe what you have in mind">
                          <textarea id="project_details" name="project_details" rows={4} value={form.project_details} onChange={onInput} placeholder="e.g. Open up the kitchen to the living room, new cabinets and quartz countertops…" />
                        </Field>
                      </>
                    )}

                    {current.key === 'timing' && (
                      <>
                        <ChoiceGroup name="timeline" legend="When would you like to start? *" options={TIMELINES} value={form.timeline} onChange={set('timeline')} error={errors.timeline} />
                        <ChoiceGroup name="budget_range" legend="Estimated budget *" options={BUDGETS} value={form.budget_range} onChange={set('budget_range')} columns={3} error={errors.budget_range} />
                      </>
                    )}

                    {current.key === 'property' && (
                      <>
                        <ChoiceGroup name="property_owner" legend="Do you own the property? *" options={OWNERSHIP} value={form.property_owner} onChange={set('property_owner')} columns={3} error={errors.property_owner} />
                        <ChoiceGroup name="decision_maker" legend="Are you the one making the decision? *" options={DECISION} value={form.decision_maker} onChange={set('decision_maker')} columns={3} error={errors.decision_maker} />
                        <div className="qf-row">
                          <Field id="city" label="City">
                            <input id="city" name="city" value={form.city} onChange={onInput} placeholder="Tampa" autoComplete="address-level2" />
                          </Field>
                          <Field id="zip_code" label="ZIP code" error={errors.zip_code}>
                            <input id="zip_code" name="zip_code" value={form.zip_code} onChange={onInput} placeholder="33602" inputMode="numeric" maxLength={10} autoComplete="postal-code" />
                          </Field>
                        </div>
                      </>
                    )}

                    {current.key === 'contact' && (
                      <>
                        <Field id="name" label="Full name *" error={errors.name}>
                          <input id="name" name="name" value={form.name} onChange={onInput} placeholder="John Smith" autoComplete="name" />
                        </Field>
                        <div className="qf-row">
                          <Field id="phone" label="Phone" error={errors.phone}>
                            <input id="phone" name="phone" type="tel" value={form.phone} onChange={onInput} placeholder="(813) 000-0000" autoComplete="tel" />
                          </Field>
                          <Field id="email" label="Email" error={errors.email}>
                            <input id="email" name="email" type="email" value={form.email} onChange={onInput} placeholder="john@example.com" autoComplete="email" />
                          </Field>
                        </div>
                        <ChoiceGroup name="preferred_contact" legend="Best way to reach you" options={CONTACT_METHODS} value={form.preferred_contact} onChange={set('preferred_contact')} columns={3} />
                        <ChoiceGroup name="best_time" legend="Best time" options={BEST_TIMES} value={form.best_time} onChange={set('best_time')} columns={4} />
                        <Field id="referral_source" label="How did you hear about us?">
                          <select id="referral_source" name="referral_source" value={form.referral_source} onChange={onInput}>
                            <option value="">Select…</option>
                            {REFERRAL_SOURCES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                        </Field>

                        <fieldset className="qf-sms">
                          <legend>Text Message Consent</legend>
                          {[
                            ['yes', 'Yes, I consent to receive customer care messages from Unique Building contractors'],
                            ['no', 'No, I do not want to receive any text messages from Unique Building contractors'],
                          ].map(([value, text]) => (
                            <label key={value} className="qf-check">
                              <input type="checkbox" checked={smsConsent === value} onChange={() => setSmsConsent((prev) => (prev === value ? '' : value))} />
                              <span>{text}</span>
                            </label>
                          ))}
                          <p>
                            Unique building contractors llc (doing business as Unique Building contractors) would like your consent to send
                            customer care text message communications from <a href="tel:+18135237828">(813) 523-7828</a> to your mobile number
                            listed above, in response to your questions or to provide information relevant to your relationship with us.
                            Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply
                            &lsquo;STOP&rsquo; to unsubscribe at any time. Reply &lsquo;HELP&rsquo; for assistance or more information. We do
                            not share your mobile opt-in information with anyone. Our combined Privacy Policy and Messaging Terms and Conditions
                            are available at <Link to="/privacy">uniquebuildingcontractors.com/privacy</Link>.
                          </p>
                        </fieldset>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="qf-nav">
                  {step > 0 ? (
                    <button type="button" className="btn btn-secondary" onClick={goBack}><ArrowLeft size={18} /> Back</button>
                  ) : <span />}
                  {step < STEPS.length - 1 ? (
                    <button type="submit" className="btn btn-primary">Continue <ArrowRight size={18} /></button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                      {status === 'sending' ? <><span className="qf-spinner" /> Sending…</> : <>Send my answers <ArrowRight size={18} /></>}
                    </button>
                  )}
                </div>
                <p className="qf-privacy"><Lock size={14} /> No commitment. Your information is never shared.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
