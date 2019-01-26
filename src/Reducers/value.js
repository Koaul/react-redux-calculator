import {
    getIsClicked,
    getOperatorClicked,
    getEqualValue,
    getPercentValue,
    getPlusMinusClick,
    checkPlusMinusOperator,
    getDot,
    getPrevValue
} from '../Functions/valueReducerFunc'

const initialState = {
    currentValue: '0',
    prevValue: '',
    operator: ' '
}

let isClicked = false

const value = (state = initialState, action) => {
    let {currentValue, prevValue, operator} = state
    prevValue = getPrevValue(currentValue, operator)
    isClicked = getIsClicked(currentValue, operator, action)
    switch (action.type) {
        case 'number':
        return {
            ...state,
            currentValue: currentValue === '0' ? action.payload : currentValue.length <= 11 ? currentValue + action.payload : currentValue
        }

        case 'operator':
        return {
            currentValue: getOperatorClicked(isClicked, prevValue, currentValue, action, operator),
            prevValue: prevValue,
            operator: action.payload
        }
        case 'plus-minus':
        return {
            ...state,
            currentValue: getPlusMinusClick(prevValue, currentValue, operator),
            operator: checkPlusMinusOperator(operator)
        }

        case 'clear':
        return {
            currentValue: '0',
            prevValue: '',
            operator: ' '
        }

        case 'percent':
        return {
            currentValue: getPercentValue(prevValue, currentValue, operator),
            prevValue: '',
            operator: ' '
        }

        case 'del':
        if (currentValue.slice(currentValue.length - 1) === operator) {
            isClicked = false
        }
        return {
            ...state,
            currentValue: currentValue.length > 1 ? currentValue.slice(0,currentValue.length-1) : currentValue='0',
            operator: currentValue.indexOf(operator) === -1 ? ' ' : operator
        }
        case 'dot':
        return {
            ...state,
            currentValue: getDot(currentValue, action, operator)
        }

        case 'equal':
        return {
            currentValue: getEqualValue(prevValue, currentValue, operator),
            prevValue: '',
            operator: ' '
        }

        default:
        return state
    }
}
export default value
