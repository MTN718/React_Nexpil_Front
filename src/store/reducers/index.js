import { combineReducers } from 'redux';
import { 
    usersSelect, 
    patientsList, 
    patientSelect, 
    patientPersonalInfo,
    medication,
    addNewPatientStatus,
    userRole,
    patientHealthData,
    assignedData,
    chatUserSelect,
    patientTasks
} from './usersReducers';
import {
    setPatientChat,
} from './chatReducers';

// Export combined reducers
export default combineReducers({
    usersSelect,
    patientsList,
    patientSelect,
    patientPersonalInfo,
    setPatientChat,
    medication,
    addNewPatientStatus,
    userRole,
    patientHealthData,
    assignedData,
    chatUserSelect,
    patientTasks
})
