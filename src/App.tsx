import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Chat } from "./components/Chat";
import { Kanban } from "./components/Kanban";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      <div className="flex h-screen w-screen overflow-hidden text-slate-50 bg-slate-950 font-sans">
        {/* Left Sidebar: Chat */}
        <Chat />

        {/* Main Content: Kanban */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-950/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-6 text-sm font-medium text-slate-400">Agent Workspace / v1.0</span>
          </header>
          
          <Kanban />
        </main>
      </div>
    </ConvexProvider>
  );
}

export default App;
