import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes/approutes.jsx";


const App = () => {
  return <RouterProvider router={appRouter} />;
};
export default App;
