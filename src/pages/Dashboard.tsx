import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Wrench, Users, AlertTriangle } from "lucide-react";

const stats = [
  {
    title: "Total Equipment",
    value: "1,234",
    icon: Wrench,
    description: "+12% from last month",
    change: "+12%",
  },
  {
    title: "Active Requests",
    value: "23",
    icon: AlertTriangle,
    description: "5 urgent requests",
    change: "+2",
  },
  {
    title: "Team Members",
    value: "48",
    icon: Users,
    description: "Active in field",
    change: "+4",
  },
  {
    title: "System Status",
    value: "98.2%",
    icon: Activity,
    description: "Operational",
    change: "+0.1%",
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-mono uppercase">Dashboard</h2>
          <p className="text-muted-foreground font-mono mt-2">Overview of asset status and activities</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black">
              <CardTitle className="text-sm font-bold font-mono uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-none">
          <CardHeader className="border-b-2 border-black">
            <CardTitle className="font-mono uppercase font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground font-mono">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-none">
          <CardHeader className="border-b-2 border-black">
            <CardTitle className="font-mono uppercase font-bold">Urgent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000]">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none font-mono font-bold">Maintenance Required</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Generator #00{i} needs immediate attention
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
