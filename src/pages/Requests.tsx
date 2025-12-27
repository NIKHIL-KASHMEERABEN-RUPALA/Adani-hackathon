import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  GripVertical,
  Clock,
  User,
  AlertCircle,
} from 'lucide-react';
import { MaintenanceRequest, RequestStage, RequestType } from '@/types';
import { toast } from 'sonner';

const STAGES: { key: RequestStage; label: string; color: string }[] = [
  { key: 'new', label: 'New', color: 'border-blue-500' },
  { key: 'in_progress', label: 'In Progress', color: 'border-yellow-500' },
  { key: 'repaired', label: 'Repaired', color: 'border-green-500' },
  { key: 'scrap', label: 'Scrap', color: 'border-red-500' },
];

export default function RequestsPage() {
  const [searchParams] = useSearchParams();
  const {
    requests,
    equipment,
    teams,
    teamMembers,
    addRequest,
    updateRequest,
    getEquipmentById,
    getTeamById,
    getMemberById,
    getTeamMembersByTeam,
  } = useData();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedRequest, setDraggedRequest] = useState<MaintenanceRequest | null>(null);

  const preSelectedEquipmentId = searchParams.get('equipment');

  const [newRequest, setNewRequest] = useState({
    subject: '',
    description: '',
    type: 'corrective' as RequestType,
    equipmentId: preSelectedEquipmentId || '',
    teamId: '',
    assignedToId: '',
    scheduledDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  // Auto-fill team when equipment is selected
  useEffect(() => {
    if (newRequest.equipmentId) {
      const eq = getEquipmentById(newRequest.equipmentId);
      if (eq) {
        setNewRequest((prev) => ({
          ...prev,
          teamId: eq.maintenanceTeamId,
          assignedToId: eq.defaultTechnicianId || '',
        }));
      }
    }
  }, [newRequest.equipmentId, getEquipmentById]);

  // Check for auto-open dialog
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      getEquipmentById(r.equipmentId)?.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesTeam = teamFilter === 'all' || r.teamId === teamFilter;
    const matchesEquipment = !preSelectedEquipmentId || r.equipmentId === preSelectedEquipmentId;
    return matchesSearch && matchesType && matchesTeam && matchesEquipment;
  });

  const getRequestsByStage = (stage: RequestStage) =>
    filteredRequests.filter((r) => r.stage === stage);

  const handleAddRequest = () => {
    if (!newRequest.subject || !newRequest.equipmentId || !newRequest.teamId) {
      toast.error('Please fill in required fields');
      return;
    }

    const request: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      subject: newRequest.subject,
      description: newRequest.description || undefined,
      type: newRequest.type,
      stage: 'new',
      equipmentId: newRequest.equipmentId,
      teamId: newRequest.teamId,
      assignedToId: newRequest.assignedToId || undefined,
      scheduledDate: newRequest.scheduledDate || undefined,
      priority: newRequest.priority,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    addRequest(request);
    toast.success('Request created successfully');
    setIsDialogOpen(false);
    setNewRequest({
      subject: '',
      description: '',
      type: 'corrective',
      equipmentId: '',
      teamId: '',
      assignedToId: '',
      scheduledDate: '',
      priority: 'medium',
    });
  };

  const handleDragStart = (e: React.DragEvent, request: MaintenanceRequest) => {
    setDraggedRequest(request);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: RequestStage) => {
    e.preventDefault();
    if (draggedRequest && draggedRequest.stage !== stage) {
      const updates: Partial<MaintenanceRequest> = { stage };
      
      if (stage === 'scrap') {
        const eq = getEquipmentById(draggedRequest.equipmentId);
        if (eq) {
          toast.info(`Equipment "${eq.name}" flagged for scrap evaluation`);
        }
      }
      
      if (stage === 'repaired') {
        updates.completedDate = new Date().toISOString();
      }

      updateRequest(draggedRequest.id, updates);
      toast.success(`Moved to ${STAGES.find((s) => s.key === stage)?.label}`);
    }
    setDraggedRequest(null);
  };

  const handleAssign = (requestId: string, technicianId: string) => {
    updateRequest(requestId, { 
      assignedToId: technicianId,
      stage: 'in_progress' 
    });
    toast.success('Technician assigned');
  };

  const handleRecordDuration = (requestId: string, duration: number) => {
    updateRequest(requestId, { duration });
    toast.success('Duration recorded');
  };

  const selectedTeamMembers = newRequest.teamId
    ? getTeamMembersByTeam(newRequest.teamId)
    : [];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Maintenance Requests"
        description="Track and manage repair jobs"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>
                  Report an issue or schedule preventive maintenance
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={newRequest.subject}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, subject: e.target.value })
                    }
                    placeholder="What's the issue?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequest.description}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, description: e.target.value })
                    }
                    placeholder="Provide additional details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Request Type *</Label>
                    <Select
                      value={newRequest.type}
                      onValueChange={(v: RequestType) =>
                        setNewRequest({ ...newRequest, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrective">
                          Corrective (Breakdown)
                        </SelectItem>
                        <SelectItem value="preventive">
                          Preventive (Scheduled)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newRequest.priority}
                      onValueChange={(v: 'low' | 'medium' | 'high' | 'critical') =>
                        setNewRequest({ ...newRequest, priority: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Equipment *</Label>
                  <Select
                    value={newRequest.equipmentId}
                    onValueChange={(v) =>
                      setNewRequest({ ...newRequest, equipmentId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment
                        .filter((eq) => eq.status !== 'scrapped')
                        .map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.name} ({eq.serialNumber})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maintenance Team</Label>
                    <Select
                      value={newRequest.teamId}
                      onValueChange={(v) =>
                        setNewRequest({ ...newRequest, teamId: v, assignedToId: '' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Auto-filled from equipment" />
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
                    <Label>Assign To</Label>
                    <Select
                      value={newRequest.assignedToId}
                      onValueChange={(v) =>
                        setNewRequest({ ...newRequest, assignedToId: v })
                      }
                      disabled={!newRequest.teamId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTeamMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newRequest.type === 'preventive' && (
                  <div className="space-y-2">
                    <Label>Scheduled Date</Label>
                    <Input
                      type="datetime-local"
                      value={newRequest.scheduledDate}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, scheduledDate: e.target.value })
                      }
                    />
                  </div>
                )}

                <Button onClick={handleAddRequest} className="w-full">
                  Create Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className={`border-2 border-border bg-card ${stage.color} border-t-4`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="px-4 py-3 border-b-2 border-border flex items-center justify-between">
                <h3 className="font-bold">{stage.label}</h3>
                <span className="bg-accent px-2 py-0.5 text-sm font-medium">
                  {getRequestsByStage(stage.key).length}
                </span>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {getRequestsByStage(stage.key).map((request) => {
                  const eq = getEquipmentById(request.equipmentId);
                  const team = getTeamById(request.teamId);
                  const assignee = request.assignedToId
                    ? getMemberById(request.assignedToId)
                    : null;
                  const isOverdue =
                    request.scheduledDate &&
                    new Date(request.scheduledDate) < new Date() &&
                    request.stage !== 'repaired';

                  return (
                    <div
                      key={request.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, request)}
                      className={`border-2 border-border bg-background p-3 cursor-grab active:cursor-grabbing hover:shadow-xs transition-shadow ${
                        isOverdue ? 'border-l-4 border-l-destructive' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm truncate">
                              {request.subject}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={request.priority} type="priority" />
                            {isOverdue && (
                              <span className="text-xs text-destructive font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Overdue
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 truncate">
                            {eq?.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            {assignee ? (
                              <div className="flex items-center gap-1">
                                <div className="w-5 h-5 bg-foreground text-background flex items-center justify-center text-xs font-bold">
                                  {assignee.name.charAt(0)}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {assignee.name.split(' ')[0]}
                                </span>
                              </div>
                            ) : (
                              <Select
                                onValueChange={(v) => handleAssign(request.id, v)}
                              >
                                <SelectTrigger className="h-6 text-xs w-24">
                                  <User className="w-3 h-3 mr-1" />
                                  Assign
                                </SelectTrigger>
                                <SelectContent>
                                  {getTeamMembersByTeam(request.teamId).map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                      {m.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {request.duration ? (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {request.duration}m
                              </span>
                            ) : request.stage === 'repaired' ? (
                              <Input
                                type="number"
                                placeholder="Min"
                                className="h-6 w-16 text-xs"
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val > 0) {
                                    handleRecordDuration(request.id, val);
                                  }
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
