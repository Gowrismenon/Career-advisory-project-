// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import generateLeadershipPlan from "./leadership.js";
import generateReskillPlan from "./reskill.js";

// Load JSON file synchronously (at server start)
const dataPath = path.resolve("./backend/employees.json"); // replace with your JSON file path
const rawData = fs.readFileSync(dataPath, "utf-8");
const jsonData = JSON.parse(rawData);
//console.log(jsonData);
const data = path.resolve("./backend/reskill.json");
const raw = fs.readFileSync(data, "utf-8");
const reskill = JSON.parse(raw);
//console.log(JSON.stringify(reskill, null, 2));

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  //console.log("Received:", message);
  try {
    //console.log(process.env.OPENAI_API_KEY);
    const response = await fetch(
      "https://psacodesprint2025.azure-api.net/openai/deployments/gpt-4.1-nano/chat/completions?api-version=2025-01-01-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":"52dbccc9fe35400da314e3770f756e2d",
        },
        body: JSON.stringify({
          model:"gpt-4.1-nano",
          messages: [{role: "system", content:"You are a mental health coach only when they use feelings. Always reply briefly and kindly. Never give medical advice."},
            {role: "system", content:"When user asks 'I feel stressed or anxious'or any negative emotions tell them Feeling stressed can be really heavy. 💛Here are a few things you could try right now to ease the tension:Breathe deeply – Take 5 slow breaths in and out, focusing only on your breathing.Move your body – Stretch, walk, or do a few gentle exercises to release stress.Write it out – Jot down what’s on your mind; sometimes just putting it on paper helps.Small positive action – Even something tiny like making a cup of tea, listening to a song you like, or stepping outside for a moment.Talk to someone – A friend, family member, or a counselor can help lighten the load."},
            {role: "system", content:"Dont ask any form of questions in your reply"},
            {role:"system", content:"when user asks 'I feel bored' reply by saying 'Read books, go out for a walk, talk to friends and families, learn somethin new like Crocheting, solve puzzles, clean your house, cook' or any other actvities. Always respond with positive emotions."},
            {role:"system", content:"when the user says something sad or negative emotion respond by saying'Its time to take your mind of work. Do some activites that can help you lighten your load. Breathing and doing yoga helps in the mental well-being. Art can bring joy.' Add some other activities as mentioned previously into it."},
            {role: "system", content:`${message}. Employee info: ${JSON.stringify(jsonData)}`},
            {role: "system", content : `${message}.Recommends personalised career pathways, internal mobility options and upskilling or reskilling plans based on skill gaps. Refer the file. Skills needed for different types of job is given here: ${JSON.stringify(reskill)}`},
            {role:"system", content : "when technical questions like about reskilling or promotions are asked, never answer them with emotions like 'Feeling curious is nice'. Get straight to the point."},
            {role:"system", content:"When reskilling plans are asked \
              1. eg:reskill plan for cloud security architect is asked, answer it in proper bullet points. \
              when answering in bullet points mentions the job that can be reskilled to and in brackets write the time taken to reskill into that particular position.\
              eg : Cloud Security Specialist(0 - 1 years) and mention the skills needed to be added on and learned. \
                   Enterprise Architect(1 - 2 years) and as it goes on for the next job, the year span should be starting from the previous jobs ending year plus an additional year. \
                   2. it should be properly formatted like this '1 . Cloud Security Specialist(0 - 1 years)\n' and the skills must be below it in a new line (add a newline character'\\n' for linebreaks) and the next job must be in a new line.\
                   3. Example format:- Cloud Security Specialist(0 - 1 years): \n  Skills: ...\n"},
            {role: "system", content : "when reskilling is asked, only say which position can the person reskill to and mention the skillset required. "},
            {role:"system", content: "if role/job is admin just say 'you are the admin' or something like that"},
            {role: "system", content :"When asked for reskilling check these criterias : 1. reskill to the position just above it 2.reskilling plan should be given based on the skillsets the person doesnt have for the next job."},
            {role: "user", content: message }],
          max_tokens: 200,
          temperature: 1,
        }),
      }
    );

    const data = await response.json();
    //console.log(data);
    const reply = data.choices?.[0]?.message?.content || "No response";
    //console.log(reply);
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ reply: "Error occurred" });
  }
});

app.post("/reskill", async (req, res) => {
  try {
    const { name } = req.body;  // Get name from POST body
    //console.log("Received name:", name);

    const plan = await generateLeadershipPlan(name);
    res.json({ plan });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate reskill plan" });
  }
});

app.post("/chat2.0", async (req, res) => {
  try {
    //console.log(req.body);
    const { name, department } = req.body;  // Get name from POST body

    const plan = await generateReskillPlan(name, department);
    res.json({ plan });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate reskill plan" });
  }
});


app.get("/api/chat", (req, res) => {
  res.send("GET route exists — use POST for chat");
});
app.get("/reskill", (req, res) => {
  res.send("GET route exists — use POST for chat");
});
app.get("/chat2.0", (req, res) => {
  res.send("GET route exists — use POST for chat");
});
app.listen(5001, () => console.log("Server running on http://localhost:5001"));




