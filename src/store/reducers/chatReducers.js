
// Set patient for chat reducer
export const setPatientChat = (state = {}, action) => {
    switch (action.type) {
        case "SET_PATIENT_FOR_CHAT":
            return action.payLoad;
        case "SET_PATIENT_FOR_CHAT_CHANGED":
            return action.payLoad;
        default:
            return state;
    }
}