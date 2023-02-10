import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { colors, emoji, fonts } from '../../constants';
import Button from '../../components/Button';
import { TabBar } from '../../components/Tabbar';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Picker } from '@react-native-picker/picker';
const { height } = Dimensions.get('window');
class Selection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: {},
            gender: '',
        };
    }

    componentDidMount() {}

    selectExperience(role) {
        let temp = this.state.selected;
        if (!temp[role]) {
            temp[role] = role;
            console.log(temp);
            this.setState({ selected: temp });
        } else {
            delete temp[role];
            this.setState({ selected: temp });
        }
    }

    setSelectionInUser() {
        let { user } = this.props;
        user['parental_status'] = Object.values(this.state.selected);
        if (Object.keys(this.state.selected).length < 2 && this.state.selected['Planning']) {
            this.props.navigation.navigate('AboutYourself');
        } else if (this.state.selected['Expecting'] && this.state.selected['Parent']) {
            this.props.navigation.navigate('AboutDone', {
                selected: this.state.selected,
            });
            // this.RBSheet.open()
        } else if (this.state.selected['Expecting']) {
            this.props.navigation.navigate('AboutDone', {
                selected: this.state.selected,
            });
        } else if (Object.keys(this.state.selected).length < 2 && this.state.selected['Parent']) {
            this.props.navigation.navigate('AboutChild', {
                selected: this.state.selected,
            });
        }
    }

    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ flex: 1, width: '70%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: fonts.NEWYORKLARGE_MEDIUM, fontSize: 22, textAlign: 'center' }}>
                                what stage(s) are you at?
                            </Text>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                            <TouchableOpacity
                                style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.selectExperience('Planning')}>
                                <ImageBackground
                                    source={
                                        this.state.selected['Planning']
                                            ? require('../../assets/Images/full.png')
                                            : require('../../assets/Images/empty.png')
                                    }
                                    resizeMode={'contain'}
                                    style={{ resizeMode: 'cover', justifyContent: 'center', width: 350, height: 120 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text
                                            style={{ color: colors.PRIMARY_COLOR, fontFamily: fonts.MULISH_BOLD, fontSize: 25 }}>
                                            {emoji.redHeart}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.BLACK,
                                                fontFamily: fonts.NEWYORKMEDIUM_SEMIBOLD,
                                                fontSize: 15,
                                            }}>
                                            planning
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.selectExperience('Expecting')}>
                                <ImageBackground
                                    source={
                                        this.state.selected['Expecting']
                                            ? require('../../assets/Images/full.png')
                                            : require('../../assets/Images/empty.png')
                                    }
                                    resizeMode={'contain'}
                                    style={{ resizeMode: 'cover', justifyContent: 'center', width: 350, height: 120 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text
                                            style={{ color: colors.PRIMARY_COLOR, fontFamily: fonts.MULISH_BOLD, fontSize: 25 }}>
                                            {emoji.egg}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.BLACK,
                                                fontFamily: fonts.NEWYORKMEDIUM_SEMIBOLD,
                                                fontSize: 15,
                                            }}>
                                            expecting
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.selectExperience('Parent')}>
                                <ImageBackground
                                    source={
                                        this.state.selected['Parent']
                                            ? require('../../assets/Images/full.png')
                                            : require('../../assets/Images/empty.png')
                                    }
                                    resizeMode={'contain'}
                                    style={{ resizeMode: 'cover', justifyContent: 'center', width: 350, height: 120 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text
                                            style={{ color: colors.PRIMARY_COLOR, fontFamily: fonts.MULISH_BOLD, fontSize: 25 }}>
                                            {emoji.duck}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.BLACK,
                                                fontFamily: fonts.NEWYORKMEDIUM_SEMIBOLD,
                                                fontSize: 15,
                                            }}>
                                            parent
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'flex-end' }}>
                        <Button
                            text="confirm"
                            height={height * 0.08}
                            disabled={Object.keys(this.state.selected).length < 1 ? true : false}
                            onPress={() => this.setSelectionInUser()}
                        />
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    const { user } = auth;
    return { user };
};
export default connect(mapStateToProps, null)(Selection);
