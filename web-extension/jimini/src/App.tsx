import MainLayout from "@/components/MainLayout";
import { withGlobalLoading } from "@/components/GlobalLoading";
import TicketSearch from "./components/Tickets/TicketSearch";

function App() {
  return (
    <MainLayout>
      <TicketSearch />
    </MainLayout>
  );
}

export default withGlobalLoading(App);
