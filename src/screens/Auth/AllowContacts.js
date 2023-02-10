import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, fonts } from '../../constants';
import Button from '../../components/Button';
import { TabBar } from '../../components/Tabbar';
import Contacts from 'react-native-contacts';
import RBSheet from 'react-native-raw-bottom-sheet'
const { height } = Dimensions.get('window')
class AllowContacts extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {


  }


  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/Images/loginImage.png')} resizeMode={'contain'} style={{ width: "100%", height: "100%" }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
            <View style={{ paddingVertical: 15, width: "70%" }}>
              <Text style={{ fontFamily: fonts.NEWYORKLARGE_MEDIUM, fontSize: 24, textAlign: 'center' }}>willow is better with friends</Text>
            </View>
            <View style={{ paddingVertical: 15 }}>
              <Text style={{ fontFamily: fonts.MULISH_REGULAR, fontSize: 15, textAlign: 'center' }}>it's easier to connect if you allow{"\n"} us to sync your contacts</Text>
            </View>

          </View>
          <Button text="allow" height={height * 0.08} style={{ marginVertical: 10 }} onPress={() =>
            Contacts.getAll().then(contacts => {
              this.props.navigation.navigate('List')
            })
            // this.RBSheet.open()
          } />


          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={450}
            animationType={"slide"}
            closeOnDragDown={true}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "flex-start",

                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
              }
            }}
          >

            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 20 }}>
              <Text style={{ fontFamily: fonts.NEWYORKLARGE_MEDIUM, fontSize: 18, textAlign: 'center', marginVertical: 20 }}>allow access to your contacts</Text>
              <Text style={{ textAlign: 'center', fontFamily: fonts.MULISH_REGULAR, fontSize: 15, marginVertical: 20, width: "85%" }}>this way we are able to send a push note whenever someone signs up for the app and the person is also in their phone's contacts. We could also use this information for when a user goes to search for other users on Willow by showing them a list of people on the
                  app from their phone's contacts.</Text>
              <Button text={"yes"} height={height * 0.08} style={{ marginVertical: 20 }} onPress={() => {
                Contacts.getAll().then(contacts => {
                  this.props.navigation.navigate('List')
                })
                this.RBSheet.close()
              }} />

              <TouchableOpacity onPress={() => this.RBSheet.close()}><Text style={{ color: '#7c7c7c', fontFamily: fonts.MULISH_BOLD, fontSize: 16 }}>no, thanks</Text></TouchableOpacity>
            </View>


          </RBSheet>
        </SafeAreaView>



      </React.Fragment>
    );
  }


}

export default AllowContacts;