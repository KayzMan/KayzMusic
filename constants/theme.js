import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const SIZES = {
  // device dimensions
  width,
  height,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  iconSize: 25,
};

export const COLORS = {
  primary: 'darkslateblue',
  secondary: 'slateblue',
  activeColor: 'dodgerblue',
  white: '#fff',
  black: '#000',
  emptyWhite: '#aaa',
  emptyBlack: '#777',
  black111: '#111',
  black444: '#444',
  black555: '#555',
  black999: '#999',
  black777: '#777',
  black222: '#222',
  white_aaa: '#aaa',
  white_bbb: '#bbb',
  white_ccc: '#ccc',
  white_eee: '#eee',
  pageBackgroundDark: '#131313',
  pageBackgroundLight: '#fff',
  trackControlIconLight: '#555',
  trackControlIconDark: '#ccc',
};

const appTheme = {SIZES, COLORS};

export default appTheme;
