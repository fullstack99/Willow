import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors/';
import TrendingTip from '../TrendingTip';
const { width, height } = Dimensions.get('window');

const Tips = ({ navigation, user, visible, setError }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        user.uid &&
            FirebaseFeed.getTipsByUser(user.uid)
                .then(setItems)
                .catch((error) => FirebaseErrors.setError(error, setError));
    }, [visible, user.uid]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                numColumns={2}
                initialNumToRender={6}
                contentContainerStyle={{ paddingBottom: 80 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TrendingTip
                        data={item}
                        navigation={navigation}
                        style={styles.itemContainer}
                        width={width * 0.45}
                        height={250}
                    />
                )}
            />
        </View>
    );
};

Tips.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    visible: PropTypes.bool,
};

export default Tips;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    itemContainer: {
        paddingHorizontal: 5,
        marginRight: 0,
    },
});
