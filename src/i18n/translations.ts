
export const translations = {
  en: {
    // Navigation
    compose: 'Compose',
    inbox: 'Inbox',
    starred: 'Starred',
    sent: 'Sent',
    drafts: 'Drafts',
    allMail: 'All Mail',
    spam: 'Spam',
    trash: 'Trash',
    scheduled: 'Scheduled',
    important: 'Important',
    archive: 'Archive',
    outbox: 'Outbox',
    templates: 'Templates',
    reports: 'Reports',
    settings: 'Settings',
    calendar: 'Calendar',
    
    // Login
    welcome: 'Welcome to BAAP Mail',
    username: 'Username',
    email: 'Email',
    login: 'Login',
    
    // Compose
    to: 'To',
    subject: 'Subject',
    body: 'Message',
    send: 'Send',
    
    // Settings
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    autoRefresh: 'Auto Refresh',
    signature: 'Default Signature',
    notifications: 'Notifications',
    language: 'Language',
    
    // Filters
    unreadOnly: 'Unread Only',
    starredOnly: 'Starred Only',
    lastWeek: 'Last 7 Days',
    
    // Actions
    back: 'Back',
    delete: 'Delete',
    search: 'Search mails...',
    
    // Toast messages
    mailSent: 'Mail sent successfully!',
    mailDeleted: 'Mail deleted',
    newMail: 'New mail received',
  },
  mr: {
    // Navigation (Marathi)
    compose: 'लिहा',
    inbox: 'इनबॉक्स',
    starred: 'तारांकित',
    sent: 'पाठवलेले',
    drafts: 'मसुदा',
    allMail: 'सर्व मेल',
    spam: 'स्पॅम',
    trash: 'कचरा',
    scheduled: 'नियोजित',
    important: 'महत्वाचे',
    archive: 'संग्रहालय',
    outbox: 'आउटबॉक्स',
    templates: 'टेम्प्लेट',
    reports: 'अहवाल',
    settings: 'सेटिंग्ज',
    calendar: 'कॅलेंडर',
    
    // Login
    welcome: 'BAAP मेल मध्ये आपले स्वागत आहे',
    username: 'वापरकर्ता नाव',
    email: 'ईमेल',
    login: 'लॉगिन',
    
    // Compose
    to: 'प्रति',
    subject: 'विषय',
    body: 'संदेश',
    send: 'पाठवा',
    
    // Settings
    theme: 'थीम',
    light: 'हळका',
    dark: 'गडद',
    system: 'सिस्टम',
    autoRefresh: 'ऑटो रिफ्रेश',
    signature: 'डिफॉल्ट स्वाक्षरी',
    notifications: 'अधिसूचना',
    language: 'भाषा',
    
    // Filters
    unreadOnly: 'फक्त न वाचलेले',
    starredOnly: 'फक्त तारांकित',
    lastWeek: 'गेले ७ दिवस',
    
    // Actions
    back: 'मागे',
    delete: 'हटवा',
    search: 'मेल शोधा...',
    
    // Toast messages
    mailSent: 'मेल यशस्वीरित्या पाठवले!',
    mailDeleted: 'मेल हटवले',
    newMail: 'नवा मेल आला',
  },
  hi: {
    // Navigation (Hindi)
    compose: 'लिखें',
    inbox: 'इनबॉक्स',
    starred: 'तारांकित',
    sent: 'भेजे गए',
    drafts: 'ड्राफ्ट',
    allMail: 'सभी मेल',
    spam: 'स्पैम',
    trash: 'कचरा',
    scheduled: 'निर्धारित',
    important: 'महत्वपूर्ण',
    archive: 'संग्रह',
    outbox: 'आउटबॉक्स',
    templates: 'टेम्प्लेट',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    calendar: 'कैलेंडर',
    
    // Login
    welcome: 'BAAP मेल में आपका स्वागत है',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    login: 'लॉगिन',
    
    // Compose
    to: 'को',
    subject: 'विषय',
    body: 'संदेश',
    send: 'भेजें',
    
    // Settings
    theme: 'थीम',
    light: 'हल्का',
    dark: 'डार्क',
    system: 'सिस्टम',
    autoRefresh: 'ऑटो रिफ्रेश',
    signature: 'डिफॉल्ट हस्ताक्षर',
    notifications: 'सूचनाएं',
    language: 'भाषा',
    
    // Filters
    unreadOnly: 'केवल अपठित',
    starredOnly: 'केवल तारांकित',
    lastWeek: 'पिछले 7 दिन',
    
    // Actions
    back: 'वापस',
    delete: 'हटाएं',
    search: 'मेल खोजें...',
    
    // Toast messages
    mailSent: 'मेल सफलतापूर्वक भेजा गया!',
    mailDeleted: 'मेल हटा दिया गया',
    newMail: 'नया मेल प्राप्त हुआ',
  },
};

export type TranslationKey = keyof typeof translations.en;
