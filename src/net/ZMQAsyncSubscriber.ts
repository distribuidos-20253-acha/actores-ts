
import { Config } from "@acha/distribuidos";
import { BaseZMQAsyncSubscriber } from "@acha/distribuidos/zeromq/BaseZMQAsyncSubscriber";
import "dotenv/config"

export default class ZMQAsyncSubscriber extends BaseZMQAsyncSubscriber {
  protected override host: string = process.env.LOAD_MANAGER_HOST!;
  protected override port: string = process.env.LOAD_MANAGER_PORT!;
  protected override topic: string = Config.getInstance().get("type");
}