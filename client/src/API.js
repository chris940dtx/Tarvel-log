const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

export async function listLogEntries() {
<<<<<<< HEAD
  try {
    const baseUrl = API_URL.replace(/\/$/, '');
    
    const response = await fetch(`${baseUrl}/api/logs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching logs:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function createLogEntry(entry) {
  const baseUrl = API_URL.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/api/logs`, {
=======
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

export async function createLogEntry(entry) {
  const response = await fetch(`${API_URL}/api/logs`, {
>>>>>>> 4fb4c1c55f24e2e99187d26abd5b1ae5693b7bb2
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}
