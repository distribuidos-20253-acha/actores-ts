import zmq from "zeromq"

const replier = new zmq.Reply()

const init = (): Promise<boolean> => {
  const host = process.env.LOAD_MANAGER_HOST
  const port = process.env.LOAD_MANAGER_PORT

  return new Promise(async (resolve, reject) => {
    try {
      replier.bind(`${host}:${port}`)
      console.log("Listening in " + `${host}:${port}`)
      setTimeout(() => {
        resolve(true)
      }, 500);
    } catch (err) {
      reject(false)
    }
  })
}

const exportObj = {
  init,
  sock: replier
}

export default exportObj