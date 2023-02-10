import React from 'react'
import { View, Text, Image } from 'react-native'
import { colors, fonts } from '../constants'

function PopularPeople(props) {

    return (
        <View style={{ flex:1, borderWidth: 0.3,borderColor:"#a2a2a2", borderRadius: 20,margin: 10, height: 150, width:250 }}>
            <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Image
                        resizeMode="contain"
                        style={{

                            borderRadius: 25,
                            width: 50,
                            height: 50
                        }}
                        source={{ uri: props.imageUrl }}
                    />
                </View>
                <View style={{  marginHorizontal:20, height:25,flex:3, justifyContent:'center'}}>
                    <Text style={{ padding: 5, fontFamily: fonts.MULISH_BOLD, color: colors.BLACK, fontSize: 15 }} >{props.title}</Text>

                    <Text style={{ padding: 5, fontFamily: fonts.MULISH_REGULAR, color: '#a2a2a2', fontSize: 13, textAlign:'left' }} >{props.desc}</Text>

                </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <Text numberOfLines={3} ellipsizeMode={"tail"} style={{ padding: 5, fontFamily: fonts.NEWYORKLARGE_REGULAR, color: colors.BLACK, fontSize: 18 }} >{props.title}</Text>
                
            </View>
        </View>
    )
}
export default PopularPeople