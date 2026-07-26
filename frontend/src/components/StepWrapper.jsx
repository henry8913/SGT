import { useSearchParams } from 'react-router-dom';
import WizardNav from './WizardNav';

export default function StepWrapper({ title, description, children }) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>{title}</h2>
      {description && <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>{description}</p>}
      {projectId && <WizardNav projectId={projectId} />}
      {children}
    </div>
  );
}
