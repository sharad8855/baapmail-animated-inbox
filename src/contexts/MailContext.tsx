
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  starred: boolean;
  folder: string;
  read: boolean;
}

export interface User {
  username: string;
  email: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  signature: string;
  notifications: boolean;
  language: 'en' | 'mr' | 'hi';
}

interface MailState {
  user: User | null;
  mails: Mail[];
  currentFolder: string;
  selectedMail: Mail | null;
  isComposeOpen: boolean;
  isSettingsOpen: boolean;
  searchQuery: string;
  settings: Settings;
  filters: {
    unreadOnly: boolean;
    starredOnly: boolean;
    lastWeek: boolean;
  };
}

type MailAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_MAIL'; payload: Mail }
  | { type: 'UPDATE_MAIL'; payload: { id: string; updates: Partial<Mail> } }
  | { type: 'DELETE_MAIL'; payload: string }
  | { type: 'SET_CURRENT_FOLDER'; payload: string }
  | { type: 'SET_SELECTED_MAIL'; payload: Mail | null }
  | { type: 'TOGGLE_COMPOSE' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'UPDATE_FILTERS'; payload: Partial<MailState['filters']> }
  | { type: 'MARK_AS_READ'; payload: string };

const initialState: MailState = {
  user: null,
  mails: [],
  currentFolder: 'inbox',
  selectedMail: null,
  isComposeOpen: false,
  isSettingsOpen: false,
  searchQuery: '',
  settings: {
    theme: 'system',
    autoRefresh: true,
    signature: 'Sent from BAAP Mail',
    notifications: true,
    language: 'en',
  },
  filters: {
    unreadOnly: false,
    starredOnly: false,
    lastWeek: false,
  },
};

// Mock data
const mockMails: Mail[] = [
  {
    id: uuidv4(),
    from: 'welcome@baapmail.com',
    to: 'user@baapmail.com',
    subject: 'Welcome to BAAP Mail! 🎉',
    body: 'Thank you for choosing BAAP Mail - the most powerful email client. Explore all the features and enjoy seamless communication!',
    timestamp: new Date().toISOString(),
    starred: true,
    folder: 'inbox',
    read: false,
  },
  {
    id: uuidv4(),
    from: 'team@company.com',
    to: 'user@baapmail.com',
    subject: 'Project Update - Q4 Review',
    body: 'Here is the quarterly review document. Please review and provide your feedback by end of week.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    starred: false,
    folder: 'inbox',
    read: true,
  },
  {
    id: uuidv4(),
    from: 'newsletter@tech.com',
    to: 'user@baapmail.com',
    subject: 'Weekly Tech Newsletter',
    body: 'Latest updates in technology, AI, and software development. Don\'t miss these trending topics!',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    starred: false,
    folder: 'inbox',
    read: false,
  },
];

function mailReducer(state: MailState, action: MailAction): MailState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'ADD_MAIL':
      return { ...state, mails: [action.payload, ...state.mails] };
    case 'UPDATE_MAIL':
      return {
        ...state,
        mails: state.mails.map(mail =>
          mail.id === action.payload.id
            ? { ...mail, ...action.payload.updates }
            : mail
        ),
      };
    case 'DELETE_MAIL':
      return {
        ...state,
        mails: state.mails.filter(mail => mail.id !== action.payload),
        selectedMail: state.selectedMail?.id === action.payload ? null : state.selectedMail,
      };
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolder: action.payload, selectedMail: null };
    case 'SET_SELECTED_MAIL':
      return { ...state, selectedMail: action.payload };
    case 'TOGGLE_COMPOSE':
      return { ...state, isComposeOpen: !state.isComposeOpen };
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'MARK_AS_READ':
      return {
        ...state,
        mails: state.mails.map(mail =>
          mail.id === action.payload ? { ...mail, read: true } : mail
        ),
      };
    default:
      return state;
  }
}

const MailContext = createContext<{
  state: MailState;
  dispatch: React.Dispatch<MailAction>;
} | null>(null);

export const MailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mailReducer, {
    ...initialState,
    mails: mockMails,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('baapmail-settings');
    if (savedSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) });
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('baapmail-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!state.settings.autoRefresh || !state.user) return;

    const interval = setInterval(() => {
      // Simulate new mail
      const newMail: Mail = {
        id: uuidv4(),
        from: `user${Math.floor(Math.random() * 100)}@example.com`,
        to: state.user!.email,
        subject: `New Message - ${new Date().toLocaleTimeString()}`,
        body: 'This is a simulated auto-refresh email to demonstrate the real-time functionality.',
        timestamp: new Date().toISOString(),
        starred: false,
        folder: 'inbox',
        read: false,
      };
      dispatch({ type: 'ADD_MAIL', payload: newMail });
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [state.settings.autoRefresh, state.user]);

  return (
    <MailContext.Provider value={{ state, dispatch }}>
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
};
