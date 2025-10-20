import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./feedbackPage.css";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Directly set submitted to true without sending to backend
    setSubmitted(true);
  };

  // Optional: auto-redirect after 3 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => navigate("/dashboard"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  if (submitted) {
    return (
      <div className="feedback-submitted-screen">
        <div className="feedback-submitted-card">
          <h2>✅ Feedback Submitted!</h2>
          <p>Thank you for sharing your thoughts. 💛</p>
          <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <form onSubmit={handleSubmit} className="feedback-form">
        <h2>Feedback on Advice</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <textarea
          placeholder="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
