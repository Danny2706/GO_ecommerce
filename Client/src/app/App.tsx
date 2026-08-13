import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { AppProvider } from "../store/AppContext";
import { AuthProvider } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import AppRoutes from "../routes";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}