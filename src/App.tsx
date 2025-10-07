// project import
import Routes from "../src/routes";

// auth-provider
import ThemeCustomization from "./themes";
import Locales from "./components/Locales";
import ScrollTop from "./components/ScrollTop";
import Snackbar from "./components/@extended/Snackbar";
import Notistack from "./components/third-party/Notistack";
import { JWTProvider as AuthProvider } from "./contexts/JWTContext";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <Locales>
      <ScrollTop>
        <AuthProvider>
          <>
            <Notistack>
              <Routes />
              <Snackbar />
            </Notistack>
          </>
        </AuthProvider>
      </ScrollTop>
    </Locales>
  </ThemeCustomization>
);

export default App;
