const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

export async function listLogEntries() {
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
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}

export async function deleteLogEntry(id) {
  const baseUrl = API_URL.replace(/\/$/, '');
  const url = `${baseUrl}/api/logs/${id}`;
  
  console.log('=== DELETE REQUEST DEBUG ===');
  console.log('Attempting to delete entry at:', url);
  console.log('Entry ID:', id);
  console.log('ID type:', typeof id);
  console.log('ID length:', id.length);
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`Failed to delete log entry with id ${id}. Status: ${response.status}. Response: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Delete successful, result:', result);
    return result;
  } catch (error) {
    console.log('Fetch error:', error);
    throw error;
  }
}
