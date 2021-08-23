import React, { useEffect, useState } from 'react';
import '../style.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { server } from '../../../config/server';
import { showConfirm } from "../../my_confirm_dlg/showConfirmDlg";
import { showAlert } from "../../my_alert_dlg/showAlertDlg";
import LoadingOverlay from 'react-loading-overlay';
import { TASKADDINGSTATUS, TASKTYPE } from './enum_task';
import TaskSectionHeader from './taskSectionHeader';
import TaskSectionBody from './taskSectionBody';
import TaskSectionTail from './taskSectionTail';
import { getPharmacyList_FromCorePhp } from '../../../api/axiosAPIs';
import { GET_PATIENT_TASK_DATA } from '../../../store/actionNames';

function AssignedTask(props) {
    const { userInfo, isFromNote, isAboveItem, isFromChat, homeUserName } = props;
    const { setCreatedGroupId } = props;
    const dispatch = useDispatch();
    const userAssigedData = useSelector(state => state.assignedData);
    // const userTaskGroupList = useSelector(state => state.patientTasks);
    const [userTaskGroupList, setUserTaskGroupList] = useState([]);
    const [taskTemplateList, setTaskTemplateList] = useState([]);
    const [pharmacyList, setPharmacyList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [visibleBody, setVisibleBody] = useState(false);

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.token,
            'Content-Type': 'application/json',
        }
    }
    useEffect(() => {
        // console.log(userInfo);
        if (userInfo != undefined && userInfo.id != undefined) {
            getTaskTemplateList();
            getPharmacyList();
            getPatientTaskList();
        }
    }, [userInfo]);

    const getPharmacyList = () => {
        // getPharmacyList_FromCorePhp
        getPharmacyList_FromCorePhp(userInfo.id, res => {
            // console.log(res);
            setPharmacyList([...res]);
        })
    }
    const getTaskTemplateList = () => {
        axios.get(server.serverURL + `v1/tasks?is_template=1`, { ...config })
            .then((res) => {
                var templateList = res.data.data.results.map((info) => {
                    return {
                        title: info.template_name,
                        id: info.id
                    }
                });
                // console.log(templateList);
                setTaskTemplateList([...templateList]);
            })
            .catch((err) => {
                setTaskTemplateList([]);
            })
    }

    const getPatientTaskList = () => {
        // console.log("userInfo.id", userInfo.id);
        axios.get(server.serverURL + 'v1/tasks?patient_id=' + userInfo.id, { ...config })
            .then((res) => {
                console.log(res.data);
                setUserTaskGroupList([...res.data.data.results]);
            })
            .catch((error) => {
                setUserTaskGroupList([]);
            });
    }

    const onSubmitTaskGroup = async (groupName, taskList, isTemplate) => {
        console.log("group name", groupName)
        console.log("taskList", taskList);
        // console.log('isTemplate', isTemplate);
        if (taskList.length == 0) {
            await showAlert({ content: "You need to add at least one task." });
            return;
        }
        if (groupName == "" || groupName == undefined) {
            await showAlert({ content: "Please type the name of task set" });
            return;
        }

        if (selectedGroup == "" || selectedGroup == undefined) {
            console.log("adding new group")
            addNewGroup(groupName, taskList, isTemplate);
        } else {
            console.log("updating old group")
            updateGroup(groupName, taskList, isTemplate);
        }

    }
    const addNewGroup = async (groupName, taskList, isTemplate) => {
        console.log(userInfo);
        setIsLoading(true);
        const patient_id = userInfo.id;

        const groupParam = {
            group_name: groupName,
            patient_id: patient_id,
            is_template: isTemplate ? 1 : 0,
            template_name: groupName
        }
        axios.post(server.serverURL + 'v1/task-group', groupParam, { ...config })
            .then(async (res) => {

                // console.log(res);
                var response = res.data.data;
                if (response.status != true) {
                    showAlert({ content: "Something went wrong" });
                }
                const group_id = response.task_group_id;

                for (var i = 0; i < taskList.length; i++) {
                    const taskParam = {
                        ...taskList[i],
                        patient_id: patient_id,
                        task_group_id: group_id
                    }
                    try {
                        axios.post(server.serverURL + 'v1/tasks', taskParam, { ...config });
                    } catch (e) {

                        console.log("error", e);
                        console.log(taskParam);
                    }
                }
                showAlert({ content: "Successfully added." });
                setIsLoading(false);

                setCreatedGroupId(group_id);

                var notifyParam = {
                    patient_id: patient_id,
                    title: "New TASK !",
                    body: `Dr.${homeUserName == undefined ? "The current Doctor" : homeUserName} has just sent the new task - ${groupName}`,
                    notification_id: 3
                }
                // console.log(homeUserName);
                // console.log("notifyParam", notifyParam);
                axios.post(server.serverURL + 'v1/push-notify', notifyParam, { ...config }).then((v) => {
                    console.log(v)
                }).catch((err) => {
                    console.log("err", err.message);
                });
                //  getPatientTaskList();
                dispatch({ type: GET_PATIENT_TASK_DATA, payLoad: userInfo.id });

                setSelectedGroup(undefined);
                setVisibleBody(false);
                getTaskTemplateList();
            })
            .catch((err) => {
                showAlert({ content: "Something went wrong" });
                setIsLoading(false);
                setSelectedGroup(undefined);
            })

        // setSelectedGroup("");
    }
    const updateGroup = async (groupName, taskList, isTemplate) => {
        const group_id = selectedGroup.id;
        const patient_id = userInfo.id;
        for (var i = 0; i < taskList.length; i++) {
            var task = taskList[i];
            const taskParam = {
                ...task,
                patient_id: patient_id,
                task_group_id: group_id
            }
            console.log(taskParam)
            if (task.id != "" && task.id != undefined) {  // if already exist, update
                axios.put(server.serverURL + 'v1/tasks/' + task.id, taskParam, { ...config }).then((res) => {
                    // console.log('updated')
                });
            } else {   // if new, create
                axios.post(server.serverURL + 'v1/tasks', taskParam, { ...config }).then(res => {
                    console.log('added')
                });
            }
        }
        await showAlert({ content: "Successfully update the set of group !" });
        setSelectedGroup(undefined);
        setVisibleBody(false);
    }
    // console.log("userinfo", userInfo);
    const onDeleteGroup = async (groupId) => {
        if (await showConfirm({
            content: 'Are you sure to delete this group?'
        })) {
            // console.log(`${groupId} has been deleted`);
            var _userTaskGroupList = userTaskGroupList.filter(x => x.id != groupId);
            // setUserTaskGroupList([..._userTaskGroupList]);
            setIsLoading(true);
            axios.delete(server.serverURL + 'v1/task-group/' + groupId, { ...config })
                .then((res) => {
                    // console.log(res);
                    dispatch({ type: GET_PATIENT_TASK_DATA, payLoad: userInfo.id });
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        } else {

        }
    }

    const onSelectGroup = async (groupId) => {
        if (groupId == "") {
            setSelectedGroup(undefined);
            return "";
        }
        console.log("groupId", groupId)
        setIsLoading(true);
        axios.get(server.serverURL + 'v1/task-group/' + groupId, { ...config })
            .then((res) => {
                console.log('res->', res);
                setIsLoading(false);
                var groupInfo = res.data.data;

                setSelectedGroup({ ...groupInfo });
            })
            .catch((error) => {
                setIsLoading(false);
            })
    }
    // console.log("selectedGroup", selectedGroup);
    return (
        <LoadingOverlay active={isLoading} spinner>
            <div className={isFromChat == true || isFromNote == true ? "" : "card-section"}>
                {(isFromNote != true && isFromChat != true) &&
                    <div className="add-section-title-row">
                        <h1 className="card-title">Assigned Tasks</h1>
                    </div>
                }
                <div className="row">
                    <div className="col-12">
                        <TaskSectionHeader
                            userTaskGroupList={userTaskGroupList}
                            selectedGroup={selectedGroup}
                            onSelectGroup={onSelectGroup}
                            setVisibleBody={setVisibleBody}
                            onDeleteGroup={onDeleteGroup}
                            isFromChat={isFromChat}
                            userInfo={userInfo}
                            isFromNote={isFromNote}
                            isAboveItem={isAboveItem}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {visibleBody && <TaskSectionBody
                            isNew={selectedGroup == "" || selectedGroup == undefined}
                            setVisibleBody={setVisibleBody}
                            selectedGroup={selectedGroup}
                            taskTemplateList={taskTemplateList}
                            onSubmitTaskGroup={onSubmitTaskGroup}
                            setSelectedGroup={setSelectedGroup}
                            setIsLoading={setIsLoading}
                            isFromChat={isFromChat}
                            pharmacyList={pharmacyList}
                            userInfo={userInfo}
                            isFromNote={isFromNote}
                            isAboveItem={isAboveItem}
                        />}
                        <TaskSectionTail userInfo={userInfo} />
                    </div>
                </div>
            </div>
        </LoadingOverlay>
    )
}

export default AssignedTask
