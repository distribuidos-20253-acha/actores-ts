import * as zmq from "zeromq"
import "dotenv/config"
import { Config, writeLog, writeLogSync } from "@acha/distribuidos"
const config = Config.getInstance()

export const sock = new zmq.Subscriber()
const [HOST, PORT] = [
  process.env.ACTOR_LISTENING_HOST_PUBSUB,
  process.env.ACTOR_LISTENING_PORT_PUBSUB
]

export const init = async () => {
  await writeLog(`Trying to init actor pub/sub with params [HOST_PUBSUB=${HOST}, PORT_PUBSUB=${PORT}]`)

  try {
    await sock.connect(`${HOST}:${PORT}`)
    await sock.subscribe(config.get("type"))
    await writeLog(`Subscribed to ${config.get("type")}`)

    setTimeout(async () => {
      await new Promise((resolve, reject) => {
        writeLogSync(`Connected to [${HOST}:${PORT}]`)
        console.log("Listening to " + `${HOST}:${PORT}`)
        resolve(true)
      })
    }, 500);
  } catch (err) {
    console.log(err)
  }
}