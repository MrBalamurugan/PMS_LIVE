import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
// third-party
import useConfig from "../hooks/useConfig";
import { IntlProvider } from "react-intl";

// load locales files
const loadLocaleData = () => {
  return import("../utils/locales/en.json");
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }: PropsWithChildren) => {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    loadLocaleData().then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  if (!messages) return null;

  return (
    <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
};

Locales.propTypes = {
  children: PropTypes.node,
};

export default Locales;
