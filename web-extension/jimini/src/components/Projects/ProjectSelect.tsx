import { makeRequest } from "@/services/webRequest";
import { FormElementWrapper, FormLabel, SearchSelect } from "@skedulo/sked-ui";
import { useEffect, useState } from "react";
import { useGlobalLoading } from "../GlobalLoading";

interface ProjectSelectProps {
  onProjectChange?: (
    project: { label: string; value: string } | undefined
  ) => void;
  disable?: boolean;
}

function ProjectSelect({ onProjectChange, disable }: ProjectSelectProps = {}) {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<
    { label: string; value: string } | undefined
  >(undefined);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      startGlobalLoading();

      try {
        const response = await makeRequest({
          url: `listProjects`,
          method: "GET",
        });

        const data = await response.json();
        setProjects(data.issues || []);
        setTotal(data.total || 0);
        setError(data.error);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
        endGlobalLoading();
      }
    };

    fetchProjects();
  }, [startGlobalLoading, endGlobalLoading]);

  // Convert projects array to items format for SearchSelect
  const projectItems = projects.map((project) => ({
    label: project,
    value: project,
  }));

  // Set the first project as selected when projects are loaded
  useEffect(() => {
    if (projectItems.length > 0 && !selectedProject) {
      setSelectedProject(projectItems[0]);
    }
  }, [projectItems, selectedProject]);

  // Call the callback whenever selectedProject changes
  useEffect(() => {
    if (onProjectChange) {
      onProjectChange(selectedProject);
    }
  }, [selectedProject, onProjectChange]);

  return (
    <div>
      <FormElementWrapper size="large">
        <SearchSelect
          disabled={disable}
          icon="chevronDown"
          id="project"
          selectedItem={selectedProject}
          items={projectItems}
          name="project"
          onSelectedItemChange={(selected) => setSelectedProject(selected)}
          loading={loading}
        />
      </FormElementWrapper>
      {error && <div className="sk-text-error sk-mt-1">{error}</div>}
    </div>
  );
}

export default ProjectSelect;
