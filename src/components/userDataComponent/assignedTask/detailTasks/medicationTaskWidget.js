import React, { useState, useEffect } from 'react'
import { showAlert } from '../../../my_alert_dlg/showAlertDlg';
import '../../style.css'
import { TASKTYPE } from '../enum_task';
function MedicationTaskWidget(props) {
    const initValue = {
        task_name: "",
        description: "",
        task_detail: {
            strength: "",
            quantity: "",
            dosage: "",
            refill_number: "",
            frequency: ""
        }
    };
    const { initDetails, taskNo, isNew, onSubmitTask, tempTaskList, sameTaskUIList, isFromChat, pharmacyList } = props;
    const [infoDetails, setInfoDetails] = useState({ ...initValue });

    useEffect(() => {
        if (initDetails != "" && initDetails != undefined)
            setInfoDetails({ ...initDetails });
    }, [initDetails]);
    const validation = () => {
        if (isNew && tempTaskList.filter(x => x.task_name == infoDetails.task_name).length > 0) {
            showAlert({ content: "The Title can not be duplicated" });
            return false;
        }
        if (infoDetails.task_name == "") {
            showAlert({ content: "The title can not be empty" });
        }
        return true;
    }
    const submitTaskInfo = () => {
        if (validation() == false) return;
        onSubmitTask({
            ...infoDetails,
            type_id: TASKTYPE.prescribe_medication,
            task_name: infoDetails.task_name,
            description: infoDetails.description,
            task_detail: {
                ...infoDetails.task_detail
            }
        }, isNew ? -1 : taskNo);
        setInfoDetails({ ...initValue });
    }

    return (
        <div className="add-input-section">
            {sameTaskUIList.length > 0 && <div>
                {sameTaskUIList}
                <div className="thin-line" style={{ marginBottom: 10 }} />
            </div>}
            <div className={isFromChat == true ? "row" : "input-row row"}>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"} >
                    <input className="add-inputs" placeholder="Medication Name"
                        value={infoDetails.task_name == undefined ? "" : infoDetails.task_name}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_name: e.target.value })}
                    />
                </div>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Strength"
                        value={infoDetails.task_detail.strength == undefined ? "" : infoDetails.task_detail.strength}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, strength: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat == true ? "row" : "input-row row"}>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Quantity"
                        value={infoDetails.task_detail.quantity == undefined ? "" : infoDetails.task_detail.quantity}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, quantity: e.target.value } })}
                    />
                </div>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Dosage"
                        value={infoDetails.task_detail.dosage == undefined ? "" : infoDetails.task_detail.dosage}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, dosage: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat == true ? "row" : "input-row row"}>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Number of Refills"
                        value={infoDetails.task_detail.refill_number == undefined ? "" : infoDetails.task_detail.refill_number}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, refill_number: e.target.value } })}
                    />
                </div>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <input className="add-inputs" placeholder="Frequency"
                        value={infoDetails.task_detail.frequency == undefined ? "" : infoDetails.task_detail.frequency}
                        onChange={(e) => setInfoDetails({ ...infoDetails, task_detail: { ...infoDetails.task_detail, frequency: e.target.value } })}
                    />
                </div>
            </div>
            <div className={isFromChat == true ? "row" : "input-row row"}>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <textarea
                        style={{ minHeight: "150px", padding: "20px" }} className="add-inputs" rows="4" cols="50"
                        value={infoDetails.description == undefined ? "" : infoDetails.description}
                        onChange={(e) => setInfoDetails({ ...infoDetails, description: e.target.value })}
                    />
                </div>
                <div className={isFromChat == true ? "col-12 chat-patient-item-space" : "col-6"}>
                    <h3>Patient’s Preferred Pharmacy</h3>
                    <hr />
                    <div className="row col-12">
                        <div className="check_icon"><i className="fa fa-check"></i></div>
                        {
                            pharmacyList == undefined || pharmacyList.length == 0
                                ? <h4>No preferred Pharmacy</h4>
                                : <h4>{pharmacyList[0]['brand']}<br />{pharmacyList[0]['address']} </h4>
                        }
                        {/* <h4>CVS Pharmacy<br /> 208 W Washington St.<br /> Chicago, IL 60606</h4> */}
                    </div>
                </div>
            </div>

            <div className={isFromChat == true ? "row" : "input-row row"}>
                <div className="col-7">
                    <span className="task_input purplecol Medication_add_item_btn" style={{ cursor: "pointer" }}>
                        Add Item
                    </span>
                </div>
                <div className="col-4">
                    <button className="primary-button" onClick={submitTaskInfo}>
                        <p className="doctor-notes-button-text">
                            {isNew == true ? "Save Task" : "Update Task"}
                        </p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MedicationTaskWidget
