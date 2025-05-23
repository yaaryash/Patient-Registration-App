import { PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";
import { live } from "@electric-sql/pglite/live";

worker({
  async init() {
    const db = new PGlite("idb://patient-registration-db", {
      extensions: {
        live,
      },
      relaxedDurability: true,
    });
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT,
          purpose TEXT,
          phoneNumber TEXT,
          age INTEGER,
          createdAt TEXT
        );
      `);
    } catch (error) {
      console.error("PGlite worker error during table creation:", error);
    }

    return db;
  },
});
