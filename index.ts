import { program } from "commander";
import inputExecution from "./src/inputExecution/index.ts";
import { Config, showFigletTitle, writeLog } from "@acha/distribuidos";
import type { ZMQReceiver } from "@acha/distribuidos/zeromq/ZMQReceiver";
import ZMQSyncReply from "./src/net/ZMQSyncReply.ts";
import { OperationFactory } from "@acha/distribuidos/schemas/BibOperation";
import ZMQAsyncSubscriber from "./src/net/ZMQAsyncSubscriber.ts";
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
  const replier: ZMQReceiver = ZMQSyncReply.getInstance();

  for await (const [msg] of replier.sock) {
    await writeLog(`Socket received a message`)
    try {
      const obj = JSON.parse(msg?.toString() ?? "")
      await writeLog(obj)

      const op = await OperationFactory.parseOperation(obj);

      await inputExecution(op)
    } catch (err) {
      console.log(err)
      await writeLog(`Invalid Message, cannot parse`)
      console.log("cannot parse message", msg?.toString())
    }
  }

} else {
  const channel = ZMQAsyncSubscriber.getInstance();
  
  for await (const [topic, msg] of channel.sock) {
    await writeLog(`Socket received a message`)
    try {
      const obj = JSON.parse(msg?.toString() ?? "")
      await writeLog(obj)

      const op = await OperationFactory.parseOperation(obj);

      await inputExecution(op)
    } catch (err) {
      await writeLog(`Invalid Message, cannot parse`)
      console.log("cannot parse message", msg?.toString())
    }
  }

}