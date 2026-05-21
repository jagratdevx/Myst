import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';
import Svg, { Rect, Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface BarChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
}

const Bar = React.memo(({ 
  val, 
  maxVal, 
  index, 
  barWidth, 
  chartHeight, 
  color, 
  spacing 
}: { 
  val: number; 
  maxVal: number; 
  index: number; 
  barWidth: number; 
  chartHeight: number; 
  color: string;
  spacing: number;
}) => {
  const barHeight = (val / maxVal) * chartHeight;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(index * 100, withTiming(1, { 
      duration: 1000, 
      easing: Easing.out(Easing.exp) 
    }));
  }, [val, maxVal]);

  const animatedProps = useAnimatedProps(() => ({
    height: barHeight * progress.value,
    y: chartHeight - (barHeight * progress.value),
  }));

  return (
    <AnimatedRect
      x={index * (barWidth + spacing)}
      width={barWidth}
      rx={6}
      fill={color}
      animatedProps={animatedProps}
    />
  );
});

export const AnimatedBarChart: React.FC<BarChartProps> = React.memo(({ 
  data, 
  labels, 
  height = 150, 
  color
}) => {
  const { colors } = useTheme();
  const barColor = color || colors.accent;
  const chartWidth = SCREEN_WIDTH - 80;
  const spacing = 10;
  const barWidth = (chartWidth - (spacing * (data.length - 1))) / (data.length || 1);
  const maxVal = useMemo(() => Math.max(...data, 1), [data]);

  return (
    <View style={[styles.container, { height: height + 40 }]}>
      <Svg width={chartWidth} height={height}>
        {data.map((val, i) => (
          <Bar 
            key={i} 
            val={val} 
            maxVal={maxVal} 
            index={i} 
            barWidth={barWidth} 
            chartHeight={height} 
            color={barColor}
            spacing={spacing}
          />
        ))}
      </Svg>
      <View style={[styles.labelArea, { width: chartWidth }]}>
        {labels.map((label, i) => (
          <Text key={i} style={[styles.label, { width: barWidth, color: colors.textSecondary }]}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
});

interface LineChartProps {
  data: number[];
  height?: number;
  color?: string;
}

export const AnimatedLineChart: React.FC<LineChartProps> = React.memo(({ 
  data, 
  height = 120, 
  color
}) => {
  const { colors } = useTheme();
  const lineColor = color || colors.accentSecondary;
  const chartWidth = SCREEN_WIDTH - 60;
  const maxVal = useMemo(() => Math.max(...data, 1), [data]);
  const stepX = chartWidth / Math.max(data.length - 1, 1);
  
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
  }, [data]);

  const d = useMemo(() => {
    const points = data.map((val, i) => ({
      x: i * stepX,
      y: height - (val / maxVal) * height,
    }));
    return points.reduce((acc, point, i) => {
      return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
    }, '');
  }, [data, height, stepX, maxVal]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 2000 * (1 - progress.value),
  }));

  return (
    <View style={{ height, width: chartWidth, marginTop: 10 }}>
      <Svg width={chartWidth} height={height}>
        <AnimatedPath
          d={d}
          fill="none"
          stroke={lineColor}
          strokeWidth={3}
          strokeDasharray={2000}
          strokeLinecap="round"
          strokeLinejoin="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
    alignItems: 'center',
  },
  labelArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

