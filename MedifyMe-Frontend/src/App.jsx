import Home from "./pages/Home/Home";
import Health_history from "./pages/HealthHistory/HealthHistory";
import Error404 from "./components/Error404/Error404";
import Loading from "./components/Loading/Loading";
import SimpleRegister from "./pages/SimpleRegister/SimpleRegister";


import "./App.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Simplified router - only essential routes for hackathon
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/register" element={<SimpleRegister />} />
      <Route index element={<Home />} />
      <Route path="health_history" element={<Health_history />} />
      <Route path="loading" element={<Loading />} />
      <Route path="*" element={<Error404 />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;