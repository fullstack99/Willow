import React, { useRef } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import SelectPhotoBackground from '../../assets/Images/Create/select_photo_background.png';
import CameraIcon from '../../assets/Images/upload.png';
import DeleteIcon from '../../assets/Images/delete.png';
import ChoosePhotoDialog from '../Dialogs/ChoosePhotoDialog';

const { width } = Dimensions.get('window');

const SelectPhotoSection = ({ photo, setPhoto, data }) => {
    const choosePhotoRef = useRef();

    const openPhotoPicker = () => {
        Keyboard.dismiss();
        choosePhotoRef.current && choosePhotoRef.current.open();
    };

    const deletePhoto = () => setPhoto(null);

    return (
        <React.Fragment>
            {photo ? (
                <TouchableOpacity onPress={openPhotoPicker}>
                    <FastImage source={{ uri: photo }} resizeMode="stretch" style={styles.photo}>
                        {data?.type === DATABASE_CONSTANTS.QUESTIONS && (
                            <TouchableOpacity style={styles.delete} onPress={deletePhoto}>
                                <FastImage source={DeleteIcon} style={{ width: '100%', height: '100%' }} />
                            </TouchableOpacity>
                        )}
                    </FastImage>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={openPhotoPicker}>
                    <ImageBackground source={SelectPhotoBackground} resizeMode="contain" style={styles.photoBackground}>
                        <TouchableOpacity style={styles.camera}>
                            <FastImage source={CameraIcon} style={{ width: '100%', height: '100%' }} />
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
            )}

            <ChoosePhotoDialog
                forwardRef={choosePhotoRef}
                photo={photo}
                onPhotoClick={setPhoto}
                imagePickerOptions={{ width: width * 0.65, aspectRatio: 1.2 }}
            />
        </React.Fragment>
    );
};

SelectPhotoSection.propTypes = {
    photo: PropTypes.string,
    setPhoto: PropTypes.func.isRequired,
};

export default SelectPhotoSection;

const styles = StyleSheet.create({
    photoBackground: {
        width: width * 0.65,
        aspectRatio: 1.2,
        marginVertical: 20,
        alignSelf: 'center',
    },
    photo: {
        width: width * 0.65,
        aspectRatio: 1.2,
        borderRadius: 30,
        marginVertical: 20,
        alignSelf: 'center',
    },
    camera: {
        position: 'absolute',
        height: 40,
        width: 40,
        bottom: 10,
        right: 0,
    },
    delete: {
        position: 'absolute',
        height: 40,
        width: 40,
        bottom: 5,
        right: 5,
    },
});
