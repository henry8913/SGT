import { useSearchParams } from 'react-router-dom';
import WizardNav from './WizardNav';

export default function StepWrapper({ title, description, children }) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {projectId && <WizardNav projectId={projectId} />}
      {children}
    </div>
  );
}
