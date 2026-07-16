import { useEffect, useMemo, useState } from "react";

import PageTitle from "@/components/layout/PageTitle";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { showToast } from "@/components/ui/Toast";

import { fetchAgentTickets, resolveTicket } from "@/services/ticketService";

const STATUS_FILTER_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
];

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchAgentTickets().then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  const handleResolve = async (ticketId) => {
    const updated = await resolveTicket(ticketId);
    setTickets((current) =>
      current.map((ticket) => (ticket.id === ticketId ? updated : ticket))
    );
    showToast.success(`Ticket #${ticketId} marked as resolved.`);
  };

  const columns = useMemo(
    () => [
      { key: "subject", header: "Ticket" },
      { key: "requester", header: "Requester" },
      { key: "priority", header: "Priority", render: (value) => <StatusBadge status={value} /> },
      { key: "status", header: "Status", render: (value) => <StatusBadge status={value} /> },
      {
        key: "id",
        header: "",
        render: (id, row) =>
          row.status !== "Resolved" && (
            <Button size="sm" variant="outline" onClick={() => handleResolve(id)}>
              Mark resolved
            </Button>
          ),
      },
    ],
    []
  );

  const filteredTickets = statusFilter
    ? tickets.filter((ticket) => ticket.status === statusFilter)
    : tickets;

  return (
    <>
      <PageTitle
        title="Agent Dashboard"
        subtitle="Review and resolve tickets assigned to you."
      />

      <Card title="Assigned tickets" padding="sm">
        <div className="dashboard-toolbar">
          <Select
            id="status-filter"
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUS_FILTER_OPTIONS}
            placeholder="All statuses"
            fullWidth={false}
          />
        </div>

        {isLoading ? (
          <Loader label="Loading assigned tickets..." />
        ) : (
          <Table
            columns={columns}
            data={filteredTickets}
            emptyMessage="No tickets match this filter."
          />
        )}
      </Card>
    </>
  );
}
