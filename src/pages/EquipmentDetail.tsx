import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Calendar,
  Shield,
  Users,
  ClipboardList,
  Trash2,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getEquipmentById,
    getTeamById,
    getMemberById,
    getRequestsForEquipment,
    updateEquipment,
    deleteEquipment,
  } = useData();

  const equipment = getEquipmentById(id || '');

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Equipment Not Found</h2>
          <Button onClick={() => navigate('/equipment')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Equipment
          </Button>
        </div>
      </div>
    );
  }

  const team = getTeamById(equipment.maintenanceTeamId);
  const defaultTech = equipment.defaultTechnicianId
    ? getMemberById(equipment.defaultTechnicianId)
    : null;
  const relatedRequests = getRequestsForEquipment(equipment.id);
  const openRequests = relatedRequests.filter(
    (r) => r.stage !== 'repaired' && r.stage !== 'scrap'
  );

  const handleScrap = () => {
    updateEquipment(equipment.id, { status: 'scrapped' });
    toast.success('Equipment marked as scrapped');
  };

  const handleDelete = () => {
    deleteEquipment(equipment.id);
    toast.success('Equipment deleted');
    navigate('/equipment');
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={equipment.name}
        description={`Serial: ${equipment.serialNumber}`}
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/requests?equipment=${equipment.id}`}>
              <Button variant="outline" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Maintenance
                {openRequests.length > 0 && (
                  <span className="ml-1 bg-foreground text-background px-1.5 py-0.5 text-xs font-bold">
                    {openRequests.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="outline" onClick={() => navigate('/equipment')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details Card */}
            <div className="border-2 border-border bg-card">
              <div className="border-b-2 border-border px-5 py-4">
                <h2 className="font-bold text-lg">Equipment Details</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="font-medium">{equipment.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Department
                  </p>
                  <p className="font-medium">{equipment.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <StatusBadge status={equipment.status} type="equipment" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Assigned To
                  </p>
                  <p className="font-medium">
                    {equipment.assignedTo || 'Not assigned'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="font-medium">{equipment.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase & Warranty */}
            <div className="border-2 border-border bg-card">
              <div className="border-b-2 border-border px-5 py-4">
                <h2 className="font-bold text-lg">Purchase & Warranty</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Purchase Date
                    </p>
                    <p className="font-medium">
                      {new Date(equipment.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Warranty Expiry
                    </p>
                    <p className="font-medium">
                      {equipment.warrantyExpiry
                        ? new Date(equipment.warrantyExpiry).toLocaleDateString()
                        : 'No warranty'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Requests */}
            <div className="border-2 border-border bg-card">
              <div className="border-b-2 border-border px-5 py-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">Maintenance History</h2>
                <Link to={`/requests?equipment=${equipment.id}`}>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="divide-y-2 divide-border">
                {relatedRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{req.subject}</span>
                          <StatusBadge status={req.stage} type="stage" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {req.type === 'corrective' ? 'Breakdown' : 'Preventive'} •{' '}
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {req.duration && (
                        <span className="text-sm text-muted-foreground">
                          {req.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {relatedRequests.length === 0 && (
                  <div className="px-5 py-8 text-center text-muted-foreground">
                    No maintenance history
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Maintenance Team */}
            <div className="border-2 border-border bg-card">
              <div className="border-b-2 border-border px-5 py-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h2 className="font-bold text-lg">Maintenance Team</h2>
              </div>
              <div className="p-5">
                {team ? (
                  <div>
                    <div
                      className="inline-block px-3 py-1 font-semibold border-2 mb-3"
                      style={{ borderColor: team.color, color: team.color }}
                    >
                      {team.name}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {team.description}
                    </p>
                    {defaultTech && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Default Technician
                        </p>
                        <p className="font-medium">{defaultTech.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {defaultTech.email}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No team assigned</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-2 border-border bg-card">
              <div className="border-b-2 border-border px-5 py-4">
                <h2 className="font-bold text-lg">Actions</h2>
              </div>
              <div className="p-5 space-y-3">
                <Link to={`/requests?new=true&equipment=${equipment.id}`} className="block">
                  <Button className="w-full gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Create Request
                  </Button>
                </Link>
                {equipment.status !== 'scrapped' && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={handleScrap}
                  >
                    <Trash2 className="w-4 h-4" />
                    Mark as Scrapped
                  </Button>
                )}
              </div>
            </div>

            {/* Notes */}
            {equipment.notes && (
              <div className="border-2 border-border bg-card">
                <div className="border-b-2 border-border px-5 py-4">
                  <h2 className="font-bold text-lg">Notes</h2>
                </div>
                <div className="p-5">
                  <p className="text-sm">{equipment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
