"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    localStorage.setItem('username', name);
    router.push(`/quiz/${roomId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Join Quiz</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="border p-2 mb-2 block" />
      <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Room ID" className="border p-2 mb-2 block" />
      <button onClick={handleJoin} className="bg-blue-600 text-white px-4 py-2 rounded">Join</button>
    </div>
  );
}
