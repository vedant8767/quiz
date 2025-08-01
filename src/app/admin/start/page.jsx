"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function StartQuiz() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');

  const createRoom = () => {
    const roomId = uuidv4().slice(0, 6);
    localStorage.setItem('adminName', adminName);
    localStorage.setItem('roomId', roomId);
    router.push('/admin/dashboard');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Quiz Room</h1>
      <input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Admin Name" className="border p-2 mb-2 block" />
      <button onClick={createRoom} className="bg-green-600 text-white px-4 py-2 rounded">Create Room</button>
    </div>
  );
}
