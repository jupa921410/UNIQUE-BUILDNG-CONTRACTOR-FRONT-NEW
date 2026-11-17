import './ConversionConsent.css';

export default function ConversionConsent({ checked, onChange }) {
  return (
    <label className="conversion-consent">
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>
        Allow advertising measurement for this request using a hashed email and customer reference (optional).{' '}
        <a href="/privacy#advertising-measurement">Details</a>
      </span>
    </label>
  );
}
