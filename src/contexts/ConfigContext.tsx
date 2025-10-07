import PropTypes from "prop-types";
import { createContext } from "react";

// project import

import useLocalStorage from "../hooks/useLocalStorage";
import config from "../config";

type Config = {
  themeDirection: "ltr" | "rtl";
  mode: "light" | "dark";
  presetColor: string;
  fontFamily: string;
  container?: boolean;
  i18n?: string;
  miniDrawer?: boolean;
  menuOrientation?: string;

  // actions
  onChangeContainer: () => void;
  onChangeLocalization: (lang: string) => void;
  onChangeMode: (mode: "light" | "dark") => void;
  onChangePresetColor: (theme: string) => void;
  onChangeDirection: (direction: "ltr" | "rtl") => void;
  onChangeMiniDrawer: (miniDrawer: boolean) => void;
  onChangeMenuOrientation: (layout: string) => void;
  onChangeFontFamily: (fontFamily: string) => void;
};
// initial state
const initialState: Config = {
  ...config,
  themeDirection: "ltr",
  mode: "light",
  presetColor: "default",
  fontFamily: "'Roboto', sans-serif",

  onChangeContainer: () => {},
  onChangeLocalization: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeDirection: () => {},
  onChangeMiniDrawer: () => {},
  onChangeMenuOrientation: () => {},
  onChangeFontFamily: () => {},
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext<Config>(initialState);

function ConfigProvider({ children }: any) {
  const [config, setConfig] = useLocalStorage(
    "mantis-react-js-config",
    initialState
  );

  const onChangeContainer = () => {
    setConfig({
      ...config,
      container: !config.container,
    });
  };

  const onChangeLocalization = (lang: any) => {
    setConfig({
      ...config,
      i18n: lang,
    });
  };

  const onChangeMode = (mode: any) => {
    setConfig({
      ...config,
      mode,
    });
  };

  const onChangePresetColor = (theme: any) => {
    setConfig({
      ...config,
      presetColor: theme,
    });
  };

  const onChangeDirection = (direction: any) => {
    setConfig({
      ...config,
      themeDirection: direction,
    });
  };

  const onChangeMiniDrawer = (miniDrawer: any) => {
    setConfig({
      ...config,
      miniDrawer,
    });
  };

  const onChangeMenuOrientation = (layout: any) => {
    setConfig({
      ...config,
      menuOrientation: layout,
    });
  };

  const onChangeFontFamily = (fontFamily: any) => {
    setConfig({
      ...config,
      fontFamily,
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeFontFamily,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.propTypes = {
  children: PropTypes.node,
};

export { ConfigProvider, ConfigContext };
