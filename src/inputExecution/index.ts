import 'dotenv/config'
import colors from 'chalk'
import type { ZMQSender } from '@acha/distribuidos/zeromq/ZMQSender'
import ZMQSyncRequest from '../net/ZMQSyncRequest.ts'
import { OperationType, type BibOperation } from '@acha/distribuidos/schemas/BibOperation'
import { Config, writeLog } from '@acha/distribuidos'
import ZMQSyncReply from '../net/ZMQSyncReply.ts'
import FallbackZMQSyncRequest from '../net/FallbackZMQSyncRequest.ts'

export default async (op: BibOperation) => {
  const syncSocket: ZMQSender = ZMQSyncRequest.getInstance();
  const fallbackSyncSocket: ZMQSender = FallbackZMQSyncRequest.getInstance();

  process.stdout.write(op.toString());
  process.stdout.write(`${colors.cyan(" ...")}`);

  let req;


  switch (op.getOperation()) {
    case OperationType.RENEW:
      if (!Config.getInstance().get("storage_down_time") ||
        (new Date().getTime() - (Config.getInstance().get("storage_down_time") as Date).getTime()) > 20000) { // Revisa de nuevo en 20 segundos
        req = await syncSocket.sendRenew({ body: op })
        if (!req.ok && req.body == "TIMEOUT") {
          console.log(colors.red("STORAGE MANAGER TIMEOUT"))
          writeLog("STORAGE MANAGER TIMEOUT")
          writeLog("SENDING TO FALLBACK STORAGE MANAGER")
          Config.getInstance().set("storage_down_time", new Date())
          req = await fallbackSyncSocket.sendRenew({ body: op })
        }
      } else {
        writeLog("SENDING TO FALLBACK STORAGE MANAGER")
        req = await fallbackSyncSocket.sendRenew({ body: op })
      }
      break;
    case OperationType.RETURN:
      if (!Config.getInstance().get("storage_down_time") ||
        (new Date().getTime() - (Config.getInstance().get("storage_down_time") as Date).getTime()) > 20000) { // Revisa de nuevo en 20 segundos
        req = await syncSocket.sendReturn({ body: op })
        if (!req.ok && req.body == "TIMEOUT") {
          console.log(colors.red("STORAGE MANAGER TIMEOUT"))
          writeLog("STORAGE MANAGER TIMEOUT")
          writeLog("SENDING TO FALLBACK STORAGE MANAGER")
          Config.getInstance().set("storage_down_time", new Date())
          req = await fallbackSyncSocket.sendReturn({ body: op })
        }
      } else {
        writeLog("SENDING TO FALLBACK STORAGE MANAGER")
        req = await fallbackSyncSocket.sendReturn({ body: op })
      }
      break;

    case OperationType.RESERVE: {
      const replier = ZMQSyncReply.getInstance();
      if (!Config.getInstance().get("storage_down_time") ||
        (new Date().getTime() - (Config.getInstance().get("storage_down_time") as Date).getTime()) > 20000) { // Revisa de nuevo en 20 segundos
        req = await syncSocket.sendReserve({ body: op })
        if (!req.ok && req.body == "TIMEOUT") {
          console.log(colors.red("STORAGE MANAGER TIMEOUT"))
          writeLog("STORAGE MANAGER TIMEOUT")
          writeLog("SENDING TO FALLBACK STORAGE MANAGER")
          Config.getInstance().set("storage_down_time", new Date())
          req = await fallbackSyncSocket.sendReserve({ body: op })
        }
      } else {
        writeLog("SENDING TO FALLBACK STORAGE MANAGER")
        req = await fallbackSyncSocket.sendReserve({ body: op })
      }
      writeLog("Replying reserve")
      writeLog(req)

      replier.send(req);
      break;
    }
  }

  process.stdout.write(colors.green('\x1b[4D done'));
  if(!req.ok) process.stdout.write(colors.red(' with errors'));
  process.stdout.write("\n")


}