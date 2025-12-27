import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Wrench,
  MapPin,
  Calendar,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Equipment, DEPARTMENTS, EQUIPMENT_CATEGORIES } from '@/types';
import { toast } from 'sonner';

export default function EquipmentPage() {
  const { equipment, teams, addEquipment, getRequestsForEquipment, getTeamById } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New equipment form state
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    serialNumber: '',
    category: '',
    department: '',
    location: '',
    assignedTo: '',
    purchaseDate: '',
    warrantyExpiry: '',
    maintenanceTeamId: '',
    notes: '',
  });

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' || eq.department === departmentFilter;
    const matchesStatus =
      statusFilter === 'all' || eq.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.serialNumber || !newEquipment.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const eq: Equipment = {
      id: `eq-${Date.now()}`,
      name: newEquipment.name,
      serialNumber: newEquipment.serialNumber,
      category: newEquipment.category,
      department: newEquipment.department as Equipment['department'],
      location: newEquipment.location,
      assignedTo: newEquipment.assignedTo || undefined,
      purchaseDate: newEquipment.purchaseDate,
      warrantyExpiry: newEquipment.warrantyExpiry || undefined,
      status: 'operational',
      maintenanceTeamId: newEquipment.maintenanceTeamId,
      notes: newEquipment.notes || undefined,
    };

    addEquipment(eq);
    toast.success('Equipment added successfully');
    setIsDialogOpen(false);
    setNewEquipment({
      name: '',
      serialNumber: '',
      category: '',
      department: '',
      location: '',
      assignedTo: '',
      purchaseDate: '',
      warrantyExpiry: '',
      maintenanceTeamId: '',
      notes: '',
    });
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Equipment"
        description="Manage and track all company assets"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Register a new asset in the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={newEquipment.name}
                      onChange={(e) =>
                        setNewEquipment({ ...newEquipment, name: e.target.value })
                      }
                      placeholder="CNC Machine Alpha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number *</Label>
                    <Input
                      id="serial"
                      value={newEquipment.serialNumber}
                      onChange={(e) =>
                        setNewEquipment({ ...newEquipment, serialNumber: e.target.value })
                      }
                      placeholder="CNC-2024-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newEquipment.category}
                      onValueChange={(v) =>
                        setNewEquipment({ ...newEquipment, category: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newEquipment.department}
                      onValueChange={(v) =>
                        setNewEquipment({ ...newEquipment, department: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEquipment.location}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, location: e.target.value })
                    }
                    placeholder="Building A, Floor 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To (Employee)</Label>
                  <Input
                    id="assignedTo"
                    value={newEquipment.assignedTo}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, assignedTo: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newEquipment.purchaseDate}
                      onChange={(e) =>
                        setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                    <Input
                      id="warrantyExpiry"
                      type="date"
                      value={newEquipment.warrantyExpiry}
                      onChange={(e) =>
                        setNewEquipment({ ...newEquipment, warrantyExpiry: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Maintenance Team</Label>
                  <Select
                    value={newEquipment.maintenanceTeamId}
                    onValueChange={(v) =>
                      setNewEquipment({ ...newEquipment, maintenanceTeamId: v })
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
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newEquipment.notes}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, notes: e.target.value })
                    }
                    placeholder="Additional information..."
                  />
                </div>

                <Button onClick={handleAddEquipment} className="w-full">
                  Add Equipment
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
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
              <SelectItem value="scrapped">Scrapped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((eq) => {
            const team = getTeamById(eq.maintenanceTeamId);
            const requestCount = getRequestsForEquipment(eq.id).filter(
              (r) => r.stage !== 'repaired' && r.stage !== 'scrap'
            ).length;

            return (
              <div
                key={eq.id}
                className="border-2 border-border bg-card hover:shadow-xs transition-shadow cursor-pointer group"
                onClick={() => navigate(`/equipment/${eq.id}`)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent border-2 border-border">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{eq.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          {eq.serialNumber}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {eq.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Purchased: {new Date(eq.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <StatusBadge status={eq.status} type="equipment" />
                    {requestCount > 0 && (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <ClipboardList className="w-4 h-4" />
                        {requestCount} open
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{eq.category}</span>
                    {team && (
                      <span
                        className="px-2 py-0.5 text-xs font-medium border"
                        style={{ borderColor: team.color, color: team.color }}
                      >
                        {team.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="border-2 border-dashed border-border p-12 text-center">
            <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-bold text-lg">No equipment found</h3>
            <p className="text-muted-foreground mt-1">
              {search || departmentFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first piece of equipment to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
