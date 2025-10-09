import * as zmq from "zeromq"
import "dotenv/config"
import { config } from "../../config.ts"

export const sock = new zmq.Subscriber()
const [HOST, PORT] = [
  process.env.ACTOR_LISTENING_HOST_PUBSUB,
  process.env.ACTOR_LISTENING_PORT_PUBSUB
]

export const init = async () => {
  try {
    sock.connect(`${HOST}:${PORT}`)
    sock.subscribe(config.TYPE)
    console.log("Listening to " + `${HOST}:${PORT}`)

    setTimeout(async () => {
      await new Promise((resolve, reject) => {
        resolve(true)
      })
    }, 500);
  } catch (err) {
    console.log(err)
  }
}