import MainLayout from "@/components/MainLayout";
import {
  useGlobalLoading,
  withGlobalLoading,
} from "@/components/GlobalLoading";
import { Button } from "@skedulo/sked-ui";

function App() {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();
  const showLoader = () => {
    startGlobalLoading();
    setTimeout(() => {
      endGlobalLoading();
    }, 1000);
  };

  return (
    <MainLayout>
      <h1>Template Page</h1>
      <Button buttonType="primary" onClick={showLoader}>
        Show Loader
      </Button>
    </MainLayout>
  );
}

export default withGlobalLoading(App);
