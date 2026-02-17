import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, GripVertical, CheckCircle2, Clock, Circle } from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "To Do", icon: Circle, color: "text-slate-400" },
  { id: "in-progress", title: "In Progress", icon: Clock, color: "text-yellow-400" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-green-400" },
] as const;

export function Kanban() {
  const tasks = useQuery(api.tasks.list) || [];
  const addTask = useMutation(api.tasks.add);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle, status: "todo" });
    setNewTaskTitle("");
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Project Board</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a task..."
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded p-1 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 min-w-[800px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <col.icon size={18} className={col.color} />
              <h3 className="font-medium text-slate-300">{col.title}</h3>
              <span className="ml-auto text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tasks
                .filter((t) => t.status === col.id)
                .map((task) => (
                  <div
                    key={task._id}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-sm group hover:border-slate-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical size={16} className="text-slate-700 mt-1 cursor-grab" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{task.title}</p>
                        <div className="mt-4 flex gap-2">
                          {COLUMNS.filter(c => c.id !== col.id).map(c => (
                            <button
                              key={c.id}
                              onClick={() => updateStatus({ id: task._id, status: c.id })}
                              className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hover:text-blue-400 transition-colors"
                            >
                              Move to {c.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
