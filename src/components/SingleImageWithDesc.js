import React from 'react'
import { View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { colors, fonts } from '../constants'

function SingleImageWithDesc(props) {
    return (
        <View style={{ flexDirection: "column" }}>
            <View
                style={{
                    //    borderWidth: 2,
                     backgroundColor: 'white',
                    margin: 5,
                    height: 300,
                    flex:5,
                    borderRadius:20

                }}>
                <Image
                    resizeMode="contain"
                    style={{
                        flex: 1,
                        borderRadius: 30,
                        // width: props.width,
                           width: 180,
                         height: 200
                    }}
                    source={{ uri: props.imageUrl }}
                />
                <Icon style={{
                    margin: 5,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 35,
                    height: 35,
                    color: colors.RED
                }} name="bookmark" size={35} />
            </View>
            <View style={{flex:1}}>
                <Text numberOfLines={3} ellipsizeMode={"tail"} style={{ padding: 5, fontFamily: fonts.NEWYORKLARGE_REGULAR, color: colors.BLACK,fontSize:18}} >{props.title}</Text>
                {props.desc &&
                <Text style={{ padding: 5, fontFamily: fonts.NEWYORKLARGE_MEDIUM, color: '#000' }} >{props.desc}</Text>
                }
            </View>
        </View>
    )
}
export default SingleImageWithDesc;