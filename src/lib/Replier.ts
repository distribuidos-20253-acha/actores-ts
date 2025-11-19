import { writeLog, writeLogSync } from "@acha/distribuidos"
import zmq from "zeromq"

export const replier = new zmq.Reply()
const [HOST, PORT] = [
  process.env.LOAD_MANAGER_HOST,
  process.env.LOAD_MANAGER_PORT
]

export const initReplier = async () => {
  await writeLog(`Trying to listen to load manager network with params [load_manager_host=${HOST}, load_manager_port=${PORT}]`)

  try {
    await replier.bind(`${HOST}:${PORT}`)

    setTimeout(async () => {
      await new Promise((resolve, reject) => {
        writeLogSync(`Sock binded [${HOST}:${PORT}]`)
        console.log("Listening in " + `${HOST}:${PORT}`)
        resolve(true)
      })
    }, 500);
  } catch (err) {
    console.log(err)
  }
}