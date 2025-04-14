import MainLayout from "@/components/MainLayout";
import { withGlobalLoading } from "@/components/GlobalLoading";
import TicketSearch from "./components/Tickets/TicketSearch";
import TicketList from "./components/Tickets/TicketList";

function App() {
  return (
    <MainLayout>
      <>
        <TicketSearch />
        <TicketList />
      </>
    </MainLayout>
  );
}

export default withGlobalLoading(App);
