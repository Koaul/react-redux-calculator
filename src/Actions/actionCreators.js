export const mathAction = (text, name) => {
    return{
        type:name,
        payload: text
    }
}