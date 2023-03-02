import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Article from "./pages/Article";
import Dashboard from "./pages/Dashboard";
import Education from "./pages/Education";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import Schedule from "./pages/Schedule";
import SignIn from "./pages/SignIn";
import TradeIdeas from "./pages/TradeIdeas";
import ProtectedRoutes from "./ProctedRoutes";
import Livecall from "./pages/Live-call";
function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/education" element={<Education />} />
          <Route path="/trade" element={<TradeIdeas />} />
          <Route path="/resource" element={<Resources />} />
          <Route path="/article" element={<Article />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/live-call" element={<Livecall />} />

        </Route>
      </Route>
      <Route path="/login" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
