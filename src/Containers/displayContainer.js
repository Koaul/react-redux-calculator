import display from '../Components/display'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return {
        value: state.value.currentValue,
        operator: state.value.operator
    }
}

const DisplayContainer = connect(mapStateToProps)(display)
export default DisplayContainer
