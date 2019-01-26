import button from '../Components/button'
import {connect} from 'react-redux'
import {mathAction} from '../Actions/actionCreators'

const mapStateToProps = (state) => {
    return {
    buttons: state.buttons
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        mathAction: (text, name) => dispatch(mathAction(text, name))
    }
}

const ButtonContainer = connect(mapStateToProps, mapDispatchToProps)(button)
export default ButtonContainer