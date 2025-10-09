import { program } from "commander";
import { config } from "./config.ts";
import figlet from "figlet";
import colors from "chalk"
import { init, sock } from "./src/lib/ServerApp.ts";
import { inputSchema, isValid, type BibInput } from "./src/schemas/InputSchema.ts";
import inputExecution from "./src/inputExecution/index.ts";
import replier from "./src/lib/Replier.ts"

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

config.VERBOSE = VERBOSE
config.TYPE = TYPE


console.clear()
console.log(
  colors.red.bold(await figlet(`ACTOR_${(TYPE as string).toUpperCase()}`)),
  '\nv 0.0.1 -', colors.yellow('created by acha')
)

if (config.TYPE == "reserve") {
  await replier.init()

  for await (const [msg] of replier.sock) {
    console.log("received something")
    try {
      const obj = JSON.parse(msg?.toString() ?? "")

      if (!(await isValid(obj))) {
        console.log("Cannot parse this request")
        continue;
      }

      const qZod = await inputSchema.safeParseAsync(obj)

      await inputExecution({
        body: qZod.data as BibInput
      })
    } catch (err) {
      console.log(err)
      console.log("cannot parse message", msg?.toString())
    }
  }

} else {
  await init()

  for await (const [topic, msg] of sock) {
    try {
      const obj = JSON.parse(msg?.toString() ?? "")

      if (!(await isValid(obj))) {
        console.log("Cannot parse this request")
        continue;
      }

      const qZod = await inputSchema.safeParseAsync(obj)

      await inputExecution({
        body: qZod.data as BibInput
      })
    } catch (err) {
      console.log("cannot parse message", msg?.toString())
    }
  }

}