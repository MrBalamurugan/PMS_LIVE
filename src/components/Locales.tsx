import PropTypes from "prop-types";
import { useEffect, useState, type PropsWithChildren } from "react";
import useConfig from "../hooks/useConfig";
import { IntlProvider as BaseIntlProvider } from "react-intl";

// ✅ Extend type to support children properly
const IntlProvider = BaseIntlProvider as unknown as React.FC<
  React.ComponentProps<typeof BaseIntlProvider> & { children?: React.ReactNode }
>;

// load locales files
const loadLocaleData = async () => {
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
    <IntlProvider locale={i18n || "en"} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
};

Locales.propTypes = {
  children: PropTypes.node,
};

export default Locales;
