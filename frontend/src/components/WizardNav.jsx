import { useNavigate, useLocation } from 'react-router-dom';

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
    <div style={{ marginBottom: 24, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ display: 'flex', gap: 0, minWidth: 640 }}>
        {steps.map((s, i) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <a
              key={s.num}
              href={`${s.path}?projectId=${projectId}`}
              style={{
                flex: 1,
                padding: '10px 14px',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: isCurrent ? 600 : 400,
                textAlign: 'center',
                color: isDone || isCurrent ? '#fff' : 'var(--steel)',
                background: isCurrent ? 'var(--primary-light)' : isDone ? 'var(--primary)' : '#e2e8f0',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {s.num}. {s.label}
            </a>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--steel-light)' }}>
        Step {currentStep} di 6
      </div>
    </div>
  );
}
