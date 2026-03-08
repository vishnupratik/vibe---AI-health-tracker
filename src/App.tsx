import { useAppStore } from './store';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { useNotifications } from './hooks/useNotifications';

export default function App() {
  const { profile } = useAppStore();
  useNotifications();

  if (!profile) {
    return <Onboarding />;
  }

  return <Dashboard />;
}
