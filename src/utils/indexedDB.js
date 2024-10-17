import { openDB } from 'idb';

const dbName = 'crewPoint';
const storeName = 'crewList';
const key = 'crew-list';

// Open IndexedDB

const openDatabase = async () => {
    const db = await openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);


            }
        },
    });
    return db;
};
// export const openDatabase = async () => {
//     const db = await openDB(dbName, 1, {
//         upgrade(db) {
//             db.createObjectStore(storeName, {
//                 keyPath: 'id', // You can change this based on your object structure
//                 autoIncrement: true,
//             });
//         },
//     });
//     return db;
// };
export const getAllFromIndexedDB = async () => {
    const db = await openDatabase();
    return await db.getAll(storeName);
};

export const saveToIndexedDB = async (data) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    // Save data under the key 'crew'
    await store.put(data, key);
    await tx.done;
};

export const getCrewData = async () => {
    const db = await openDatabase();
    return await db.get(storeName, key);
};
// export const saveToIndexedDB = async (data) => {
//     const db = await openDatabase();
//     await db.put(storeName, data);
// };
// Add data to the store
export const addData = async (data) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(data);
    await tx.done;
};

// Retrieve data from the store
export const getData = async (id) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.get(id);
};

// Get all data from the store
export const getAllData = async () => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.getAll();
};

// Delete data from the store
export const deleteData = async (id) => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(id);
    await tx.done;
};
