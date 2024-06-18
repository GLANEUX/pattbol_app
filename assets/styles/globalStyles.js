import { StyleSheet } from "react-native";
import colors from './colors';

const globalStyles = StyleSheet.create({

  tabBarStyle: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: colors.darkgrey,
    height: 70, // Increase the height as needed
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarImage: {
    width: 24,
    height: 24,
    marginBottom:4
  },
  tabBarLabel: {
    fontSize: 12,
    color: colors.darkgrey,
  },
  tabBarLabelFocused: {
    fontSize: 12,
    color: colors.orange,
  },



  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.lightgrey
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    paddingVertical: 10,
    paddingHorizontal:35,
    borderRadius:9
  },
  buttonText:{
    color: 'white',
    fontFamily: 'RouterMedium'
  },
  cancelText: {
    marginLeft: 17, 
    color: colors.orange, 
    fontFamily: 'Router'
  },
  input: {
    backgroundColor: 'white',
    color: colors.darkgrey,
    width: '90%',
    padding: 10,
    margin: 5,
    borderRadius:9,
    borderWidth: 1,
    borderColor: colors.darkgrey,
    fontFamily: 'Router',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Router',
    color: colors.darkgrey,
  },



  flatlist:{
    width: '100%',
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding:15,
    elevation: 4,
    margin:10,
    height: 95
  },



  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageItem: {
    width: "20%",
    height: "100%",
    borderRadius: 10,
    marginRight: 10,
    resizeMode: "contain"
  },


  detailsContainer: {
    flex: 1,
  },
  titleItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },

});

export default globalStyles;
