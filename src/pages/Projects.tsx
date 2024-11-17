import React, { useState, useEffect } from 'react';
import { Plus, Folder, ChevronRight, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../stores/useProjectStore';
import { useToast } from '../hooks/useToast';

export function Projects() {
  const { projects, fetchProjects, createProject } = useProjectStore();
  const { addToast } = useToast();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', environment: 'Production' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.name) return;
    
    setIsCreating(true);
    try {
      await createProject({
        name: newProject.name,
        environment: newProject.environment as 'Production' | 'Staging' | 'Development'
      });
      
      setShowNewProjectModal(false);
      setNewProject({ name: '', environment: 'Production' });
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Project created successfully'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create project'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-gray-400">Manage your error tracking projects</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
          <p className="text-gray-400 mb-4">Create your first project to start tracking errors</p>
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#3a3a3a] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#2a2a2a] rounded-lg">
                    <Folder className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{project.name}</h2>
                    <p className="text-sm text-gray-400">Environment: {project.environment}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/errors?projectId=${project.id}`}
                    className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  <Link
                    to={`/settings?projectId=${project.id}`}
                    className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-semibold text-white">Create New Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Environment
                </label>
                <select
                  value={newProject.environment}
                  onChange={(e) => setNewProject({ ...newProject, environment: e.target.value })}
                  className="w-full bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-[#2a2a2a] space-x-4">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProject.name || isCreating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}