
import { useMail } from '../contexts/MailContext';
import { translations, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
  const { state } = useMail();
  
  const t = (key: TranslationKey): string => {
    return translations[state.settings.language][key] || translations.en[key];
  };
  
  return { t };
};
