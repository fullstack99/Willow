import React, { Component } from 'react';
import { Dimensions, ImageBackground, StatusBar } from 'react-native';
const { height, width } = Dimensions.get("window");


class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
     

        };
    }
    navigationOptions = {
        header: null
    }

    async UNSAFE_componentWillMount() {
        StatusBar.setHidden(true);
    }

    async componentWillUnmount() {
        StatusBar.setHidden(false);
    }

    renderSplashOrIndicator = () => {
        return (
            <ImageBackground source={require('../assets/Images/splash.png')} style={{width: width,
                height: height}}>
            </ImageBackground>
        )
    }


    render() {
        return (

            this.renderSplashOrIndicator()
        );
    }
}



export default Splash;