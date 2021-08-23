import React from 'react';
import '../style.css';

const diagnosesData = [
    {
        title: "Type1 Diabetes",
        description: "10-03-2019",
    }, {
        title: "Hyperetension",
        description: "10-03-2019",
    }, {
        title: "Hyperlipidemia",
        description: "10-03-2019",
    }
]
export const Diagnoses = () => {
    return <div className="medical-no-report">
        <p className="medical-no-report-text">No Reported Diagnoses</p>
    </div>
    return (
        <div className="immunizations-container">
            <div className="immunizations-data-row-container">

                {diagnosesData.map((item, i) =>
                    <div key={i} className="immunization-data-part">
                        <p className="immunization-data-title">{item.title}</p>
                        <p className="immunization-data-description">{item.description}</p>
                    </div>
                )}

            </div>
        </div>
    )
}
