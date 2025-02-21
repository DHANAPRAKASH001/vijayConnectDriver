import { useColorScheme } from 'react-native';
import { LIGHT_COLORS, DARK_COLORS, COMMON_COLORS } from '../constants/colors';

export const useThemeColors = () => {
  const theme = useColorScheme(); // Call useColorScheme as a function
  const themeColors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return {
    ...themeColors,
    ...COMMON_COLORS, // Add common colors that don’t change with theme
  };
};
