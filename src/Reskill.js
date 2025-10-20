import React, { useEffect, useState } from 'react';


function Reskill({employee}) {
    const [reskillplan, setPlan2] = useState("");
    useEffect(() => {
        const fetchReskillPlan = async () => {
          try {
            const response = await fetch("http://localhost:5001/chat2.0", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: employee.name, department: employee.department }), 
            });
      
            const data = await response.json();
            setPlan2(data.plan);
          } catch (err) {
            console.error("Error:", err);
          }
        };
      
        if (employee) {
          fetchReskillPlan();
        }
      }, [employee]);

      return <div className='pathway-card'>
        {reskillplan.split('\n').map((line, idx) => (
            <div className='skills-section' key={idx}>{line}</div>
        ))}
      </div>;
}

export default Reskill;