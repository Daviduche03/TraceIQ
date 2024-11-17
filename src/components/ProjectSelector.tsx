import React, { useEffect, useState } from "react";
import { ChevronDown, Boxes } from "lucide-react";
import { useProjectStore } from "../stores/useProjectStore";

export function ProjectSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { projects, selectedProject, fetchProjects, selectProject } =
    useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectSelect = (project: typeof selectedProject) => {
    if (project) {
      selectProject(project);
    }
    setIsOpen(false);
  };

  if (!selectedProject) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] transition-colors"
      >
        <Boxes className="w-5 h-5 text-indigo-500" />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white">
            {selectedProject.name}
          </p>
          <p className="text-xs text-gray-400">{selectedProject.environment}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className="w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <p className="text-sm font-medium text-white">{project.name}</p>
              <p className="text-xs text-gray-400">{project.environment}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
