import type {
  MapLocation,
  Road,
} from "../data/mapData";

import type {
  SharedRoutePayload,
} from "./routeShare";


const DB_NAME = "resqmesh-offline";

const DB_VERSION = 1;

const MAP_STORE = "mapSnapshot";

const ROUTE_STORE = "receivedRoutes";


export interface OfflineMapSnapshot {
  locations: MapLocation[];

  roads: Road[];

  savedAt: number;
}


/* =========================================
   OPEN DATABASE
========================================= */

function openDatabase(): Promise<IDBDatabase> {
  return new Promise(
    (resolve, reject) => {

      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION
        );


      request.onupgradeneeded = () => {

        const db =
          request.result;


        if (
          !db.objectStoreNames.contains(
            MAP_STORE
          )
        ) {

          db.createObjectStore(
            MAP_STORE
          );

        }


        if (
          !db.objectStoreNames.contains(
            ROUTE_STORE
          )
        ) {

          db.createObjectStore(
            ROUTE_STORE
          );

        }

      };


      request.onsuccess = () => {

        resolve(
          request.result
        );

      };


      request.onerror = () => {

        reject(
          request.error ??
            new Error(
              "Unable to open offline database."
            )
        );

      };

    }
  );
}


/* =========================================
   SAVE MAP SNAPSHOT
========================================= */

export async function saveMapSnapshot(
  locations: MapLocation[],
  roads: Road[]
): Promise<void> {

  const db =
    await openDatabase();


  const snapshot:
    OfflineMapSnapshot = {

    locations,

    roads,

    savedAt:
      Date.now(),

  };


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          MAP_STORE,
          "readwrite"
        );


      transaction.objectStore(
        MAP_STORE
      ).put(
        snapshot,
        "latest"
      );


      transaction.oncomplete = () => {

        db.close();

        resolve();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error ??
            new Error(
              "Failed to save map snapshot."
            )
        );

      };

    }
  );
}


/* =========================================
   GET MAP SNAPSHOT
========================================= */

export async function getMapSnapshot(): Promise<
  OfflineMapSnapshot | null
> {

  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          MAP_STORE,
          "readonly"
        );


      const request =
        transaction
          .objectStore(
            MAP_STORE
          )
          .get("latest");


      request.onsuccess = () => {

        db.close();

        resolve(
          request.result ??
            null
        );

      };


      request.onerror = () => {

        db.close();

        reject(
          request.error ??
            new Error(
              "Failed to read map snapshot."
            )
        );

      };

    }
  );
}


/* =========================================
   SAVE RECEIVED ROUTE
========================================= */

export async function saveReceivedRoute(
  route: SharedRoutePayload
): Promise<void> {

  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          ROUTE_STORE,
          "readwrite"
        );


      transaction.objectStore(
        ROUTE_STORE
      ).put(
        {
          ...route,

          receivedAt:
            Date.now(),
        },
        "latest"
      );


      transaction.oncomplete = () => {

        db.close();

        resolve();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error ??
            new Error(
              "Failed to save received route."
            )
        );

      };

    }
  );
}


/* =========================================
   GET RECEIVED ROUTE
========================================= */

export async function getReceivedRoute(): Promise<
  SharedRoutePayload | null
> {

  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          ROUTE_STORE,
          "readonly"
        );


      const request =
        transaction
          .objectStore(
            ROUTE_STORE
          )
          .get("latest");


      request.onsuccess = () => {

        db.close();

        const value =
          request.result;


        if (!value) {

          resolve(null);

          return;

        }


        /*
         * Remove local-only field
         * before returning payload.
         */

        const {
          receivedAt: _receivedAt,
          ...route
        } = value;


        resolve(
          route as SharedRoutePayload
        );

      };


      request.onerror = () => {

        db.close();

        reject(
          request.error ??
            new Error(
              "Failed to read received route."
            )
        );

      };

    }
  );
}


/* =========================================
   CLEAR RECEIVED ROUTE
========================================= */

export async function clearReceivedRoute(): Promise<void> {

  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          ROUTE_STORE,
          "readwrite"
        );


      transaction.objectStore(
        ROUTE_STORE
      ).delete("latest");


      transaction.oncomplete = () => {

        db.close();

        resolve();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error ??
            new Error(
              "Failed to clear received route."
            )
        );

      };

    }
  );
}