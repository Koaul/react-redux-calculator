import {combineReducers} from 'redux';
import buttons from './button';
import value from './value'

const reducers = combineReducers({buttons, value});
export default reducers
