import React from "react";
import AppRoutes from "./routes";
import { StoreProviders } from "./redux/provider/Provider";
import { TicketFilterProvider } from "./context/ticketFilterValues";

const App = () => {
  return (
    <StoreProviders>
      <TicketFilterProvider>
        <AppRoutes />
      </TicketFilterProvider>
    </StoreProviders>
  );
}
export default App