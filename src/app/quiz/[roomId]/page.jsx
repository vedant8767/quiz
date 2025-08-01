"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ably } from '../../../utils/ably';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : '';

  useEffect(() => {
    if (!roomId) return;
    const channel = ably.channels.get(roomId);

    channel.subscribe('new-question', msg => {
      setQuestion(msg.data);
      setSelected(null);
    });

    return () => channel.detach();
  }, [roomId]);

  const submitAnswer = () => {
    if (!question || selected === null) return;
    ably.channels.get(roomId).publish('answer-submitted', {
      username,
      answer: question.options[selected],
    });
  };

  if (!question) return <p className="p-4">Waiting for question...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{question.question}</h1>
      <ul>
        {question.options.map((opt, idx) => (
          <li key={idx} className="mb-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="option"
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={submitAnswer}
        className="bg-blue-600 text-white p-2 mt-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}
