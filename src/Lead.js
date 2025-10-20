import React, { useEffect, useState } from 'react';




function Lead({employee}) {
    const [leaderplan, setPlan1] = useState("");
    useEffect(() => {
        const fetchLeaderPlan = async () => {
      try {
        const response = await fetch("http://localhost:5001/reskill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: employee.name }), 
        });
  
        const data = await response.json();
        setPlan1(data.plan);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    if (employee) {
        fetchLeaderPlan();
      }
    }, [employee]);
    
    return <ul class="quality-list">
        {leaderplan.split('\n').map((line, idx) => (
            <li class="quality-item" key={idx}>{line}</li>
        ))}
    </ul>;
};

export default Lead;