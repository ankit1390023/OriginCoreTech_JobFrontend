import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appRouter } from "./routes/AppRoutes.jsx";
import MasterDataLoader from "./components/MasterDataLoader";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MasterDataLoader>
        <RouterProvider router={appRouter} />
      </MasterDataLoader>
    </QueryClientProvider>
  );
};

export default App;
