'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import ReportModal from './report-modal';

interface ReportButtonProps {
  targetType: 'post' | 'reply';
  targetId: string;
}

export default function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        通報する
      </button>
      {isModalOpen && (
        <ReportModal
          targetType={targetType}
          targetId={targetId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

