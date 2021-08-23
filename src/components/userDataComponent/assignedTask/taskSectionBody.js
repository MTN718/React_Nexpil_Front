import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../../../config/server';
import MyCheckBox from '../../my_check_box/my_check_box';
import { showConfirm } from '../../my_confirm_dlg/showConfirmDlg';
import '../style.css'
import TaskTemplateDropdownWidget from './commonComponents/taskTemplateDropdownWidget/taskTemplateDropdownWidget';
import TaskTypeDropdownWidget from './commonComponents/taskTypeDropdownWidget/taskTypeDropdownWidget';
import AppointmentTaskWidget from './detailTasks/appointmentTaskWidget';
import ListTaskWidget from './detailTasks/listTaskWidget';
import MedicationTaskWidget from './detailTasks/medicationTaskWidget';
import Questionnaire from './detailTasks/questionnaire';
import ReferTaskWidget from './detailTasks/referTaskWidget';
import TreatmentTaskWidget from './detailTasks/treatmentTaskWidget';
import { ALL_TASK_NAME, TASKADDINGSTATUS, TASKTYPE } from './enum_task';
function TaskSectionBody(props) {
    const { isNew, setVisibleBody, selectedGroup, taskTemplateList, onSubmitTaskGroup, setSelectedGroup, setIsLoading, isFromChat, pharmacyList } = props;
    const { isFromNote, isAboveItem } = props;
    const [selTaskType, setSelTaskType] = useState(TASKTYPE.none);
    const [selTaskTemplate, setSelTaskTemplate] = useState("");
    const [groupName, setGroupName] = useState("");
    const [willSaveTemplate, setWillSaveTemplate] = useState(false);

    const [tempTaskList, setTempTaskList] = useState([]);
    const [selTempTask, setSelTempTask] = useState("");
    const [selTempTaskIndex, setSelTempTaskIndex] = useState(-1);
    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token,
            'Content-Type': 'application/json',
        }
    }
    useEffect(() => {
        setSelTaskTemplate("");
    }, [taskTemplateList]);


    const onDeleteTask = async (index, taskInfo) => {
        if (await showConfirm({
            content: 'Are you sure to delete this task?'
        })) {
            // console.log(`${index} has been deleted`);
            // console.log(taskInfo);
            var _tempTaskList;
            if (taskInfo.id == undefined) {
                _tempTaskList = tempTaskList.filter((x, index) => index != index);
                var task = tempTaskList[index];
                _tempTaskList = tempTaskList.filter(x => x != task);
            } else {
                _tempTaskList = tempTaskList.filter((x) => x.id != taskInfo.id);

                axios.delete(server.serverURL + "v1/tasks/" + taskInfo.id, { ...config })
                    .then((res) => { console.log(res) })
                    .catch((e) => { console.log(e) });
            }

            // console.log(_tempTaskList);
            setTempTaskList([..._tempTaskList]);
        } else {

        }
    }

    useEffect(() => {
        if (selTaskTemplate != "" && selTaskTemplate != undefined) {
            // console.log("selected template", selTaskTemplate);
            setGroupName(undefined);
            setWillSaveTemplate(false);
            setTempTaskList([]);
            setSelTempTask("");
            setSelTempTaskIndex(-1);
            setSelectedGroup(undefined);

            getTaskListBasedOnTemplateID(selTaskTemplate.id);
        }
    }, [selTaskTemplate]);

    const getTaskListBasedOnTemplateID = (templateId) => {
        if (templateId == "") {
            return "";
        }

        setIsLoading(true);
        axios.get(server.serverURL + 'v1/task-group/' + templateId, { ...config })
            .then((res) => {
                setIsLoading(false);
                var groupInfo = res.data.data;
                // console.log(groupInfo);
                var taskList = groupInfo.results;
                var tempList = [];
                for (var i = 0; i < taskList.length; i++) {
                    var task = taskList[i];
                    tempList = [...tempList, {
                        task_detail: { ...task.details },
                        task_name: task.name,
                        task_dueDate: task.end_date,
                        type_id: task.type_id
                    }];

                }
                // console.log(tempList);
                setTempTaskList([...tempList]);
            })
            .catch((error) => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        // console.log("group name", selectedGroup);

        setSelTaskType(TASKTYPE.none);
        setSelTaskTemplate("");
        if (selectedGroup != undefined && selectedGroup != "" && selectedGroup != {}) {
            // console.log("Is old")
            onSetTempTaskListFromServer([...selectedGroup.results])
            setGroupName(selectedGroup.group_name);
            setWillSaveTemplate(selectedGroup.is_template == 1);

        } else {
            // console.log("Is new")
            setGroupName("");
            setWillSaveTemplate(false);
            setTempTaskList([]);
            setSelTempTask("");
            setSelTempTaskIndex(-1);
        }
    }, [selectedGroup]);

    // console.log(taskTemplateList);

    // console.log("isNew Value: ", isNew);
    const onSetTempTaskListFromServer = (taskList) => {
        var tempList = [];
        for (var i = 0; i < taskList.length; i++) {
            var task = taskList[i];
            tempList = [...tempList, {
                ...task,
                task_detail: { ...task.details },
                task_name: task.name,
                task_dueDate: task.end_date
            }];

        }
        setTempTaskList([...tempList]);
    }

    const onSubmitTask = (taskInfo, taskNo) => {
        console.log(taskInfo);
        console.log(taskNo);
        if (taskNo == -1) {
            setTempTaskList([...tempTaskList, { ...taskInfo }]);
        } else {
            updateTempTaskList(taskInfo, taskNo);
        }
        setSelTempTask("");
        setSelTempTaskIndex(-1);
    }

    const updateTempTaskList = (taskInfo, taskNo) => {
        var tempList = tempTaskList;
        tempList[taskNo] = { ...taskInfo };
        setTempTaskList([...tempList]);
    }

    const onClickTempTask = (index) => {
        setSelTempTask(tempTaskList[index]);
        setSelTempTaskIndex(index);
        setSelTaskType(tempTaskList[index].type_id);
    }

    const onClickTaskDropdownList = (taskType) => {
        setSelTaskType(taskType);
        setSelTempTask("");
        setSelTempTaskIndex(-1);
    }

    const userTempTaskUIList = tempTaskList.map((taskInfo, index) => {
        return (
            <div className="patient-page-existing-task-style"
                key={`user_task_selected_theme_list_key_${index}`}
            >
                <span
                    onClick={() => onClickTempTask(index)}
                >
                    {taskInfo.task_name}
                </span>
                <span className="patient-page-delete-group-button"
                    onClick={() => onDeleteTask(index, taskInfo)}
                >
                    &times;
                </span>
            </div>
        );
    });

    const sameTaskUIList = tempTaskList.map((taskInfo, index) => {
        if (taskInfo.type_id != selTaskType) {
            return <div key={`user_task_selected_theme_list_key_${index}`} style={{ display: "none" }}></div>
        }
        return (
            <div className="patient-page-existing-task-style"
                key={`user_task_selected_theme_list_key_${index}`}>
                <span
                    onClick={() => onClickTempTask(index)}
                >
                    {taskInfo.task_name}
                </span>
                <span className="patient-page-delete-group-button"
                    onClick={() => onDeleteTask(index, taskInfo)}
                >
                    &times;
                </span>
            </div>
        );
    });
    // console.log("selTaskType: ", selTaskType, " , uiList", sameTaskUIList, " all List: ", tempTaskList)


    return (
        <div className="add-section" style={{ background: isFromNote ? "white" : "transparent", padding: isFromNote ? 20 : 0, paddingTop: 50, borderRadius: isFromNote ? 20 : 0 }}>
            <div className="add-section-title-row">
                <h1 className="add-section-title-title-text">{isNew ? "Add New Task" : "Update the Task"}</h1>
                <p className="add-section-cancel-text" onClick={() => setVisibleBody(false)}>Cancel</p>
            </div>
            <p className="add-section-description">Create a new task by filling out the information below. You can chose to create an individual task or a series of tasks for the patient to complete in sequence.</p>
            {isFromChat
                ? <div div style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                        <TaskTypeDropdownWidget
                            selTaskType={selTaskType}
                            setSelTaskType={onClickTaskDropdownList}
                            sameTaskUIList={sameTaskUIList}
                            selTaskTemplate={selTaskTemplate}
                            isFromChat={isFromChat}
                        />
                    </div>
                    <div style={{ width: "100%" }}>
                        <TaskTemplateDropdownWidget
                            selTaskTemplate={selTaskTemplate}
                            setSelTaskTemplate={setSelTaskTemplate}
                            taskTemplateList={taskTemplateList}
                            tempTaskList={tempTaskList}
                            sameTaskUIList={sameTaskUIList}
                            isFromChat={isFromChat}
                        />
                    </div>
                </div>
                : <div className="addTask_card_row">
                    <TaskTypeDropdownWidget
                        selTaskType={selTaskType}
                        setSelTaskType={onClickTaskDropdownList}
                        sameTaskUIList={sameTaskUIList}
                        selTaskTemplate={selTaskTemplate}
                    />
                    <span className="span_or">Or</span>
                    <TaskTemplateDropdownWidget
                        selTaskTemplate={selTaskTemplate}
                        setSelTaskTemplate={setSelTaskTemplate}
                        taskTemplateList={taskTemplateList}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                    />
                </div>}


            <div className="add_task_detail_container">
                {selTaskType == TASKTYPE.list &&
                    <ListTaskWidget
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        isFromChat={isFromChat}
                    />}
                {selTaskType == TASKTYPE.prescribe_medication &&
                    <MedicationTaskWidget
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                        pharmacyList={pharmacyList}
                    />}
                {selTaskType == TASKTYPE.treatment_plan &&
                    <TreatmentTaskWidget
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {selTaskType == TASKTYPE.appintment_scheduling &&
                    <AppointmentTaskWidget
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {selTaskType == TASKTYPE.refer_to_doctor &&
                    <ReferTaskWidget
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />}
                {selTaskType == TASKTYPE.questionnaire &&
                    <Questionnaire
                        isNew={selTempTask == "" || selTempTaskIndex == -1}
                        initDetails={selTempTask}
                        taskNo={selTempTaskIndex}
                        onSubmitTask={onSubmitTask}
                        tempTaskList={tempTaskList}
                        sameTaskUIList={sameTaskUIList}
                        onDeleteTask={onDeleteTask}
                        isFromChat={isFromChat}
                    />
                }
            </div>

            <div className="add-input-section" style={{ marginTop: isFromChat ? 5 : 30 }}>
                <div className="input-row row">
                    <div className="col-12">
                        <input className="add-inputs task-group-name-input" placeholder="Name of Task Set"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            disabled={!isNew ? "disabled" : ""}
                        />
                    </div>
                    <div className="col-12 patient-page-existing-task-container-style" style={{ marginTop: isFromChat ? 5 : 20 }}>
                        {userTempTaskUIList}
                    </div>
                </div>
            </div>

            <div>
                <div style={{ marginTop: isFromChat ? 5 : 20 }}>
                    <div className="input-row row">
                        <div className={isFromChat ? "col-12" : "col-6"}>
                            <MyCheckBox
                                isChecked={willSaveTemplate}
                                setIsChecked={setWillSaveTemplate}
                                isFromChat={isFromChat}
                            />
                        </div>
                        <div className={isFromChat ? "col-12" : "col-6"}>
                            <button
                                className={tempTaskList.length == 0 ? "primary-button patient-disabled-button" : "primary-button"}
                                onClick={() => onSubmitTaskGroup(groupName, tempTaskList, willSaveTemplate)}
                            >
                                <p className="doctor-notes-button-text">
                                    {isNew ? "Confirm and Send Tasks" : "Confirm and Update Tasks"}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskSectionBody
