import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  Users,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { equipment, requests, teams, teamMembers, getEquipmentById, getMemberById } = useData();

  // Calculate stats
  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter((e) => e.status === 'operational').length;
  const underMaintenance = equipment.filter((e) => e.status === 'under_maintenance').length;
  
  const newRequests = requests.filter((r) => r.stage === 'new').length;
  const inProgressRequests = requests.filter((r) => r.stage === 'in_progress').length;
  const completedRequests = requests.filter((r) => r.stage === 'repaired').length;
  
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const urgentRequests = requests.filter(
    (r) => r.priority === 'critical' || r.priority === 'high'
  );

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Dashboard"
        description="Overview of your maintenance operations"
        actions={
          <Link to="/requests">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Equipment"
            value={totalEquipment}
            icon={<Wrench className="w-5 h-5" />}
            description={`${operationalEquipment} operational`}
          />
          <StatCard
            title="Open Requests"
            value={newRequests + inProgressRequests}
            icon={<ClipboardList className="w-5 h-5" />}
            description={`${newRequests} new, ${inProgressRequests} in progress`}
          />
          <StatCard
            title="Completed"
            value={completedRequests}
            icon={<CheckCircle className="w-5 h-5" />}
            description="This month"
          />
          <StatCard
            title="Teams"
            value={teams.length}
            icon={<Users className="w-5 h-5" />}
            description={`${teamMembers.length} technicians`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2 border-2 border-border bg-card">
            <div className="border-b-2 border-border px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">Recent Requests</h2>
              <Link to="/requests">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="divide-y-2 divide-border">
              {recentRequests.map((request) => {
                const eq = getEquipmentById(request.equipmentId);
                const assignee = request.assignedToId
                  ? getMemberById(request.assignedToId)
                  : null;
                return (
                  <div
                    key={request.id}
                    className="px-5 py-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold truncate">
                            {request.subject}
                          </span>
                          <StatusBadge status={request.stage} type="stage" />
                          <StatusBadge status={request.priority} type="priority" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {eq?.name || 'Unknown Equipment'} •{' '}
                          {request.type === 'corrective' ? 'Breakdown' : 'Preventive'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {assignee ? (
                          <span className="text-sm font-medium">{assignee.name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {recentRequests.length === 0 && (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  No maintenance requests yet
                </div>
              )}
            </div>
          </div>

          {/* Urgent Requests */}
          <div className="border-2 border-border bg-card">
            <div className="border-b-2 border-border px-5 py-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="font-bold text-lg">Urgent Attention</h2>
            </div>
            <div className="divide-y-2 divide-border">
              {urgentRequests.slice(0, 4).map((request) => {
                const eq = getEquipmentById(request.equipmentId);
                return (
                  <div
                    key={request.id}
                    className="px-5 py-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <StatusBadge status={request.priority} type="priority" />
                      <span className="font-medium truncate">{request.subject}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {eq?.name}
                    </p>
                  </div>
                );
              })}
              {urgentRequests.length === 0 && (
                <div className="px-5 py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  No urgent issues
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Equipment Under Maintenance */}
        {underMaintenance > 0 && (
          <div className="border-2 border-border bg-card">
            <div className="border-b-2 border-border px-5 py-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h2 className="font-bold text-lg">Equipment Under Maintenance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {equipment
                .filter((e) => e.status === 'under_maintenance')
                .map((eq) => (
                  <Link
                    key={eq.id}
                    to={`/equipment/${eq.id}`}
                    className="border-2 border-border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="font-semibold">{eq.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {eq.location}
                    </div>
                    <StatusBadge status={eq.status} type="equipment" />
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
