import { PGliteWorker } from '@electric-sql/pglite/worker';
import { live } from '@electric-sql/pglite/live';

let db = null;
let initialized = false;
let initPromise = null;
let liveQueries = {};

export const initDb = async () => {
  if (initialized) return true;
  
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      
      db = await PGliteWorker.create(
        new Worker(new URL('./pglite-worker.js', import.meta.url), {
          type: 'module'
        }),
        {
          extensions: {
            live
          }
        }
      );

      db.onLeaderChange(() => {
        console.log('PGlite worker leadership changed, current tab isLeader:', db.isLeader);
      });
      
      initialized = true;
      return true;
    } catch (error) {
      console.error('PGliteWorker initialization error:', error);
      initialized = false;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
};

export const getPatients = async () => {
  try {
    if (!initialized) {
      await initDb();
    }
    if (!db) {
      throw new Error('Database not initialized');
    }
    const result = await db.query('SELECT * FROM patients ORDER BY createdAt DESC');
    return result.rows || [];
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};

export const addPatient = async (patient) => {
  try {
    if (!initialized) {
      await initDb();
    }
    
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    const newPatient = {
      ...patient,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    
    await db.query(`
      INSERT INTO patients (id, name, purpose, phoneNumber, age, createdAt) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      newPatient.id,
      newPatient.name,
      newPatient.purpose,
      newPatient.phoneNumber,
      newPatient.age,
      newPatient.createdAt
    ]);
    
    return newPatient;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

export const executeSqlQuery = async (sql) => {
  try {
    if (!initialized) {
      await initDb();
    }
    if (!db) {
      throw new Error('Database not initialized');
    }
    const result = await db.query(sql);
    return result;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
};

export const createLivePatientQuery = async (callback) => {
  try {
    if (!initialized) {
      await initDb();
    }
    
    if (!db || !db.live) {
      throw new Error('Database or live query extension not initialized');
    }
    const queryId = 'patients-' + Date.now();
    
    const liveQuery = await db.live.query(
      'SELECT * FROM patients ORDER BY createdAt DESC',
      [],
      (result) => {
        console.log('Live query update received:', result);
        if (callback && typeof callback === 'function') {
          callback(result.rows || []);
        }
      }
    );

    liveQueries[queryId] = liveQuery;

    return {
      ...liveQuery,
      queryId
    };
  } catch (error) {
    console.error('Error creating live query:', error);
    throw error;
  }
};
