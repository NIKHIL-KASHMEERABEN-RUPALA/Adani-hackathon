import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users, User, Trash2, Mail } from 'lucide-react';
import { Team, TeamMember } from '@/types';
import { toast } from 'sonner';

export default function TeamsPage() {
  const {
    teams,
    teamMembers,
    addTeam,
    addTeamMember,
    deleteTeamMember,
    getTeamMembersByTeam,
  } = useData();
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    color: '#000000',
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'technician' as 'technician' | 'manager',
    teamId: '',
  });

  const handleAddTeam = () => {
    if (!newTeam.name) {
      toast.error('Please enter a team name');
      return;
    }

    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      description: newTeam.description,
      color: newTeam.color,
      members: [],
    };

    addTeam(team);
    toast.success('Team created successfully');
    setIsTeamDialogOpen(false);
    setNewTeam({ name: '', description: '', color: '#000000' });
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.teamId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      teamId: newMember.teamId,
    };

    addTeamMember(member);
    toast.success('Team member added');
    setIsMemberDialogOpen(false);
    setNewMember({ name: '', email: '', role: 'technician', teamId: '' });
  };

  const handleDeleteMember = (memberId: string) => {
    deleteTeamMember(memberId);
    toast.success('Team member removed');
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Teams"
        description="Manage maintenance teams and technicians"
        actions={
          <div className="flex items-center gap-2">
            <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new technician or manager to a team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Name *</Label>
                    <Input
                      id="memberName"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberEmail">Email *</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      value={newMember.email}
                      onChange={(e) =>
                        setNewMember({ ...newMember, email: e.target.value })
                      }
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberTeam">Team *</Label>
                    <Select
                      value={newMember.teamId}
                      onValueChange={(v) =>
                        setNewMember({ ...newMember, teamId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberRole">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(v: 'technician' | 'manager') =>
                        setNewMember({ ...newMember, role: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddMember} className="w-full">
                    Add Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Add a specialized maintenance team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={newTeam.name}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, name: e.target.value })
                      }
                      placeholder="Mechanics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamDesc">Description</Label>
                    <Input
                      id="teamDesc"
                      value={newTeam.description}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, description: e.target.value })
                      }
                      placeholder="Heavy machinery maintenance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamColor">Team Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="teamColor"
                        value={newTeam.color}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, color: e.target.value })
                        }
                        className="w-10 h-10 border-2 border-border cursor-pointer"
                      />
                      <Input
                        value={newTeam.color}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, color: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddTeam} className="w-full">
                    Create Team
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => {
            const members = getTeamMembersByTeam(team.id);
            const managers = members.filter((m) => m.role === 'manager');
            const technicians = members.filter((m) => m.role === 'technician');

            return (
              <div key={team.id} className="border-2 border-border bg-card">
                <div
                  className="border-b-2 border-border px-5 py-4 flex items-center justify-between"
                  style={{ borderLeftColor: team.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: team.color }}
                    >
                      <Users className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {members.length} member{members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {team.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {team.description}
                    </p>
                  )}

                  {managers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Managers
                      </h4>
                      <div className="space-y-2">
                        {managers.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-3 bg-accent border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-sm">
                                {m.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{m.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {m.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMember(m.id)}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {technicians.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Technicians
                      </h4>
                      <div className="space-y-2">
                        {technicians.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-3 border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                                {m.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{m.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {m.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMember(m.id)}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {members.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No members yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {teams.length === 0 && (
          <div className="border-2 border-dashed border-border p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-bold text-lg">No teams created</h3>
            <p className="text-muted-foreground mt-1">
              Create your first maintenance team to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
