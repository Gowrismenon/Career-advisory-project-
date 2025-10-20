import fetch from "node-fetch";
import fs from "fs";
import { Content } from "openai/resources/containers/files.mjs";

// Load JSON files
const employees = JSON.parse(fs.readFileSync("./backend/employees.json", "utf-8"));
const leadershipSkills = JSON.parse(fs.readFileSync("./backend/leadership_skills.json", "utf-8"));

// OpenAI embedding function
async function getEmbedding(text) {
  //console.log(text);
  const response = await fetch(
    "https://psacodesprint2025.azure-api.net/text-embedding-3-small/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "52dbccc9fe35400da314e3770f756e2d"
      },
      body: JSON.stringify({
        model:"text-embedding-3-small",
        input:text
    })
  });
  const data = await response.json();
  //console.log(data.data[0].embedding);
  return data.data[0].embedding;
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Generate reskill plan
async function generateLeadershipPlan(name) {
  // Compute leadership embeddings once
  const leadershipEmbeddings = [];
  for (let skillset of leadershipSkills) {
    const embedding = await getEmbedding(skillset.skill);
    leadershipEmbeddings.push(embedding);
  }

    const employeeText = employees.find(e=> e.personal_info.name == name).competencies.map(x=>x.name + ":"+x.level);
    const employeeEmbeddings = await Promise.all(
      employeeText.map(text => getEmbedding(text))
    );

    const gaps = [];
    let plan="";
    let c=1;
    for (let i = 0; i < leadershipSkills.length; i++) {
      let curr = ["", "","",0];
      for (let j = 0; j < employeeText.length; j++){
        const sim = Number(cosineSimilarity(employeeEmbeddings[j], leadershipEmbeddings[i]));
        //console.log(sim);
        if (curr[3] < sim) curr = [leadershipSkills[i].skill, leadershipEmbeddings[i],employeeText[j],sim];
      } 
      //console.log(curr);
        if (curr[3] < 0.8 && curr[3] >= 0.6){
            const x = curr[2].split(":");
            plan += `${c}. Strengthen ${leadershipSkills[i].skill.split(":")[0]}${
              ` from ${x[1]} to ${leadershipSkills[i].skill.split(":")[1]}` 
            }\n`;
            c++;
            continue;
        } else if (curr[3] < 0.6) {
          plan+=`${c}. ${leadershipSkills[i].skill.split(":")[0]}\n`;
          c++;
          continue;
        }
    }
    return plan;
    gaps.sort((a,b)=>b[1]-a[1]);
    //console.log(gaps);
    // Build timeline plan
    //let plan = "";
    //let startYear = 0;
    for (let i = 0; i < gaps.length; i++) {
      const z = gaps[i][0].split(":");
      const x = employeeEmbeddings.find(e=>cosineSimilarity(e,gaps[i][1]));
      //console.log(gaps[i][0]);
      //console.log(employeeText);
      if (x == undefined){
         plan+=`${i + 1}. Strengthen ${z[0]} — Suggested Timeline: ${startYear}–${startYear + 1}\n`;
         startYear++;
         continue;
      }
      const y = x.split(":");
      plan += `${i + 1}. Strengthen ${z[0]}${
        ` from ${y[1]} to ${z[1]}` 
      } — Suggested Timeline: ${startYear}–${startYear + 1}\n`;
      startYear += 1;
    }

    //console.log(plan);
    return plan;
  
}


//export default generateReskillPlan;
export default generateLeadershipPlan;

