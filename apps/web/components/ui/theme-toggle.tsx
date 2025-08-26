"use client";

import { useState } from 'react';
import { Button } from "@acme/ui/components/button";
import { Settings } from "lucide-react";

interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const [showModal, setShowModal] = useState(false);

  const themes = [
    { value: 'light' as const, icon: '☀️', label: 'Light' },
    { value: 'dark' as const, icon: '🌙', label: 'Dark' },
    { value: 'system' as const, icon: '⚙️', label: 'System' },
  ];

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="w-11 h-11 rounded-full bg-[#2A2A2A]/80 border-[#4B5563] text-white hover:bg-[#36394A]/80"
        onClick={() => setShowModal(!showModal)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Theme Selection Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-[#2A2A2A] rounded-lg shadow-xl border border-[#4B5563] p-4 min-w-[200px]">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Choose Theme
            </h3>
            <div className="space-y-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    theme === themeOption.value
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'hover:bg-[#36394A]'
                  }`}
                  onClick={() => {
                    onThemeChange(themeOption.value);
                    setShowModal(false);
                  }}
                >
                  <span className="text-lg mr-3">{themeOption.icon}</span>
                  <span className={`font-medium ${
                    theme === themeOption.value
                      ? 'text-blue-300'
                      : 'text-gray-300'
                  }`}>
                    {themeOption.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
