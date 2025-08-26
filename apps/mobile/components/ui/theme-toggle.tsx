import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme, ThemeMode } from '@/lib/theme/theme-context';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const themes: Array<{ value: ThemeMode; icon: string }> = [
    { value: 'light', icon: '☀️' },
    { value: 'dark', icon: '🌙' },
    { value: 'system', icon: '⚙️' },
  ];

  const handleThemeSelect = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    setModalVisible(false);
  };

  return (
    <>
      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.cogIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* Theme Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.themeOptions}>
              {themes.map((themeOption) => (
                <TouchableOpacity
                  key={themeOption.value}
                  style={[
                    styles.themeOption,
                    theme === themeOption.value && styles.activeThemeOption,
                  ]}
                  onPress={() => handleThemeSelect(themeOption.value)}
                >
                  <Text style={styles.themeIcon}>{themeOption.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cogIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 100,
    paddingRight: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  activeThemeOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  themeIcon: {
    fontSize: 24,
  },
});
