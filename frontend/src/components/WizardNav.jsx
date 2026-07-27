import { useLocation } from 'react-router-dom';

const steps = [
  { num: 1, label: 'Macchina', path: '/nuovo-progetto/step-1' },
  { num: 2, label: 'Geometria', path: '/nuovo-progetto/step-2' },
  { num: 3, label: 'Masse', path: '/nuovo-progetto/step-3' },
  { num: 4, label: 'Curve carico', path: '/nuovo-progetto/step-4' },
  { num: 5, label: 'Aree vento', path: '/nuovo-progetto/step-5' },
  { num: 6, label: 'Stabilità', path: '/nuovo-progetto/step-6' },
];

export default function WizardNav({ projectId }) {
  const location = useLocation();
  const currentStep = steps.find(s => location.pathname.includes(s.path))?.num || 1;

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="step-bar" style={{ minWidth: 600 }}>
        {steps.map((s) => {
          let cls = 'step-pending';
          if (currentStep > s.num) cls = 'step-done';
          if (currentStep === s.num) cls = 'step-current';
          return (
            <a key={s.num} href={`${s.path}?projectId=${projectId}`} className={`step-item ${cls}`}>
              {s.num}. {s.label}
            </a>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: 'var(--gray)' }}>
        Step {currentStep} di 6
        {currentStep > 1 && <span style={{ marginLeft: 8, color: 'var(--yellow)' }}>✔ Completati: {currentStep - 1}</span>}
      </div>
    </div>
  );
}
