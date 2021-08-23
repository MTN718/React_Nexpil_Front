import React from 'react';
import './style.css';

const immunizationData = [
    {
        title: "Hepatitis A",
        description: "10-03-2019",
    }, {
        title: "Hepatitis A",
        description: "10-03-2019",
    }, {
        title: "influnza",
        description: "10-03-2019",
    }, {
        title: "TDAP",
        description: "10-03-2019",
    }, {
        title: "HPV",
        description: "10-03-2019",
    }, {
        title: "Zoster",
        description: "10-03-2019",
    }, {
        title: "Meningitis",
        description: "10-03-2019",
    }
]

export const Immunizations = () => {
    return <div className="medical-no-report">
        <p className="medical-no-report-text">No Reported Immunizations</p>
    </div>
    return (
        <div className="immunizations-container">
            <div className="immunizations-data-row-container">

                {immunizationData.map((item, i) =>
                    <div key={i} className="immunization-data-part">
                        <p className="immunization-data-title">{item.title}</p>
                        <p className="immunization-data-description">{item.description}</p>
                    </div>
                )}

            </div>
        </div>
    )
}
