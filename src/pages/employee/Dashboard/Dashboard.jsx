import { useEffect, useState } from "react";

import PageTitle from "@/components/layout/PageTitle";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { showToast } from "@/components/ui/Toast";

import { fetchEmployeeTickets, createTicket } from "@/services/ticketService";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const COLUMNS = [
  { key: "subject", header: "Subject" },
  { key: "priority", header: "Priority", render: (value) => <StatusBadge status={value} /> },
  { key: "status", header: "Status", render: (value) => <StatusBadge status={value} /> },
];

export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployeeTickets().then((data) => {
      setTickets(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!subject.trim()) nextErrors.subject = "Subject is required.";
    if (!priority) nextErrors.priority = "Please select a priority.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const ticket = await createTicket({ subject, priority });
    setTickets((current) => [ticket, ...current]);
    setIsSubmitting(false);
    setSubject("");
    setPriority("");
    showToast.success("Ticket submitted successfully.");
  };

  return (
    <>
      <PageTitle
        title="Employee Dashboard"
        subtitle="Track your support tickets and raise new requests."
      />

      <div className="dashboard-grid">
        <Card title="Raise a ticket">
          <form onSubmit={handleSubmit} className="ticket-form">
            <Input
              id="subject"
              label="Subject"
              placeholder="e.g. Laptop won't turn on"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={errors.subject}
              required
            />

            <Select
              id="priority"
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={PRIORITY_OPTIONS}
              error={errors.priority}
              required
            />

            <Button type="submit" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Submitting..." : "Submit ticket"}
            </Button>
          </form>
        </Card>

        <Card title="My tickets" padding="sm">
          {isLoading ? (
            <Loader label="Loading your tickets..." />
          ) : (
            <Table columns={COLUMNS} data={tickets} emptyMessage="You have no tickets yet." />
          )}
        </Card>
      </div>
    </>
  );
}
