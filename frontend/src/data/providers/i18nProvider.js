import messages from "../../i18n/en/en";
import messages_jm from "../../i18n/jm/en";
import messages_ug from "../../i18n/ug/en";
import messages_mzb from "../../i18n/mzb/en";
import { getApplicationConfig } from "../../constants/config";
import polyglotI18nProvider from "ra-i18n-polyglot";

const config = getApplicationConfig();

export default polyglotI18nProvider((locale) => {
  if (config && config.application_config)
    switch (config.application_config.prefix) {
      case "jm":
        return messages_jm;
      case "ug":
        return messages_ug;
      case "mzb":
        return messages_mzb;

      default:
        return messages;
    }
}, "en");
