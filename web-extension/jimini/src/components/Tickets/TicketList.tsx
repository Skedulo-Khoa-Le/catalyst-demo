import { makeRequest } from "@/services/webRequest";
import { useState, useEffect } from "react";
import { useGlobalLoading } from "../GlobalLoading";
import ProjectSelect from "../Projects/ProjectSelect";

function TicketList() {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();
  const [tickets, setTickets] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<string | null>(null);

  async function fetchIssueTicket(issueKey: string) {
    startGlobalLoading();
    try {
      await makeRequest({
        url: `gemini`,
        method: "POST",
        body: JSON.stringify({
          issueKey: issueKey,
        }),
      }).then((response) => {
        console.log((response as any).json());
      });
    } catch (error) {
      console.error("Error fetching issue ticket:", error);
    } finally {
      endGlobalLoading();
    }
  }

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await makeRequest({
        url: `listTickets`,
        method: "GET",
        queryParams: project ? { projectBoard: project } : undefined,
      });

      const data = await response.json();
      setTickets(data.issues || []);
      setTotal(data.total || 0);
      setError(data.error);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    project && fetchTickets();
  }, [project]); // Add project as a dependency

  return (
    <div className="cx-p-4">
      <div className="cx-flex cx-items-center cx-gap-8 cx-mb-4">
        <ProjectSelect
          onProjectChange={(project) => {
            setProject(project?.value || null);
          }}
        />

        <h2 className="cx-text-xl cx-font-bold">Tickets ({total})</h2>
      </div>

      {loading && <p>Loading tickets...</p>}

      {error && (
        <div className="cx-p-3 cx-bg-red-100 cx-text-red-700 cx-rounded-md cx-mb-4">
          {error}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="cx-text-gray-500">No tickets found</p>
      )}

      {tickets.length > 0 && (
        <ul className="cx-divide-y cx-divide-gray-200 cx-border cx-rounded-md">
          {tickets.map((ticket) => (
            <li key={ticket} className="cx-p-3 cx-hover:bg-gray-50 cx-flex">
              <button
                onClick={async () => await fetchIssueTicket(ticket)}
                className="cx-font-medium cx-text-blue-500 cx-hover:text-blue-700"
              >
                {ticket}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;
