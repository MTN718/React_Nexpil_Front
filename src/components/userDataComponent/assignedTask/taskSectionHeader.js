import React from 'react'
import '../style.css'
function TaskSectionHeader(props) {
    const { userTaskGroupList, selectedGroup, onSelectGroup, setVisibleBody, onDeleteGroup, isFromChat, isFromNote, isAboveItem } = props;
    const userTaskGroupUIList = userTaskGroupList.map((groupInfo) => {
        return (
            <div key={`user_chat_task_key_${groupInfo.id}`}>
                {isFromChat == true ?
                    <div style={{ textAlign: 'center' }}>
                        <div className={groupInfo.is_status === "Incomplete" ? "patient-page-existing-task-style" : "patient-page-existing-task-title-style-complete"}
                            style={{ width: "95%" }}
                        >
                            <div style={{ width: "100%" }}>
                                <span className="float-left" style={groupInfo.is_status === "Incomplete" ? {color: 'black'} : {color: 'white'}} onClick={() => { onSelectGroup(groupInfo.id); setVisibleBody(true); }}>
                                    {groupInfo.name}
                                </span>
                                <span className="float-right" style={groupInfo.is_status === "Incomplete" ? {color: 'darkgray'} : {color: 'white'}}>
                                    {groupInfo.is_status}
                                </span>
                                {/* <span className="patient-page-delete-group-button float-right"
                                    style={{ marginRight: '5%' }}
                                    onClick={() => { onDeleteGroup(groupInfo.id); }}
                                >
                                    &times;
                    </span> */}
                            </div>
                        </div>
                    </div>
                    : <div className={isFromNote ? "patient-page-existing-task-style-from-note" : "patient-page-existing-task-style"}>
                        <div className="patient-page-existing-task-title-style" >
                            <span onClick={() => { onSelectGroup(groupInfo.id); setVisibleBody(true); }}>
                                {groupInfo.name}
                            </span>
                            <span className="patient-page-delete-group-button"
                                onClick={() => { onDeleteGroup(groupInfo.id); }}
                            >
                                &times;
                        </span>
                        </div>
                    </div>}
            </div>
        );
    });
    return (
        <div>
            {isFromChat == true
                ? <div>
                    {userTaskGroupUIList}
                    <div
                        // className="patient-page-existing-task-completed-style add-button patient-page-add-task-button-style"
                        className="patient-page-add-task-button-style"
                        style={{ width: "95%", textAlign: 'center' }}
                        onClick={() => { onSelectGroup(""); setVisibleBody(true); }}
                    >
                        Add New Task
                    </div>
                </div>
                :
                isFromNote == true
                    ? isAboveItem == true
                        ? <div className="patient-page-existing-task-container-style">
                            {userTaskGroupUIList}
                        </div>
                        : <div className="patient-page-existing-task-container-style">
                            <div
                                // className="patient-page-existing-task-completed-style add-button patient-page-add-task-button-style"
                                className="patient-page-add-task-button-style"
                                onClick={() => { onSelectGroup(""); setVisibleBody(true); }}
                            >
                                Add New Task
                            </div>
                        </div>
                    :
                    <div className="patient-page-existing-task-container-style">
                        <div
                            // className="patient-page-existing-task-completed-style add-button patient-page-add-task-button-style"
                            className="patient-page-add-task-button-style"
                            onClick={() => { onSelectGroup(""); setVisibleBody(true); }}
                        >
                            Add New Task
                        </div>
                        {userTaskGroupUIList}
                        <div className="assigned-tasks-container row"></div>
                    </div>

            }

        </div>
    )
}

export default TaskSectionHeader
