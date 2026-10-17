import SEO from '../../components/SEO/SEO';

const content = {
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for Unique Building Contractors website and consultation requests.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Website terms for Unique Building Contractors.',
  },
};

export default function LegalPage({ type }) {
  const page = content[type];
  return (
    <main className="section legal-page" style={{ minHeight: '70vh', paddingTop: '180px' }}>
      <SEO title={page.title} description={page.description} />
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 className="section-title">{page.title}</h1>
        {type === 'privacy' ? (
          <>
            <p>Unique Building Contractors collects the information you voluntarily submit through our contact form, including your name, phone number, email address, requested service and project details.</p>
            <p>We use this information to respond to inquiries, prepare consultations and communicate about requested construction services. We do not sell personal information.</p>
            <p>To request access, correction or deletion of your information, email <a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a>.</p>

            <section id="messaging-privacy-policy" style={{ marginTop: '48px' }}>
              <h2 style={{ marginBottom: '16px' }}>Unique Building Contractors Messaging Privacy Policy</h2>
              <p>Unique Building Contractors LLC (doing business as Unique Building Contractors) ("we," "us," "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how Unique Building Contractors collects and uses information about you when you opt-in to receive SMS messages from us.</p>

              <h3 style={{ marginTop: '28px', marginBottom: '10px' }}>Data We Collect</h3>
              <p>When you opt-in to receive SMS messages, we collect:</p>
              <ul style={{ paddingLeft: '24px', listStyle: 'disc' }}>
                <li>Your name</li>
                <li>Your phone number</li>
                <li>Consent to send SMS messages</li>
              </ul>

              <h3 style={{ marginTop: '28px', marginBottom: '10px' }}>How We Use Your Data</h3>
              <p>We use your information to:</p>
              <ul style={{ paddingLeft: '24px', listStyle: 'disc' }}>
                <li>Operate our business</li>
                <li>Send you the SMS messages you've opted in to receive</li>
              </ul>

              <h3 style={{ marginTop: '28px', marginBottom: '10px' }}>Data Sharing</h3>
              <ul style={{ paddingLeft: '24px', listStyle: 'disc' }}>
                <li>Customer data is not shared with 3rd parties for promotional or marketing purposes.</li>
                <li>Mobile opt-in and consent are never shared with anyone for any purpose. Any information sharing that may be mentioned elsewhere in this policy excludes mobile opt-in data.</li>
              </ul>

              <h3 style={{ marginTop: '28px', marginBottom: '10px' }}>Messaging Program Terms and Conditions</h3>
              <ol style={{ paddingLeft: '24px', listStyle: 'decimal' }}>
                <li>The messaging program consists of general customer care messaging to answer questions and provide support to customers. Messages will be sent from <a href="tel:+18135237828">(813) 523-7828</a>.</li>
                <li>You can cancel the SMS service at any time. Just text "STOP" to the phone number from which you received messages. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.</li>
                <li>If you are experiencing issues with the messaging program you can reply with the keyword HELP for more assistance, or you can get help directly at <a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a>.</li>
                <li>Carriers are not liable for delayed or undelivered messages.</li>
                <li>As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency will vary based on communication needs. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.</li>
                <li>If you have any questions regarding privacy, please read our privacy policy details contained in the rest of this page or contact us at <a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a>.</li>
              </ol>
            </section>
          </>
        ) : (
          <>
            <p>This website provides general information about construction and remodeling services. Website content does not constitute a binding estimate, contract, warranty or professional engineering advice.</p>
            <p>Project scope, pricing, schedules and warranties are established only through a written agreement signed by the relevant parties.</p>
            <p>For questions, contact <a href="mailto:sales@uniquebuildingcontractors.com">sales@uniquebuildingcontractors.com</a>.</p>
          </>
        )}
        <p><small>Last updated: {type === 'privacy' ? 'October 4, 2026' : 'July 13, 2026'}.</small></p>
      </div>
    </main>
  );
}
