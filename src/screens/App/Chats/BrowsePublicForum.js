import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import FirebasePublicForumChat from '../../../service/firebase_requests/PublicForumChat';
import FirebaseErrors from '../../../service/firebase_errors/';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Toast from '../../../components/Toast';
import SearchInput from '../../../components/Chat/SearchInput';
import BrowseForumTab from '../../../components/Chat/Public/BrowseForumTab';

const BrowsePublicForum = ({ navigation }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forums, setForums] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const onForums = (querySnapshot) => {
            setForums(
                querySnapshot.docs.map((forumSnapshot) => {
                    return { id: forumSnapshot.id, ...forumSnapshot.data() };
                }),
            );
        };
        const unsubscribe = FirebasePublicForumChat.getPublicForums(onForums, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        return unsubscribe;
    }, []);

    if (!forums)
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <SearchInput search={search} setSearch={setSearch} />
            </SafeAreaView>
        );

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <SearchInput search={search} setSearch={setSearch} />
            <FlatList
                keyExtractor={(item) => item.id}
                data={forums}
                renderItem={({ item }) => (
                    <BrowseForumTab navigation={navigation} forum={item} setError={setError} setLoading={setLoading} />
                )}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </SafeAreaView>
    );
};

export default BrowsePublicForum;

const styles = StyleSheet.create({});
