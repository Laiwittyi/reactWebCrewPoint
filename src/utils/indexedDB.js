import { openDB } from 'idb';
import _, { forEach } from 'lodash';

export const dbName = 'crewPoint';
export const storeName = 'crewList';
export const key = 'crew-list';
export const ALL_SHOP_INFORMATION_TABLE = 'shop';
export const ALL_SHOP_INFORMATION_KEY = 'all_shop_information';

// Open IndexedDB

const openDatabase = async (dynamicStoreNameList) => {
    const db = await openDB(dbName, 1, {
        upgrade(db) {
            forEach(dynamicStoreNameList, function (dynamicStoreName) {
                if (!db.objectStoreNames.contains(dynamicStoreName)) {
                    db.createObjectStore(dynamicStoreName);
                }
            });

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
export const getAllFromIndexedDB = async (dynamicStoreNameList) => {
    const db = await openDatabase(dynamicStoreNameList);
    const tempList = await Promise.all(
        dynamicStoreNameList.map(async (dynamicStoreName) => {
            let obj = {};
            obj[dynamicStoreName] = await db.getAll(dynamicStoreName);
            return obj;
        })
    );
    const mergedTempList = Object.assign({}, ...tempList);
    return mergedTempList;
};

export const saveToIndexedDB = async (data, dynamicStoreName, dynamicKey) => {
    const db = await openDatabase(new Array(dynamicStoreName));
    const tx = db.transaction(dynamicStoreName, 'readwrite');
    const store = tx.objectStore(dynamicStoreName);

    // Save data under the key 'crew'
    await store.put(data, dynamicKey);
    await tx.done;
};

export const getCrewData = async () => {
    const db = await openDatabase(new Array(storeName));
    return await db.get(storeName, key);
};
// export const saveToIndexedDB = async (data) => {
//     const db = await openDatabase();
//     await db.put(storeName, data);
// };
// Add data to the store
export const addData = async (data) => {
    const db = await openDatabase(new Array(storeName));
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(data);
    await tx.done;
};

// Retrieve data from the store
export const getData = async (id) => {
    const db = await openDatabase(new Array(storeName));
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.get(id);
};

// Get all data from the store
export const getAllData = async () => {
    const db = await openDatabase(new Array(storeName));
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.getAll();
};

// Delete data from the store
export const deleteData = async (dynamicStoreName, id) => {
    const db = await openDatabase(new Array(dynamicStoreName));
    const tx = db.transaction(dynamicStoreName, 'readwrite');
    const store = tx.objectStore(dynamicStoreName);
    await store.delete(id);
    await tx.done;
};

export async function searchCrewListById(id) {
    let crewList = await getCrewData();
    const result = _.find(crewList, { EmployeeID: id },);
    console.log(result);
    return (!result ? [false, '社員コードを持つ社員がいません！'] : [true, result.EmployeeName])
}
