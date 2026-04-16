"use client";

import React, { useState } from 'react';
import { formService } from '@/services/formService';
import { authService } from '@/services/authService';

export default function TestApiPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testGetForms = async () => {
    setLoading(true);
    addLog("Testing GET /api/forms...");
    try {
      const response = await formService.getForms();
      addLog(`Success! Received ${response.data.totalElements} forms.`);
      console.log("Forms Response:", response);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    addLog("Testing POST /api/auth/register...");
    try {
      const response = await authService.register({
        username: `testuser_${Math.floor(Math.random() * 1000)}`,
        password: "password123",
        role: "USER"
      });
      addLog(`Success! Registered user: ${response.data.username}`);
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-surface text-on-surface">
      <h1 className="text-3xl font-bold mb-8 text-primary">API Connection Tester</h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={testGetForms} 
          disabled={loading}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:opacity-90 disabled:opacity-50"
        >
          Test Get Forms (Public)
        </button>

        <button 
          onClick={testRegister} 
          disabled={loading}
          className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-bold hover:opacity-90 disabled:opacity-50"
        >
          Test Register (Auth)
        </button>
      </div>

      <div className="bg-surface-container-high p-6 rounded-xl font-mono text-sm border border-outline-variant/30">
        <h2 className="text-lg font-bold mb-4 text-on-surface">Execution Logs:</h2>
        {logs.length === 0 ? (
          <p className="text-on-surface-variant italic">No logs yet. Click a button to test.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="text-on-surface">{log}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
