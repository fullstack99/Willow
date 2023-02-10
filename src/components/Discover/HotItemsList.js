import React, { Component } from 'react';
import { Text, View, FlatList, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { colors, fonts, emoji } from '../../constants';
import { HOT_ITEMS_LIST } from '../../navigator/constants';
import { fetchHotItems } from '../../actions/productAction';
import ListHeader from './ListHeader';
import HotItem from '../HotItem';
const { width } = Dimensions.get('window').width;

class HotItemsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            items: [],
        };
    }
    componentDidMount() {
        this.props.fetchHotItems().finally(() => this.setState({ ...this.state, fetching: false }));
    }

    render() {
        return (
            <View style={styles.container}>
                <ListHeader title={`hot items ${emoji.fire}`} onPress={() => this.props.navigation.navigate(HOT_ITEMS_LIST)} />

                {this.state.fetching ? (
                    <ActivityIndicator size="large" animating />
                ) : (
                    <FlatList
                        horizontal={true}
                        keyExtractor={(item) => item.position.toString()}
                        data={this.props.hot_items}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return <HotItem data={item} navigation={this.props.navigation} />;
                        }}
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    hot_items: state.products.hot_items,
});

const mapDispatchToProps = {
    fetchHotItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(HotItemsList);

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
