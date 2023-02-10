import React, { Component } from 'react';
import { Dimensions, FlatList, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { connect } from 'react-redux';
import PopularPeople from '../../components/PopularPeople';
const { height, width } = Dimensions.get('window');

class PopularPeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                    <Text style={{ marginLeft: 20, fontFamily: fonts.NEWYORKEXTRALARGE_SEMIBOLD, fontSize: 24 }}>
                        Popular People {emoji.cool}
                    </Text>
                </View>
                <View style={{ padding: 8 }}>
                    <FlatList
                        //   horizontal = {true}
                        numColumns={1}
                        keyExtractor={(item) => item.position}
                        data={this.props.product_list}
                        renderItem={({ item }) => {
                            return (
                                <View
                                    key={item.position}
                                    style={{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}>
                                    <PopularPeople
                                        width={width * 0.47}
                                        singleKey={item.position}
                                        title={item.title}
                                        desc={item.unit_price}
                                        imageUrl={item.image}
                                    />
                                </View>
                            );
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = ({ products }) => {
    const { product_list } = products;
    return { product_list };
};

export default connect(mapStateToProps, null)(PopularPeopleList);
