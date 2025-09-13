import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
const DB_CONNECT = process.env.DB_CONNECT
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

export { PORT, DB_CONNECT, FRONTEND_ORIGIN }
