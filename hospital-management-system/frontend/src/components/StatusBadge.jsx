import React from 'react';

export default function StatusBadge({ status, type = 'status' }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let badgeClass = 'badge';
  if (normalized === 'scheduled') badgeClass += ' badge-scheduled';
  else if (normalized === 'completed') badgeClass += ' badge-completed';
  else if (normalized === 'cancelled') badgeClass += ' badge-cancelled';
  else if (normalized === 'paid') badgeClass += ' badge-paid';
  else if (normalized === 'pending') badgeClass += ' badge-pending';
  else if (type === 'specialty') badgeClass += ' badge-specialty';
  else badgeClass += ' badge-scheduled';

  return (
    <span className={badgeClass}>
      {status}
    </span>
  );
}
