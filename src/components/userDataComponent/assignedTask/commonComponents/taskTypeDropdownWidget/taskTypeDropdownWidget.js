import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { server } from '../../../../../config/server';
import '../../../style.css'
import { ALL_TASK_NAME, TASKNAME, TASKTYPE, getEnumKeyByValue } from '../../enum_task';
function TaskTypeDropdownWidget(props) {
    const { selTaskType, setSelTaskType, isFromChat } = props;
    const [isVisible, setIsVisible] = useState(false);
    const taskTypeList = [
        { itemKey: TASKTYPE.list, title: TASKNAME.list },
        { itemKey: TASKTYPE.prescribe_medication, title: TASKNAME.prescribe_medication },
        { itemKey: TASKTYPE.treatment_plan, title: TASKNAME.treatment_plan },
        { itemKey: TASKTYPE.appintment_scheduling, title: TASKNAME.appintment_scheduling },
        { itemKey: TASKTYPE.refer_to_doctor, title: TASKNAME.refer_to_doctor },
        { itemKey: TASKTYPE.questionnaire, title: TASKNAME.questionnaire },
    ];

    const childUIList = taskTypeList.map((listInfo, index) => {
        return <li key={`key_${listInfo.itemKey}_${index}`}
            className="dropdown-item type_btn"
            onClick={() => { setIsVisible(false); setSelTaskType(listInfo.itemKey) }}
        >
            {listInfo.title}
        </li>
    });
    const title = selTaskType === TASKTYPE.none ? "Task Type" : taskTypeList.filter(x => x.itemKey == selTaskType)[0].title;
    return (
        <div className={"task_btn-group"}
            style={isFromChat ? { width: "95%", textAlign: 'left' } : { float: 'left', width: "35%" }}
        // onMouseLeave={() => { setIsVisible(false) }}
        >
            <div
                onClick={() => { setIsVisible(true); }}
                className="col2-roundblocktask"
                data-toggle="dropdown"
                aria-expanded="true"
            >
                <h4 className="round_head"><span className="task_type_btn">{title}</span>
                    <span className="round_arrow-add-task">&gt;</span>
                </h4>
            </div>

            {isVisible && <ul className="dropdown-menu shildra_task_ul_dropdown" id="task-type" x-placement="bottom-start">
                {childUIList}
            </ul>}
        </div>
    )
}

export default TaskTypeDropdownWidget
