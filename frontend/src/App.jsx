import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import ScrollToTop from "./components/ScrollToTop";

function App() {

  return (

    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>

  );

}

export default App;