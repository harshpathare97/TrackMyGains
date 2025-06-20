import { openDB } from "idb";

const DB_NAME = "OfflineDB";
const STORE_VERSION = 2;
const STORE_SAVE = "save";
const STORE_UPLOAD = "upload";

export async function initDB() {
  return await openDB(DB_NAME, STORE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_SAVE)) {
        db.createObjectStore(STORE_SAVE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORE_UPLOAD)) {
        db.createObjectStore(STORE_UPLOAD, { keyPath: "id" });
      }
    },
  });
}

// Save functions
export async function saveLogs(id, logs) {
  const db = await initDB();
  await db.put(STORE_SAVE, { id, logs });
}

export async function getSave(id) {
  const db = await initDB();
  return await db.get(STORE_SAVE, id);
}
export async function deleteSave(id) {
  const db = await initDB();
  return await db.delete(STORE_SAVE, id);
}

// Upload function
export async function uploadLogs(id, logs) {
  const db = await initDB();
  await db.put(STORE_UPLOAD, { id, logs });
}

export async function getUpload() {
  const db = await initDB();
  return await db.getAll(STORE_UPLOAD);
}
export async function deleteUpload(id) {
  const db = await initDB();
  return await db.delete(STORE_UPLOAD, id);
}

export async function syncLogsToServer() {
  const allLogs = await getUpload();

  for (const log of allLogs) {
    try {
      const response = await fetch(`/api/workouts/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ id:log.id, logs:log.logs }),
        });

        const res = await response.json();

      if (res.success) {
        await deleteUpload(log.id);
      } else {
        console.warn(`Failed to sync log ${log.id}`);
      }
    } catch (err) {
      console.error(`Error syncing log ${log.id}:`, err);
    }
  }
}