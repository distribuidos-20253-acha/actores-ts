import 'dotenv/config'
import colors from 'chalk'
import type { ZMQSender } from '@acha/distribuidos/zeromq/ZMQSender'
import ZMQSyncRequest from '../net/ZMQSyncRequest.ts'
import { OperationType, type BibOperation } from '@acha/distribuidos/schemas/BibOperation'
import { Config, writeLog } from '@acha/distribuidos'
import type { ZMQReceiver } from '@acha/distribuidos/zeromq/ZMQReceiver'
import ZMQSyncReply from '../net/ZMQSyncReply.ts'

export default async (op: BibOperation) => {
  const syncSocket: ZMQSender = ZMQSyncRequest.getInstance();

  let replier;

  if (Config.getInstance().get("type") == "reserve") {
    replier = ZMQSyncReply.getInstance();
  }

  process.stdout.write(op.toString());
  process.stdout.write(`${colors.cyan(" ...")}`);

  let req;

  switch (op.getOperation()) {
    case OperationType.RENEW:
      req = syncSocket.sendRenew({ body: op })
      break;
    case OperationType.RETURN:
      req = syncSocket.sendReturn({ body: op })
      break;

    case OperationType.RESERVE:
      req = syncSocket.sendReserve({ body: op })
      writeLog("Replying reserve")
      writeLog(await req)
      replier.send(await req);
      break;
  }

  await req;

  process.stdout.write(colors.green('\x1b[4D done\n'));


}