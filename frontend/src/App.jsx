import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import Chat from "./pages/workspace/Chat";
import SmartSearch from "./pages/workspace/SmartSearch";
import Summary from "./pages/workspace/Summary";
import Dashboard from "./pages/workspace/Dashboard";
import Formulas from "./pages/workspace/Formulas";
import KnowledgeGraph from "./pages/workspace/KnowledgeGraph";
import Compare from "./pages/workspace/Compare";
import Report from "./pages/workspace/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/workspace" element={<WorkspaceLayout />}>
          <Route index element={<Chat />} />
          <Route path="search" element={<SmartSearch />} />
          <Route path="summary" element={<Summary />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="formulas" element={<Formulas />} />
          <Route path="graph" element={<KnowledgeGraph />} />
          <Route path="compare" element={<Compare />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
