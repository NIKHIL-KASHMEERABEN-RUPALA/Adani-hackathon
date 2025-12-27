import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { MaintenanceRequest } from '@/types';
import { toast } from 'sonner';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

export default function CalendarPage() {
  const {
    requests,
    equipment,
    teams,
    addRequest,
    getEquipmentById,
    getTeamById,
    getTeamMembersByTeam,
  } = useData();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newRequest, setNewRequest] = useState({
    subject: '',
    description: '',
    equipmentId: '',
    teamId: '',
    assignedToId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  // Get preventive maintenance requests with scheduled dates
  const preventiveRequests = requests.filter(
    (r) => r.type === 'preventive' && r.scheduledDate
  );

  // Calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getRequestsForDay = (date: Date) => {
    return preventiveRequests.filter((r) => {
      if (!r.scheduledDate) return false;
      return isSameDay(new Date(r.scheduledDate), date);
    });
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleAddRequest = () => {
    if (!newRequest.subject || !newRequest.equipmentId || !selectedDate) {
      toast.error('Please fill in required fields');
      return;
    }

    const eq = getEquipmentById(newRequest.equipmentId);

    const request: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      subject: newRequest.subject,
      description: newRequest.description || undefined,
      type: 'preventive',
      stage: 'new',
      equipmentId: newRequest.equipmentId,
      teamId: newRequest.teamId || eq?.maintenanceTeamId || '',
      assignedToId: newRequest.assignedToId || undefined,
      scheduledDate: selectedDate.toISOString(),
      priority: newRequest.priority,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    addRequest(request);
    toast.success('Preventive maintenance scheduled');
    setIsDialogOpen(false);
    setNewRequest({
      subject: '',
      description: '',
      equipmentId: '',
      teamId: '',
      assignedToId: '',
      priority: 'medium',
    });
  };

  const selectedTeamMembers = newRequest.teamId
    ? getTeamMembersByTeam(newRequest.teamId)
    : [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Maintenance Calendar"
        description="Schedule and view preventive maintenance"
      />

      <div className="p-6">
        {/* Calendar Header */}
        <div className="border-2 border-border bg-card mb-6">
          <div className="border-b-2 border-border px-5 py-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-bold text-xl">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b-2 border-border">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center font-semibold text-sm text-muted-foreground bg-accent"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayRequests = getRequestsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-border p-2 cursor-pointer transition-colors hover:bg-accent ${
                    !isCurrentMonth ? 'bg-muted/30' : ''
                  } ${isToday ? 'bg-accent' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      !isCurrentMonth ? 'text-muted-foreground' : ''
                    } ${
                      isToday
                        ? 'bg-foreground text-background w-6 h-6 flex items-center justify-center'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayRequests.slice(0, 3).map((req) => {
                      const team = getTeamById(req.teamId);
                      return (
                        <div
                          key={req.id}
                          className="text-xs p-1 truncate border-l-2"
                          style={{ borderColor: team?.color || '#000' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {req.subject}
                        </div>
                      );
                    })}
                    {dayRequests.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayRequests.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="border-2 border-border bg-card p-4">
          <h3 className="font-bold mb-3">Teams</h3>
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: team.color }}
                />
                <span className="text-sm">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Schedule Maintenance for{' '}
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}
            </DialogTitle>
            <DialogDescription>
              Create a preventive maintenance request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={newRequest.subject}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, subject: e.target.value })
                }
                placeholder="Quarterly Inspection"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newRequest.description}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, description: e.target.value })
                }
                placeholder="Details..."
              />
            </div>

            <div className="space-y-2">
              <Label>Equipment *</Label>
              <Select
                value={newRequest.equipmentId}
                onValueChange={(v) => {
                  const eq = getEquipmentById(v);
                  setNewRequest({
                    ...newRequest,
                    equipmentId: v,
                    teamId: eq?.maintenanceTeamId || '',
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment
                    .filter((eq) => eq.status !== 'scrapped')
                    .map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Team</Label>
                <Select
                  value={newRequest.teamId}
                  onValueChange={(v) =>
                    setNewRequest({ ...newRequest, teamId: v, assignedToId: '' })
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
                <Label>Assign To</Label>
                <Select
                  value={newRequest.assignedToId}
                  onValueChange={(v) =>
                    setNewRequest({ ...newRequest, assignedToId: v })
                  }
                  disabled={!newRequest.teamId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTeamMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleAddRequest} className="w-full">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
