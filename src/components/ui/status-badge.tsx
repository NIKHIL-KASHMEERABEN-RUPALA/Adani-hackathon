import { cn } from '@/lib/utils';
import { RequestStage, EquipmentStatus } from '@/types';

interface StatusBadgeProps {
  status: RequestStage | EquipmentStatus | 'low' | 'medium' | 'high' | 'critical';
  type?: 'stage' | 'equipment' | 'priority';
}

const stageColors: Record<RequestStage, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  repaired: 'bg-green-100 text-green-800 border-green-300',
  scrap: 'bg-red-100 text-red-800 border-red-300',
};

const equipmentColors: Record<EquipmentStatus, string> = {
  operational: 'bg-green-100 text-green-800 border-green-300',
  under_maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  scrapped: 'bg-red-100 text-red-800 border-red-300',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 border-gray-300',
  medium: 'bg-blue-100 text-blue-800 border-blue-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const stageLabels: Record<RequestStage, string> = {
  new: 'New',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  scrap: 'Scrap',
};

const equipmentLabels: Record<EquipmentStatus, string> = {
  operational: 'Operational',
  under_maintenance: 'Under Maintenance',
  scrapped: 'Scrapped',
};

export function StatusBadge({ status, type = 'stage' }: StatusBadgeProps) {
  let colorClass = '';
  let label: string = status;

  if (type === 'stage') {
    colorClass = stageColors[status as RequestStage] || '';
    label = stageLabels[status as RequestStage] || status;
  } else if (type === 'equipment') {
    colorClass = equipmentColors[status as EquipmentStatus] || '';
    label = equipmentLabels[status as EquipmentStatus] || status;
  } else if (type === 'priority') {
    colorClass = priorityColors[status] || '';
    label = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide border',
        colorClass
      )}
    >
      {label}
    </span>
  );
}
