import { createBrowserRouter } from 'react-router'
import SplashPage from '../pages/SplashPage'
import OnboardingPage from '../pages/OnboardingPage'
import AuthPage from '../pages/AuthPage'
import AppLayout from '../layouts/AppLayout'
import FeedPage from '../pages/FeedPage'
import ExplorePage from '../pages/ExplorePage'
import SearchPage from '../pages/SearchPage'
import CreatePage from '../pages/CreatePage'
import ActivityPage from '../pages/ActivityPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import ChatListPage from '../pages/ChatListPage'
import ChatPage from '../pages/ChatPage'
import CallPage from '../pages/CallPage'

export const router = createBrowserRouter([
 { path: '/', Component: AuthPage },
  { path: '/onboarding',  Component: OnboardingPage },
  { path: '/auth',        Component: AuthPage },
  {
    path: '/app',
    Component: AppLayout,
    children: [
      { path: 'home',          Component: FeedPage },
      { path: 'explore',       Component: ExplorePage },
      { path: 'search',        Component: SearchPage },
      { path: 'create',        Component: CreatePage },
      { path: 'activity',      Component: ActivityPage },
      { path: 'profile',       Component: ProfilePage },
      { path: 'settings',      Component: SettingsPage },
      { path: 'messages',      Component: ChatListPage },
      { path: 'messages/:id',  Component: ChatPage },
      { path: 'call/:id',      Component: CallPage },
    ],
  },
])
