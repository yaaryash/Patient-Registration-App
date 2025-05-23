import { PGliteWorker } from '@electric-sql/pglite/worker';

let db = null;
let initialized = false;
let initPromise = null;

export const initDb = async () => {
  if (initialized) return true;
  
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      
      db = await PGliteWorker.create(
        new Worker(new URL('./pglite-worker.js', import.meta.url), {
          type: 'module'
        })
      );
      
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
    
    console.log('Adding patient:', newPatient);
    
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
    
    console.log('Patient added successfully');
    return newPatient;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
}; 