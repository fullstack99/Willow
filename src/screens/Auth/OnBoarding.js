import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'athar-react-native-appslider';
import { connect } from 'react-redux';
import { colors, fonts } from '../../constants';
import Button from '../../components/Button';
import { skipOnboarding } from '../../actions/authActions';

const slides = [
    {
        key: 1,
        title: 'next',
        pagination: require('../../assets/Images/1st.png'),
        text: 'parenting takes a village 🛠️',
        description: 'use willow to build your community \n of like-minded parents',
        image: require('../../assets/Images/slider1.png'),
        backgroundColor: '#59b2ab',
        value: 'first',
    },
    {
        key: 2,
        title: 'next',
        text: 'share products 👍',
        pagination: require('../../assets/Images/2nd.png'),
        description: 'make your list of favorite products \nand leave helpful reviews',
        image: require('../../assets/Images/slider2.png'),
        backgroundColor: '#febe29',
        value: 'second',
    },
    {
        key: 3,
        title: 'next',
        text: 'view and buy products 🔍',
        pagination: require('../../assets/Images/3rd.png'),
        description: 'search popular products and\n purchase them online',
        image: require('../../assets/Images/slider3.png'),
        backgroundColor: '#22bcb5',
        value: 'third',
    },
    {
        key: 4,
        title: `let's start`,
        text: 'answers and tips ❤️',
        pagination: require('../../assets/Images/4th.png'),
        description: 'ask questions and get advice from your \nparenting community and experts',
        image: require('../../assets/Images/slider4.png'),
        backgroundColor: '#22bcb5',
        value: 'last',
    },
];

const OnBoarding = ({ skipOnboarding }) => {
    const slider = useRef();

    const onNextPress = (item, index) => {
        item?.value && item.value === 'last' ? skipOnboarding() : slider.current.goToSlide(index + 1, true);
    };

    const _renderItem = ({ item, index }) => {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.barContainer}>
                        <Image source={item.pagination} style={{ width: '35%' }} resizeMode={'contain'} />
                    </View>
                    {item.value !== 'last' && (
                        <TouchableOpacity style={styles.skipOrDoneButton} onPress={skipOnboarding}>
                            <Text style={styles.skipOrDoneButtonText}>skip</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Image source={item.image} style={{ width: '100%', height: '100%', flex: 1 }} resizeMode={'contain'} />

                <Text style={styles.content}>{item.text}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <Button width="90%" onPress={() => onNextPress(item, index)}>
                    {item.title}
                </Button>
            </SafeAreaView>
        );
    };

    return (
        <AppIntroSlider
            renderPagination={false}
            activeDotStyle
            ref={slider}
            renderItem={_renderItem}
            data={slides}
            keyExtractor={(item) => item.key.toString()}
        />
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    skipOnboarding,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
    },
    skipOrDoneButton: {
        position: 'absolute',
        right: 20,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipOrDoneButtonText: {
        color: colors.PRIMARY_COLOR,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    content: {
        color: colors.Black,
        fontSize: 24,
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        textAlign: 'center',
        marginVertical: 20,
    },
    description: {
        color: colors.Black,
        fontSize: 15,
        fontFamily: fonts.MULISH_REGULAR,
        textAlign: 'center',
        marginVertical: 30,
    },
});
