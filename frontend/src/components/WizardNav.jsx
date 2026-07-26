import { useNavigate, useLocation } from 'react-router-dom';

const steps = [
  { num: 1, label: 'Caratteristiche macchina', path: '/nuovo-progetto/step-1' },
  { num: 2, label: 'Geometria braccio', path: '/nuovo-progetto/step-2' },
  { num: 3, label: 'Masse proprie', path: '/nuovo-progetto/step-3' },
  { num: 4, label: 'Curve di carico', path: '/nuovo-progetto/step-4' },
  { num: 5, label: 'Aree vento', path: '/nuovo-progetto/step-5' },
  { num: 6, label: 'Coefficienti stabilità', path: '/nuovo-progetto/step-6' },
];

export default function WizardNav({ projectId }) {
  const location = useLocation();
  const currentStep = steps.find(s => location.pathname.includes(s.path))?.num || 1;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href={`${s.path}?projectId=${projectId}`}
              style={{
                padding: '8px 16px', borderRadius: 4, textDecoration: 'none',
                background: currentStep >= s.num ? '#1a237e' : '#e0e0e0',
                color: currentStep >= s.num ? '#fff' : '#666',
                fontWeight: currentStep === s.num ? 'bold' : 'normal',
                fontSize: 13, whiteSpace: 'nowrap',
              }}
            >
              {s.num}. {s.label}
            </a>
            {i < steps.length - 1 && (
              <div style={{ width: 16, height: 2, background: currentStep > s.num ? '#1a237e' : '#e0e0e0' }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Step {currentStep} di 6
      </div>
    </div>
  );
}
