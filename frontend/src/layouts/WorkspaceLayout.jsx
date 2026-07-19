import { Outlet } from "react-router-dom";
import { DocumentsProvider } from "../context/DocumentsContext";
import Sidebar from "../components/workspace/Sidebar";
import Topbar from "../components/workspace/Topbar";

export default function WorkspaceLayout() {
  return (
    <DocumentsProvider>
      <div className="h-screen w-full flex bg-slate-950 text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DocumentsProvider>
  );
}
