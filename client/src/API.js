const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

export async function listLogEntries() {
  try {
    const baseUrl = API_URL.replace(/\/$/, '');
    console.log('API_URL:', process.env.REACT_APP_API_URL);
    console.log('baseUrl:', baseUrl);
    console.log('Full URL:', `${baseUrl}/api/logs`);
    
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
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}
