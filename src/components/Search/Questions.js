import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors';
import PostCard from '../../components/Profile/PostCard';

const Questions = ({ navigation, user, visible, setSearch, searchTerm, searchTrigger, setError, loading, setLoading }) => {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [nbPages, setNBPages] = useState(0);

    useEffect(() => {
        if (visible && searchTerm.length > 0) {
            setLoading(true);
            FirebaseFeed.getQuestionsByName(searchTerm, 0)
                .then((res) => {
                    const { data } = res;
                    setQuestions(
                        data.hits.map((h) => {
                            return { id: h.objectID, ...h };
                        }),
                    );
                    setPage(data.page);
                    setNBPages(data.nbPages);
                })
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        } else {
            setQuestions([]);
        }
    }, [setQuestions, visible, searchTrigger]);

    const onEndReached = () => {
        if (searchTerm.length > 0 && page < nbPages && !loading) {
            FirebaseFeed.getQuestionsByName(searchTerm, page + 1)
                .then((res) => {
                    const { data } = res;
                    setQuestions([
                        ...questions,
                        ...data.hits.map((h) => {
                            return { id: h.objectID, ...h };
                        }),
                    ]);
                    setPage(data.page);
                })
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    };

    if (!visible) return null;
    return (
        <FlatList
            data={questions}
            initialNumToRender={5}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingBottom: 80, marginHorizontal: 5 }}
            renderItem={({ item }) => <PostCard navigation={navigation} item={item} />}
            onEndReachedThreshold={0.016}
            onEndReached={onEndReached}
        />
    );
};

Questions.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    setSearch: PropTypes.func,
    searchTerm: PropTypes.string.isRequired,
    searchTrigger: PropTypes.bool,
    setError: PropTypes.func,
    loading: PropTypes.bool,
    setLoading: PropTypes.func,
};

export default Questions;

const styles = StyleSheet.create({});
