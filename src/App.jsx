import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes/AppRoutes.jsx";


const App = () => {
  return <RouterProvider router={appRouter} />;
};
export default App;
