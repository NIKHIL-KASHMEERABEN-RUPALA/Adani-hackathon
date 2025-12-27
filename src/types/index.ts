// Core types for GearGuard Maintenance System

export type Department = 
  | 'Production'
  | 'IT'
  | 'Logistics'
  | 'Administration'
  | 'Quality Control'
  | 'Research & Development';

export type EquipmentStatus = 'operational' | 'under_maintenance' | 'scrapped';

export type RequestType = 'corrective' | 'preventive';

export type RequestStage = 'new' | 'in_progress' | 'repaired' | 'scrap';

export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'technician' | 'manager';
  teamId: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: Department;
  assignedTo?: string; // Employee name
  location: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  status: EquipmentStatus;
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  notes?: string;
  imageUrl?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  stage: RequestStage;
  equipmentId: string;
  teamId: string;
  assignedToId?: string;
  scheduledDate?: string;
  completedDate?: string;
  duration?: number; // in minutes
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  createdBy: string;
}

// Mock data helpers
export const EQUIPMENT_CATEGORIES = [
  'CNC Machine',
  'Computer',
  'Vehicle',
  'HVAC System',
  'Electrical Panel',
  'Conveyor Belt',
  'Forklift',
  'Printer',
  'Server',
  'Generator',
] as const;

export const DEPARTMENTS: Department[] = [
  'Production',
  'IT',
  'Logistics',
  'Administration',
  'Quality Control',
  'Research & Development',
];
