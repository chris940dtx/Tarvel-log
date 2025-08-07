import { auth } from "./firebase";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User Not Authenticated");
  }
  return await user.getIdToken();
};

export async function listLogEntries() {
  try {
    const token = await getAuthToken();
    const baseUrl = API_URL.replace(/\/$/, "");

    const response = await fetch(`${baseUrl}/api/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching logs:", error);
    return []; // Return empty array instead of throwing
  }
}

export async function createLogEntry(entry) {
  try {
    const token = await getAuthToken();
    const baseUrl = API_URL.replace(/\/$/, "");

    const response = await fetch(`${baseUrl}/api/logs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });
    return response.json();
  } catch (error) {
    console.log("Error creating log entry:", error);
    throw error;
  }
}

export async function deleteLogEntry(id) {
  try {
    const token = await getAuthToken();
    const baseUrl = API_URL.replace(/\/$/, "");
    const url = `${baseUrl}/api/logs/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete log entry. Status: ${response.status}. Response: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.log("Error deleting log entry:", error);
    throw error;
  }
}
