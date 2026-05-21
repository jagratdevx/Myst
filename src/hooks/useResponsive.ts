import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 375;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  const scaleSize = (size: number) => {
    if (isTablet) return size * 1.2;
    if (isSmallScreen) return size * 0.9;
    return size;
  };

  return {
    width,
    height,
    isSmallScreen,
    isTablet,
    isLandscape,
    scaleSize,
    contentPadding: isTablet ? 40 : 20,
    gridCols: isTablet ? 3 : 2,
  };
};
