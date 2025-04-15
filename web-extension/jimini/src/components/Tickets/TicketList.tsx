import { makeRequest } from "@/services/webRequest"; 
import { useState, useEffect, useCallback } from "react";
import { useGlobalLoading } from "../GlobalLoading";
import ProjectSelect from "../Projects/ProjectSelect";
import { Loading, Pagination } from "@skedulo/sked-ui";

type Ticket = string;

interface TicketsState {
  data: Ticket[];
  total: number;
  error: string | null;
  loading: boolean;
}

const ITEMS_PER_PAGE = 50;

function TicketList() {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();
  const [ticketsState, setTicketsState] = useState<TicketsState>({
    data: [],
    total: 0,
    error: null,
    loading: false,
  });
  const [startAt, setStartAt] = useState<number>(0);
  const [project, setProject] = useState<string | null>(null);

  const [genedTicket, setGenedTicket] = useState<Array<string | null>>([]);

  const genAI = useCallback(
    async (issueKey: string) => {
      startGlobalLoading();
      try {
        const response = await makeRequest({
          url: `gemini`,
          method: "POST",
          body: JSON.stringify({ issueKey }),
        });
        const data = await response.json();
        setGenedTicket((prev) => [...prev, issueKey]);
      } catch (error) {
        console.error("Error fetching issue ticket:", error);
      } finally {
        endGlobalLoading();
      }
    },
    [startGlobalLoading, endGlobalLoading]
  );

  const fetchTickets = useCallback(async () => {
    if (!project) return;

    setTicketsState((prev) => ({ ...prev, loading: true, data: [] }));

    try {
      const response = await makeRequest({
        url: `listTickets`,
        method: "GET",
        queryParams: {
          projectBoard: project,
          startAt: startAt.toString(),
        },
      });

      const data = await response.json();
      setTicketsState({
        data: data.issues || [],
        total: data.total || 0,
        error: data.error || null,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTicketsState((prev) => ({
        ...prev,
        error: "Failed to fetch tickets",
        loading: false,
      }));
    }
  }, [project, startAt]);

  useEffect(() => {
    if (project) {
      fetchTickets();
    }
  }, [project, startAt, fetchTickets]);

  const handleProjectChange = useCallback(
    (project: { label: string; value: string } | undefined) => {
      setProject(project?.value || null);
    },
    []
  );

  const handlePageChange = (page: number) => {
    const newStartAt = page > 1 ? (page - 1) * ITEMS_PER_PAGE : 0;
    setStartAt(newStartAt);
  };

  const { data: tickets, total, error, loading } = ticketsState;

  return (
    <div className="cx-p-4">
      <div className="cx-flex cx-items-center cx-gap-8 cx-mb-4">
        <ProjectSelect
          disable={loading}
          onProjectChange={handleProjectChange}
        />
        {!loading && (
          <h2 className="cx-text-xl cx-font-bold">Tickets ({total})</h2>
        )}
      </div>

      {/* Error Display Section */}
      {error && (
        <div className="cx-p-3 cx-bg-red-100 cx-text-red-700 cx-rounded-md cx-mb-4">
          {error}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="cx-text-gray-500">No tickets found</p>
      )}

      {tickets.length > 0 && (
        <div className="cx-grid cx-grid-cols-1 md:cx-grid-cols-2 lg:cx-grid-cols-3 cx-gap-4">
          {Array.from({
            length: Math.ceil(tickets.length / (tickets.length > 30 ? 3 : 1)),
          }).map((_, colIndex) => (
            <ul
              key={colIndex}
              className="cx-divide-y cx-divide-gray-200 cx-border cx-rounded-md"
            >
              {tickets
                .slice(
                  colIndex *
                    Math.ceil(tickets.length / (tickets.length > 30 ? 3 : 1)),
                  (colIndex + 1) *
                    Math.ceil(tickets.length / (tickets.length > 30 ? 3 : 1))
                )
                .map((ticket) => (
                  <li
                    key={ticket}
                    className="cx-p-3 cx-hover:bg-gray-50 cx-flex cx-border-b cx-border-gray-200 cx-last:cx-border-b-0"
                  >
                    <button
                      onClick={() => genAI(ticket)}
                      className="cx-font-medium cx-text-blue-500 cx-hover:text-blue-700 cx-flex cx-items-center cx-gap-8"
                    >
                      <span>{ticket}</span>
                      {genedTicket.includes(ticket) && (
                        <svg // Checkmark icon
                          xmlns="http://www.w3.org/2000/svg"
                          className="cx-h-5 cx-w-5 cx-text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
            </ul>
          ))}
        </div>
      )}

      {!loading && (
        <Pagination
          onPageChange={handlePageChange}
          itemsTotal={total}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={Math.floor(startAt / ITEMS_PER_PAGE) + 1}
        />
      )}
    </div>
  );
}

export default TicketList;
