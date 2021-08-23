import { call, put, takeEvery } from 'redux-saga/effects';
import * as initialActions from '../store/actionNames/homePageActions';
import * as API from '../api';

/* These are saga functions for patient page. */


function* getSelectedUser(action) {
    try {
        yield put({ type: "GET_SELECTED_USER", payLoad: action.payLoad });
    } catch (e) {
        yield put({ type: "GET_SELECTED_USER_FAILED", message: e.message });
    }
}

function* getSelectedChatUser(action) {
    try {
        yield put({ type: "GET_SELECTED_CHAT_USER", payLoad: action.payLoad });
    } catch (e) {
        yield put({ type: "GET_SELECTED_CHAT_USER_FAILED", message: e.message });
    }
}

/* ----------- Call and dispatch functions ------------- */

// Get full patients list
function* getPatientsList() {
    try {
        const patients = yield call(API.resultGet, "v1/patients");
        yield put({ type: "PATIENTS_LIST", payLoad: patients.data.data.results })
    } catch (e) {
        yield put({ type: "GET_PATIENTS_LIST_FAILED", message: e.message });
    }
}

// Get selected patient from patient list
function* setPatientSelected(action) {
    try {
        yield put({ type: 'SET_SELECTED_PATIENT', payLoad: action.payLoad });
    } catch (e) {
        yield put({ type: 'SET_PATIENT_SELECT_FAILED' });
    }
}

// Get selected patient informations
function* getPatientPersonalInfo(action) {
    try {
        const patientPersonalInfo = yield call(API.getPatientPersonalInfoAPI, action.payLoad);
        yield put({ type: "GET_PATIENT_PERSONAL_INFOS", payLoad: patientPersonalInfo.data.data });
    } catch (e) {
        yield put({ type: "GET_PATIENT_PERSONAL_INFO_FAILED" });
    }
}

// Set patient to have chat with
function* setPatientChatTarget(action) {
    try {
        const patientSet = yield call(API.getPatientPersonalInfoAPI, action.payLoad.id);
        yield put({ type: "SET_PATIENT_FOR_CHAT", payLoad: patientSet.data.data })
    } catch (e) {
        yield put({ type: "SET_PATIENT_FOR_CHAT_FAILED" });
    }
}

// Change patient to have chat with
function* setPatientChatTargetChange(action) {
    try {
        const patientSets = yield call(API.getPatientPersonalInfoAPI, action.payLoad.id);
        yield put({ type: "SET_PATIENT_FOR_CHAT_CHANGED", payLoad: patientSets.data.data });
    } catch (e) {
        yield put({ type: "SET_PATIENT_FOR_CHAT_CHANGED_FAILED" });
    }
}


function* getAssignedData(action) {
    if (action["payLoad"] == "") {
        yield put({ type: "SET_ASSIGNED_DATA", payLoad: [] });
    } else {
        try {
            const patientSets = yield call(API.getAssignedDataAPI, action.payLoad);
            yield put({ type: "SET_ASSIGNED_DATA", payLoad: patientSets.data.data.results });
        } catch (e) {
            yield put({ type: "SET_ASSIGNED_DATA", payLoad: [] });
        }
    }
}
function* getPatientTaskData(action) {
    if (action["payLoad"] == "") {
        yield put({ type: "SET_PATIENT_TASK_DATA", payLoad: [] });
    } else {
        // console.log("TESt", action)
        try {
            const taskSets = yield call(API.getPatientTaskDataAPI, action.payLoad);
            // console.log(taskSets.data.data.results)
            yield put({ type: "SET_PATIENT_TASK_DATA", payLoad: taskSets.data.data.results })
        } catch (e) {
            yield put({ type: "SET_PATIENT_TASK_DATA", payLoad: [] });
        }
    }
}

function* getPatientHealthData(action) {
    try {
        const patientSets = yield call(API.getPatientHealthDataAPI, action.payLoad);
        yield put({ type: "SET_PATIENT_HEALTH_DATA", payLoad: patientSets.data.data.results });
    } catch (e) {
        yield put({ type: "SET_PATIENT_HEALTH_DATA_FAILED" });
    }
}

function* getPatientMedicationData(action) {
    if (action["payLoad"] == "") {
        yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payLoad: [] });
    } else {
        try {
            const patientSets = yield call(API.getPatientMedicationDataAPI, action.payLoad);
            yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payLoad: patientSets.data.data.results });
        } catch (e) {
            yield put({ type: "GET_PATIENT_MEDICATION_DATAS", payLoad: [] });
        }
    }
}

function* onAddNewPatient(action) {
    yield put({ type: "ADD_NEW_PATIENT_ACTION", payLoad: action.payLoad });
}

function* onUserRoleSet(action) {
    yield put({ type: "USER_ROLE_SETED", payLoad: action.payLoad });
}

// Export saga functions
export default function* mySaga() {
    yield takeEvery(initialActions.GET_USER, getSelectedUser);
    yield takeEvery(initialActions.GET_USER_CHAT, getSelectedChatUser);
    yield takeEvery(initialActions.SET_PATIENT_SELECTED, setPatientSelected);
    yield takeEvery(initialActions.GET_PATIENTS_LIST, getPatientsList);
    yield takeEvery(initialActions.GET_PATIENT_PERSONAL_DATA, getPatientPersonalInfo);
    yield takeEvery(initialActions.GET_CHAT_PATIENT_TARGET, setPatientChatTarget);
    yield takeEvery(initialActions.SET_GET_CHAT_PATIENT_TARGET, setPatientChatTargetChange);
    yield takeEvery(initialActions.GET_PATIENT_MEDICATION_DATA, getPatientMedicationData);
    yield takeEvery(initialActions.ADD_NEW_PATIENT, onAddNewPatient);
    yield takeEvery(initialActions.USER_ROLE_SET, onUserRoleSet);
    yield takeEvery(initialActions.GET_PATIENT_HEALTH_DATA, getPatientHealthData);
    yield takeEvery(initialActions.GET_ASSIGNED_DATA, getAssignedData);
    yield takeEvery(initialActions.GET_PATIENT_TASK_DATA, getPatientTaskData)
}
