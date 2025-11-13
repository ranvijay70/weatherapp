/**
 * Settings Page - Refactored with MVVM pattern and Glassmorphism
 */

'use client';

import { useRouter } from 'next/navigation';
import { useSettingsViewModel } from '@/src/viewmodels/settings.viewmodel';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import AppBar from '@/components/AppBar';
import { COLORS, TYPOGRAPHY, LAYOUT, GLASSMORPHISM } from '@/src/utils/theme';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSetting } = useSettingsViewModel();

  const handleSave = () => {
    // Settings are saved automatically via updateSetting
    // Navigate back to home page
    router.push('/');
  };

  return (
    <main className={`min-h-screen ${LAYOUT.containerPadding} ${COLORS.bgGradient}`}>
      <div className={`${LAYOUT.containerMaxWidthSmall} mx-auto`}>
        <div className={`mb-6 sm:mb-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <h1 className={`${TYPOGRAPHY.heading1} ${COLORS.textPrimary} drop-shadow-lg text-center sm:text-left`}>
              Settings
            </h1>
            <div className="w-full sm:w-auto">
              <AppBar />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Temperature Unit */}
          <Card hover className="hover:bg-white/15 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className={`${TYPOGRAPHY.heading2} ${COLORS.textPrimary} mb-3 flex items-center gap-2`}>
                  Temperature Unit
                </h2>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="temperatureUnit"
                      value="metric"
                      checked={settings.temperatureUnit === 'metric'}
                      onChange={(e) => updateSetting('temperatureUnit', e.target.value as 'metric' | 'imperial')}
                      className="sr-only peer"
                    />
                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3 ${GLASSMORPHISM.roundedSmall} border-2 ${GLASSMORPHISM.transitionFast} peer-checked:border-blue-500 peer-checked:bg-blue-500/20 ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover}`}>
                      <span className={`${COLORS.textPrimary} font-medium text-sm sm:text-base`}>Celsius (°C)</span>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="temperatureUnit"
                      value="imperial"
                      checked={settings.temperatureUnit === 'imperial'}
                      onChange={(e) => updateSetting('temperatureUnit', e.target.value as 'metric' | 'imperial')}
                      className="sr-only peer"
                    />
                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3 ${GLASSMORPHISM.roundedSmall} border-2 ${GLASSMORPHISM.transitionFast} peer-checked:border-blue-500 peer-checked:bg-blue-500/20 ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover}`}>
                      <span className={`${COLORS.textPrimary} font-medium text-sm sm:text-base`}>Fahrenheit (°F)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Theme */}
          <Card hover className="hover:bg-white/15 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className={`${TYPOGRAPHY.heading2} ${COLORS.textPrimary} mb-3 flex items-center gap-2`}>
                  Theme
                </h2>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light' | 'auto')}
                      className="sr-only peer"
                    />
                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3 ${GLASSMORPHISM.roundedSmall} border-2 ${GLASSMORPHISM.transitionFast} peer-checked:border-purple-500 peer-checked:bg-purple-500/20 ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover}`}>
                      <span className={`${COLORS.textPrimary} font-medium text-sm sm:text-base`}>🌙 Dark</span>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light' | 'auto')}
                      className="sr-only peer"
                    />
                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3 ${GLASSMORPHISM.roundedSmall} border-2 ${GLASSMORPHISM.transitionFast} peer-checked:border-purple-500 peer-checked:bg-purple-500/20 ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover}`}>
                      <span className={`${COLORS.textPrimary} font-medium text-sm sm:text-base`}>☀️ Light</span>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={settings.theme === 'auto'}
                      onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light' | 'auto')}
                      className="sr-only peer"
                    />
                    <div className={`px-4 py-2.5 sm:px-5 sm:py-3 ${GLASSMORPHISM.roundedSmall} border-2 ${GLASSMORPHISM.transitionFast} peer-checked:border-purple-500 peer-checked:bg-purple-500/20 ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover}`}>
                      <span className={`${COLORS.textPrimary} font-medium text-sm sm:text-base`}>🔄 Auto</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Auto Location */}
          <Card hover className="hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className={`${TYPOGRAPHY.heading2} ${COLORS.textPrimary} mb-1`}>Auto-load Location</h2>
                  <p className={`text-sm sm:text-base ${COLORS.textTertiary} leading-relaxed`}>
                    Automatically show weather for your current location on app open
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.autoLocation}
                  onChange={(e) => updateSetting('autoLocation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 shadow-lg"></div>
              </label>
            </div>
          </Card>

          {/* Notifications */}
          <Card hover className="hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className={`${TYPOGRAPHY.heading2} ${COLORS.textPrimary} mb-1`}>Weather Notifications</h2>
                  <p className={`text-sm sm:text-base ${COLORS.textTertiary} leading-relaxed`}>
                    Receive alerts for severe weather conditions
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/50 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-yellow-600 shadow-lg"></div>
              </label>
            </div>
          </Card>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              onClick={handleSave}
              fullWidth
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Settings
              </span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
