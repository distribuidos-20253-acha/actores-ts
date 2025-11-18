import { program } from "commander";
import { init, sock } from "./src/lib/ServerApp.ts";
import inputExecution from "./src/inputExecution/index.ts";
import replier from "./src/lib/Replier.ts"
import { inputSchema, isValid, type BibInput } from "@acha/distribuidos/schemas/InputSchema";
import { Config, showFigletTitle, writeLog } from "@acha/distribuidos";
const config = Config.getInstance();
config.setVersion("0.1.15")

program
  .option('-v, --verbose')
  .option('-t, --type <type>', "renew | return | reserve")

program.showHelpAfterError(true)
program.parse()

const {
  verbose: VERBOSE,
  type: TYPE
} = program.opts()


if (!TYPE || !(["renew", "return", "reserve"].includes(TYPE))) {
  program.help()
  process.exit(1)
}

config.setVerbose(Boolean(VERBOSE));
config.set("type", TYPE)

showFigletTitle(`ACTOR_${(TYPE as string)}`)

if (config.get("type") == "reserve") {
  await replier.init()

  for await (const [msg] of replier.sock) {
    await writeLog(`Socket received a message`)
    try {
      const obj = JSON.parse(msg?.toString() ?? "")
      await writeLog(obj)

      if (!(await isValid(obj))) {
        await writeLog(`Invalid Message, cannot parse because it's invalid`)
        console.log("Cannot parse this request")
        continue;
      }

      const qZod = await inputSchema.safeParseAsync(obj)

      await inputExecution({
        body: qZod.data as BibInput
      })
    } catch (err) {
      await writeLog(`Invalid Message, cannot parse`)
      console.log("cannot parse message", msg?.toString())
    }
  }

} else {
  await init()

  for await (const [topic, msg] of sock) {
    await writeLog(`Socket received a message`)
    try {
      const obj = JSON.parse(msg?.toString() ?? "")
      await writeLog(obj)

      if (!(await isValid(obj))) {
        await writeLog(`Invalid Message, cannot parse because it's invalid`)
        console.log("Cannot parse this request")
        continue;
      }

      const qZod = await inputSchema.safeParseAsync(obj)

      await inputExecution({
        body: qZod.data as BibInput
      })
    } catch (err) {
      await writeLog(`Invalid Message, cannot parse`)
      console.log("cannot parse message", msg?.toString())
    }
  }

}