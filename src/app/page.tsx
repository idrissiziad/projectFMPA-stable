'use client';

import { QCMApp } from '@/components/qcm/QCMApp';
import { MeshGradient } from '@paper-design/shaders-react';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme = 'light' } = useTheme();
  
  return (
    <div className="relative min-h-screen">
      {/* Animated background using Paper Shaders */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          colors={theme === 'dark' 
            ? ['#1e3a8a', '#065f46', '#7c2d12', '#581c87']  // Dark theme colors
            : ['#dbeafe', '#dcfce7', '#fef3c7', '#f3e8ff']   // Light theme colors
          }
          distortion={0.8}
          swirl={0.6}
          speed={0.15}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <QCMApp />
      </div>
    </div>
  );
}