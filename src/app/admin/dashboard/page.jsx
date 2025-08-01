"use client";
import { useEffect, useState } from "react";
import { ably } from "../../../utils/ably";

export default function Dashboard() {
  const roomId =
    typeof window !== "undefined" ? localStorage.getItem("roomId") : "";
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const questions = [
    {
      question: "What's the capital of India?",
      options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
    },
  ];

  useEffect(() => {
    if (!roomId) return;
    const channel = ably.channels.get(roomId);

    channel.subscribe("answer-submitted", (msg) => {
      const ans = msg.data.answer;
      setResponses((prev) => ({
        ...prev,
        [ans]: (prev[ans] || 0) + 1,
      }));
    });

    // Listen for join-request and send current question
    channel.subscribe("join-request", () => {
      channel.publish("new-question", questions[questionIndex]);
    });

    return () => channel.detach();
  }, [roomId, questionIndex]);

  const sendQuestion = () => {
    const channel = ably.channels.get(roomId);
    channel.publish("new-question", questions[questionIndex]);
    setResponses({});
  };

  const nextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    sendQuestion();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard - Room ID: {roomId}</h1>
      <button
        onClick={sendQuestion}
        className="bg-blue-600 text-white p-2 rounded mb-4"
      >
        Start / Resend Question
      </button>
      <div className="mb-4">
        <h2 className="font-bold text-lg">
          {questions[questionIndex]?.question}
        </h2>
        {Object.entries(responses).map(([option, count], idx) => (
          <div key={idx}>
            {option}: {count}
          </div>
        ))}
      </div>
      {questionIndex < questions.length - 1 && (
        <button
          onClick={nextQuestion}
          className="bg-green-600 text-white p-2 mt-2 rounded"
        >
          Next Question
        </button>
      )}
    </div>
  );
}
