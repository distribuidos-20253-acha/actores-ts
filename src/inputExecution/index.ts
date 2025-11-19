import 'dotenv/config'
import colors from 'chalk'
import type NetAdapter from '../net/NetAdapter.ts'
import ClientZeroMQAdapter from '../net/adapters/ClientZeroMQAdapter.ts'
import type { BibInput } from '@acha/distribuidos/schemas/InputSchema'
import { logVerbose, writeLog } from '@acha/distribuidos'
import { replier } from '../lib/Replier.ts'

const netCS: NetAdapter = new ClientZeroMQAdapter({
  host: process.env.STORAGE_MANAGER_HOST!,
  port: process.env.STORAGE_MANAGER_PORT!
})

try {
  await writeLog("Trying to init ClientZeroMQAdapter")
  await netCS.init();
  await writeLog("Succesfully inited ClientZeroMQAdapter")
} catch (err) {
  await writeLog(`Error Trying to init ClientZeroMQAdapter`)
}

export default async ({ body }: {
  body: BibInput
}) => {
  logVerbose(JSON.stringify(body, null, 2))

  process.stdout.write(`${colors.cyan(body.operation)} > ${colors.yellow('user:')} ${body.user_id} > ${colors.yellow(`${body.copy_id ? "copy_id" : "book_id"}:`)} ${body.copy_id ?? body.book_id}`);
  process.stdout.write(`${colors.cyan(" ...")}`);

  let req;

  switch (body.operation) {
    case "renew":
      req = netCS.sendRenew({ body })
      break;
    case "return":
      req = netCS.sendReturn({ body })
      break;

    case "reserve":
      req = netCS.sendReserve({ body })
      writeLog("Replying reserve")
      writeLog(await req)
      replier.send(JSON.stringify(await req));
      break;
  }

  await req;

  process.stdout.write(colors.green('\x1b[4D done\n'));


}