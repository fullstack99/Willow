import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { colors, fonts, emoji } from '../../constants';
import { POPULAR_PEOPLE_LIST } from '../../navigator/constants';
import ListHeader from './ListHeader';
import PopularPeople from '../PopularPeople';
const { width } = Dimensions.get('window').width;

class PopularPeopleList extends Component {
    componentDidMount() {}
    render() {
        return (
            <View style={styles.container}>
                <ListHeader
                    title={`popular people ${emoji.cool}`}
                    onPress={() => this.props.navigation.navigate(POPULAR_PEOPLE_LIST)}
                />

                <FlatList
                    horizontal={true}
                    keyExtractor={(item) => item.position.toString()}
                    data={this.props.product_list}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
                                <PopularPeople
                                    width={width * 0.6}
                                    singleKey={item.position}
                                    title={item.title}
                                    desc={item.unit_price}
                                    imageUrl={'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg'}
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    product_list: state.products.product_list,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PopularPeopleList);

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    itemContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 5,
    },
});
