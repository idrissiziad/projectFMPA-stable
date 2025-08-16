import { QCMApp } from '@/components/qcm/QCMApp';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900">
      <QCMApp />
    </main>
  );
}