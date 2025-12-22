/**
 * App.tsx
 *
 * Root component for The Boring App.
 * Simply renders the HomeScreen - there's only one screen.
 */

import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen />
    </>
  );
}
