/**
 * ticketService
 *
 * Mock data layer standing in for a real backend/API. Every export
 * returns a Promise with an artificial delay so pages can exercise a
 * realistic loading state (see `Loader` usage in the dashboards).
 * Swap the internals for real `fetch` calls once an API exists -
 * consuming pages do not need to change.
 */

let nextId = 4;

const employeeTickets = [
  { id: 1, subject: "Laptop screen flickering", priority: "high", status: "In Progress" },
  { id: 2, subject: "Access request: Design folder", priority: "low", status: "Pending" },
  { id: 3, subject: "VPN connection drops", priority: "medium", status: "Resolved" },
];

const agentTickets = [
  { id: 101, subject: "Password reset for M. Rao", requester: "Meera Rao", priority: "high", status: "Open" },
  { id: 102, subject: "Printer not detected", requester: "Aman Verma", priority: "medium", status: "In Progress" },
  { id: 103, subject: "New hire equipment setup", requester: "Priya Nair", priority: "low", status: "Open" },
  { id: 104, subject: "Email sync issue", requester: "Karan Shah", priority: "medium", status: "Resolved" },
];

const teamStats = {
  totalTickets: 128,
  openTickets: 24,
  resolvedThisWeek: 37,
  activeAgents: 6,
};

const recentActivity = [
  { id: 1, actor: "Priya Nair", action: "Resolved ticket #98", status: "Resolved" },
  { id: 2, actor: "Karan Shah", action: "Escalated ticket #104", status: "High" },
  { id: 3, actor: "Aman Verma", action: "Created ticket #109", status: "Open" },
];

const delay = (value, ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Fetch the current user's tickets (Employee dashboard). */
export function fetchEmployeeTickets() {
  return delay([...employeeTickets]);
}

/** Create a new ticket on behalf of the current employee. */
export function createTicket({ subject, priority }) {
  const ticket = { id: nextId++, subject, priority, status: "Pending" };
  employeeTickets.unshift(ticket);
  return delay(ticket, 300);
}

/** Fetch tickets assigned to the current agent. */
export function fetchAgentTickets() {
  return delay([...agentTickets]);
}

/** Mark a ticket as resolved (Agent dashboard). */
export function resolveTicket(ticketId) {
  const ticket = agentTickets.find((t) => t.id === ticketId);
  if (ticket) ticket.status = "Resolved";
  return delay(ticket, 300);
}

/** Fetch org-wide summary numbers for the Admin dashboard. */
export function fetchTeamStats() {
  return delay({ ...teamStats });
}

/** Fetch the latest activity feed for the Admin dashboard. */
export function fetchRecentActivity() {
  return delay([...recentActivity]);
}
