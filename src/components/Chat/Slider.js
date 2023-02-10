import React, { useState } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Dimensions } from 'react-native';

import CircleSvg from '../../assets/Images/circle.svg';
import customLabel from './customLabel';
import { colors } from '../../constants';
const { width } = Dimensions.get('window');

const Slider = ({ min, max, handleValues }) => {
    const [multiSliderValue, setMultiSliderValue] = useState([min, max]);

    const multiSliderValuesChange = (values) => {
        setMultiSliderValue(values);
        handleValues(values);
    };

    const customMarker = () => {
        return <CircleSvg />;
    };

    return (
        <>
            <MultiSlider
                values={[multiSliderValue[0], multiSliderValue[1]]}
                sliderLength={width - 40}
                onValuesChange={multiSliderValuesChange}
                min={0}
                max={100}
                step={1}
                allowOverlap={false}
                snapped
                smoothSnapped
                customMarker={customMarker}
                customLabel={customLabel}
                selectedStyle={{
                    backgroundColor: colors.PRIMARY_COLOR,
                }}
                unselectedStyle={{
                    backgroundColor: colors.GREEN_2,
                }}
            />
            {/* <Text style={{ width: 50, textAlign: 'center', left: -100 }}>{Math.floor(multiSliderValue[1])}</Text>
            <Text style={{ width: 50, textAlign: 'center', left: (multiSliderValue[0] * (width - 280)) / 100 - 15 }}>
                {Math.floor(multiSliderValue[0])}
            </Text> */}
        </>
    );
};

export default Slider;
