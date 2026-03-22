// ─── Global Fetch Mock ──────────────────────────────────────────────────────
require('jest-fetch-mock').enableMocks();

// ─── Silence React Native logs in tests ──────────────────────────────────
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// ─── Mock AsyncStorage ──────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// ─── Mock react-native-safe-area-context ─────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// ─── Mock expo-status-bar ────────────────────────────────────────────────
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// ─── Mock react-native-toast-message ─────────────────────────────────────
jest.mock('react-native-toast-message', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: () => null,
    show: jest.fn(),
    hide: jest.fn(),
  };
});

// ─── Mock @expo/vector-icons ────────────────────────────────────────────
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

// ─── Mock @react-navigation ────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      replace: mockReplace,
      reset: mockReset,
    }),
    useRoute: () => ({ params: {} }),
    NavigationContainer: ({ children }) => children,
  };
});

global.mockNavigate = mockNavigate;
global.mockGoBack = mockGoBack;
global.mockReplace = mockReplace;
global.mockReset = mockReset;
