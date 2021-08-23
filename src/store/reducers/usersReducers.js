import { act } from 'react-dom/test-utils';

import { users } from '../../service/users';

export const usersSelect = (state = {}, action) => {
    switch (action.type) {
        case "GET_SELECTED_USER":
            return action.payLoad;
        default:
            return state;
    }
}

export const chatUserSelect = (state = {}, action) => {
    switch (action.type) {
        case "GET_SELECTED_CHAT_USER": 
            return action.payLoad;
        default:
            return state;
    }
}

// Export reducer for getting patients list
export const patientsList =  (state = [], action) => {
    switch (action.type) {
        case "PATIENTS_LIST":
            return action.payLoad;
        default:
            return state;
    }
}

export const patientHealthData =  (state = [], action) => {
    switch (action.type) {
        case "SET_PATIENT_HEALTH_DATA":
            return action.payLoad;
        default:
            return state;
    }
}

export const assignedData =  (state = [], action) => {
    switch (action.type) {
        case "SET_ASSIGNED_DATA":
            return action.payLoad;
        default:
            return state;
    }
}

export const patientTasks = (state = [], action)=>{
    switch (action.type){
        case "SET_PATIENT_TASK_DATA":
            return action.payLoad;
        default:
            return state;
    }
}

// Export reducer for getting selected patient
export const patientSelect = (state = {}, action) => {
    switch (action.type) {
        case "SET_SELECTED_PATIENT":
            return action.payLoad;
        default:
            return state;
    }
}

// Export reducer for getting patient information
export const patientPersonalInfo = (state = {}, action) => {
    switch (action.type) {
        case "GET_PATIENT_PERSONAL_INFOS":
            return action.payLoad;
        default: 
            return state;
    }
}

export const medication = (state = [], action) => {
    switch(action.type) {
        case "GET_PATIENT_MEDICATION_DATAS":
            return action.payLoad;
        default: 
            return state;
    }
}

export const addNewPatientStatus = (state = false, action) => {
    switch(action.type) {
        case "ADD_NEW_PATIENT_ACTION":
            return action.payLoad;
        default: 
            return state;
    }
}

export const userRole = (state = "user", action) => {
    switch(action.type) {
        case "USER_ROLE_SETED": 
            return action.payLoad;
        default: 
            return state;
    }
}
