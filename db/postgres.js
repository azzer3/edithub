import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:190312424Globulle3@@db.fmazomxtisawefszcdbd.supabase.co:5432/postgres"
});

export default pool;
