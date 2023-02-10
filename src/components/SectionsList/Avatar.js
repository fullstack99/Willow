import React, { Component,PureComponent } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
const  backgroundcolors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
class Avatar extends PureComponent {
  static propTypes = {
    img: Image.propTypes.source,
    placeholder: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    roundedImage: PropTypes.bool,
    roundedPlaceholder: PropTypes.bool
  };

  static defaultProps = {
    roundedImage: true,
    roundedPlaceholder: true
  };

  renderImage = () => {
    const { img, width, height, roundedImage } = this.props;
    const { imageContainer, image } = styles;

    const viewStyle = [imageContainer];
    if (roundedImage)
      viewStyle.push({ borderRadius: Math.round(width + height) / 2 });
    return (
      <View style={viewStyle}>
        <Image style={image} source={img} />
      </View>
    );
  };

  renderPlaceholder = () => {
    const { placeholder, width, height, roundedPlaceholder } = this.props;
    const { placeholderContainer, placeholderText } = styles;
    let item =backgroundcolors[Math.floor(Math.random()*backgroundcolors.length)]
    const viewStyle = [placeholderContainer];
    if (roundedPlaceholder)
      viewStyle.push({ borderRadius: Math.round(width + height) / 2 });

    return (
      // <View style={[viewStyle],{backgroundColor:backgroundcolors[Math.floor(Math.random()*backgroundcolors.length)]}}>
        <View style={[viewStyle,{backgroundColor:item}]}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.01}
            style={[{ fontSize: Math.round(width) / 2 }, placeholderText]}
          >
            {placeholder}
          </Text>
        </View>
      // </View>
    );
  };

  render() {
    const { img, width, height } = this.props;
    const { container } = styles;
    return (
      <View style={[container, this.props.style, { width, height }]}>
        {this.renderPlaceholder()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  imageContainer: {
    overflow: "hidden",
    justifyContent: "center",
    height: "100%"
  },
  image: {
    flex: 1,
    alignSelf: "stretch",
    width: undefined,
    height: undefined
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dddddd",
    height: "100%"
  },
  placeholderText: {
    fontWeight: "700",
    color: "#ffffff"
  }
});

export default Avatar;
