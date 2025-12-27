import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Team, TeamMember, Equipment, MaintenanceRequest } from '@/types';
import { mockTeams, mockTeamMembers, mockEquipment, mockRequests } from '@/data/mockData';

interface DataContextType {
  teams: Team[];
  teamMembers: TeamMember[];
  equipment: Equipment[];
  requests: MaintenanceRequest[];
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addRequest: (request: MaintenanceRequest) => void;
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  deleteRequest: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getTeamById: (id: string) => Team | undefined;
  getMemberById: (id: string) => TeamMember | undefined;
  getRequestsForEquipment: (equipmentId: string) => MaintenanceRequest[];
  getTeamMembersByTeam: (teamId: string) => TeamMember[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);

  const addEquipment = (eq: Equipment) => {
    setEquipment((prev) => [...prev, eq]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...updates } : eq))
    );
  };

  const deleteEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((eq) => eq.id !== id));
  };

  const addTeam = (team: Team) => {
    setTeams((prev) => [...prev, team]);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addRequest = (request: MaintenanceRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  const updateRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const getEquipmentById = (id: string) => equipment.find((eq) => eq.id === id);
  const getTeamById = (id: string) => teams.find((t) => t.id === id);
  const getMemberById = (id: string) => teamMembers.find((m) => m.id === id);
  const getRequestsForEquipment = (equipmentId: string) =>
    requests.filter((r) => r.equipmentId === equipmentId);
  const getTeamMembersByTeam = (teamId: string) =>
    teamMembers.filter((m) => m.teamId === teamId);

  return (
    <DataContext.Provider
      value={{
        teams,
        teamMembers,
        equipment,
        requests,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addTeam,
        updateTeam,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addRequest,
        updateRequest,
        deleteRequest,
        getEquipmentById,
        getTeamById,
        getMemberById,
        getRequestsForEquipment,
        getTeamMembersByTeam,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
