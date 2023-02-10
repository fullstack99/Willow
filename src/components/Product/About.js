import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts, colors } from '../../constants';

const dummyDescription = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

const About = ({ product, show }) => {
    if (!show) return null;
    return (
        <View style={styles.container}>
            <Text style={styles.descriptionTitle}>description</Text>
            <Text style={styles.description}>{product?.description || product?.title}</Text>

            <Text style={styles.detailsTitle}>details</Text>
            {Array.isArray(product?.specifications) ? (
                product.specifications.map((s, index) => {
                    if (s?.name === 'Customer Reviews') return null;
                    else {
                        return (
                            <View key={index.toString()} style={styles.detailContainer}>
                                <Text
                                    style={[
                                        styles.detailText,
                                        { color: colors.DARKER_GREY, flex: 1, maxWidth: '70%', marginRight: 20 },
                                    ]}>
                                    {s?.name?.toLowerCase()}
                                </Text>
                                <Text style={[styles.detailText, { color: colors.BLACK }]}>{s?.value}</Text>
                            </View>
                        );
                    }
                })
            ) : (
                <React.Fragment>
                    <View style={styles.detailContainer}>
                        <Text style={[styles.detailText, { color: colors.DARKER_GREY }]}>brand</Text>
                        <Text style={[styles.detailText, { color: colors.BLACK }]}>{product?.brand || 'Stokkle'}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={[styles.detailText, { color: colors.DARKER_GREY }]}>selling website</Text>
                        <Text style={[styles.detailText, { color: colors.BLACK }]}>amazon.com</Text>
                    </View>
                </React.Fragment>
            )}
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        marginHorizontal: 20,
    },
    descriptionTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        paddingBottom: 20,
    },
    description: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        lineHeight: 22,
    },
    detailsTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        paddingVertical: 20,
    },
    detailContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    detailText: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        maxWidth: '70%',
    },
});
