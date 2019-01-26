// helping functions

const compareIndexOfOperator = (operator, currentValue) => {
    return currentValue.indexOf(operator) === currentValue.lastIndexOf(operator)
}

const checkNewOperator = (operator, action) => {
    return operator === action.payload
}

const checkOperatorNotLast = (currentValue, operator) => {
    return currentValue.indexOf(operator) !== currentValue.length
}

const getValueAfterOperator = (currentValue, operator) => {
    return currentValue.slice(currentValue.lastIndexOf(operator) + 1, currentValue.length)
}

const replaceOperator = (prevValue, currentValue, operator) => {
    let valueTwo
    valueTwo = getValueAfterOperator(currentValue, operator)
    if (currentValue.indexOf('-') === 0) {
        if (valueTwo === '') {
            return '-' + prevValue + (operator === '+' ? '-' : '+')
        }
        return '-' + prevValue + (operator === '+' ? '-' : '+') + valueTwo
    }
    if (valueTwo === '') {
        return prevValue + (operator === '+' ? '-' : '+')
    }
    return prevValue + (operator === '+' ? '-' : '+') + valueTwo
}

const checkPlusMinusIndex = (currentValue, operator) => {
    if (operator === '+') {
        if (currentValue.indexOf('-') === 0) {
            return true
        }
        return currentValue.indexOf('-') === -1
    }
    if (operator === '-') {
        return currentValue.indexOf('+') === -1
    }
}

const checkDot = (currentValue, operator) => {
    return currentValue === '0' ||
            currentValue.indexOf('.') === -1 ||
            checkSecondValueDot(currentValue, operator)
}

const checkSecondValueDot = (currentValue, operator) => {
    return currentValue !== '0' &&
            currentValue.indexOf(operator) !== 0 &&
            currentValue.indexOf('.') < currentValue.indexOf(operator) &&
            currentValue.lastIndexOf('.') === currentValue.indexOf('.')
}

const checkMinusAndValue = (currentValue) => {
    return (currentValue.indexOf('-') === -1 &&
            currentValue !== '0') ||
            (currentValue.indexOf('0') === 0 &&
            currentValue.length > 1)
}

const getValueAfterDot = (value) => {
    if (value.indexOf('.') === -1) {
        return ''
    } 
    return value.slice(value.indexOf('.') + 1, value.length)
}

// ---------------------------------------------------------------------------------------------------

// simple math operations
const math = (a, b, type) => {
    switch (type) {
        case '+':
        return `${+a + +b}`
        case '-':
        return `${+a - +b}`
        case 'X':
        return `${+a * +b}`
        case '÷':
        return `${+a / +b}`
        default:
        return `${b}`
    }
}

// percent operations
const percent = (a, b, type) => {
    switch (type) {
        case '+':
        return `${+a + (+a / 100 * +b)}`
        case '-':
        return `${+a - (+a / 100 * +b)}`
        case 'X':
        return `${(+a / 100) * +b}`
        case '÷':
        return `${(+a / 100 / +b) * 10000}`
        default:
        return `${b}`
    }
}
// ---------------------------------------------------------------------------------------------------
// export functions to value.js reducer
let tempValue
let eValue
export const checkPlusMinusOperator = (operator) => {
    return operator === '+' ? '-' : operator === '' ? '' : operator === '-' ? '+' : operator
}

export const getPercentValue = (prevValue, currentValue, operator) => {
    if (currentValue === '0' || operator === '') {
        return currentValue
    }
    return percent(prevValue, getValueAfterOperator(currentValue, operator), operator)
}

export const getEqualValue = (prevValue, currentValue, operator) => {
    if (currentValue !== '0' &&
    currentValue.indexOf(operator) !== -1 &&
    getValueAfterOperator(currentValue, operator) !== '') {
        tempValue = math(prevValue, getValueAfterOperator(currentValue, operator), operator)
        return getCurrentValue(tempValue, operator)
    }
    return prevValue
}

export const getPlusMinusClick = (prevValue, currentValue, operator) => {
    if (checkPlusMinusIndex(currentValue, operator)) {
        return replaceOperator(prevValue, currentValue, operator)
    }
    if (checkMinusAndValue(currentValue)) {
        return '-' + currentValue
    }
    if (currentValue !== '0') {
        return currentValue.slice(1)
    }
    return currentValue
}

export const getOperatorClicked = (isClicked, prevValue, currentValue, action, operator) => {
    if (isClicked || getValueAfterOperator(currentValue, operator) !== '') {
        tempValue = math(prevValue, getValueAfterOperator(currentValue, operator), operator) + action.payload
        return getCurrentValue(tempValue, action.payload)
    }
    return prevValue + action.payload
}


export const getIsClicked = (currentValue, operator, action) => {
    return (
        compareIndexOfOperator(operator, currentValue) &&
        checkNewOperator(operator, action) &&
        checkOperatorNotLast(currentValue, operator)
    )
}

export const getDot = (currentValue, action, operator) => {
    if (checkDot(currentValue, operator)) {
        return currentValue + action.payload
    }
    return currentValue
}

export const getPrevValue = (currentValue, operator) => {
    let lastIndex = currentValue.length
    if (currentValue === '0') {
        eValue = undefined
    }
    if (eValue) {
        return eValue
    }
    if (currentValue.indexOf(operator) !== -1) {
        lastIndex = currentValue.indexOf(operator)
    }
    return currentValue.slice(0, lastIndex)
}

export const getCurrentValue = (tempValue, operator) => {
    let pow = tempValue.indexOf(operator) === -1 ? tempValue.length - 4 : tempValue.length - 5
    let firstVal = tempValue.slice(0, 1)
    let secondVal = tempValue.slice(1, 4)

    let sliceZeros = () => {
        for (let i=2; i>=0; i--) {
            if (secondVal.lastIndexOf('0') === secondVal.length - 1) {
                pow++
                secondVal = secondVal.slice(0, i)
            }
        }
    }

    if (getValueAfterDot(tempValue).length >= 5) {
        tempValue = tempValue.slice(0, tempValue.indexOf(operator))
        tempValue = `${parseFloat(tempValue).toFixed(3)}`
        tempValue = tempValue.indexOf(operator) !== -1 ? tempValue + operator : tempValue
    }

    if (getValueAfterDot(tempValue).slice(0, 3) === '000') {
        tempValue = tempValue.slice(0, tempValue.indexOf(operator))
        tempValue = `${parseFloat(tempValue).toFixed()}`
        tempValue = tempValue.indexOf(operator) !== -1 ? tempValue + operator : tempValue
    }

    if (tempValue.indexOf(operator) === -1 && tempValue.length >= 10) {
        sliceZeros()
        eValue = tempValue
        return secondVal === '' ? (firstVal + `e${pow}`) : (firstVal + '.' + secondVal + `e${pow}`)
    }

    if (tempValue.indexOf(operator) !== -1 && tempValue.length >= 11) {
        sliceZeros()
        eValue = tempValue.slice(0, tempValue.indexOf(operator))
        return secondVal === '' ? (firstVal + `e${pow}`) : (firstVal + '.' + secondVal + `e${pow}` + operator)
    }
    return tempValue
}
// ---------------------------------------------------------------------------------------------------
// why i'm doing that calculator..........................................
