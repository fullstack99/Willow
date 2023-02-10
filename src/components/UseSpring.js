import { useEffect, useRef, useMemo } from "react";
import { Animated } from "react-native";



export function useSpring(value, config) {
  const animatedValue = useMemo(() => new Animated.Value(value.to), []);
  useEffect(() => {
    const animation = Animated.spring(animatedValue, {
      ...config,
      toValue: value.to,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [value.to]);
  return animatedValue;
}