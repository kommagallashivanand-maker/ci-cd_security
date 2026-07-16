import { useEffect, useState } from "react";

import PageTitle from "@/components/layout/PageTitle";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Loader from "@/components/ui/Loader";

import { fetchTeamStats, fetchRecentActivity } from "@/services/ticketService";

const ACTIVITY_COLUMNS = [
  { key: "actor", header: "Team member" },
  { key: "action", header: "Activity" },
  { key: "status", header: "Status", render: (value) => <StatusBadge status={value} /> },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeamStats(), fetchRecentActivity()]).then(
      ([statsData, activityData]) => {
        setStats(statsData);
        setActivity(activityData);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <>
      <PageTitle
        title="Admin Dashboard"
        subtitle="A high-level overview of the helpdesk."
      />

      {isLoading ? (
        <Loader fullPage label="Loading dashboard..." />
      ) : (
        <>
          <div className="stats-grid">
            <Card title="Total tickets" padding="sm">
              <p className="stat-value">{stats.totalTickets}</p>
            </Card>
            <Card title="Open tickets" padding="sm">
              <p className="stat-value">{stats.openTickets}</p>
            </Card>
            <Card title="Resolved this week" padding="sm">
              <p className="stat-value">{stats.resolvedThisWeek}</p>
            </Card>
            <Card title="Active agents" padding="sm">
              <p className="stat-value">{stats.activeAgents}</p>
            </Card>
          </div>

          <Card title="Recent activity" padding="sm">
            <Table columns={ACTIVITY_COLUMNS} data={activity} />
          </Card>
        </>
      )}
    </>
  );
}
