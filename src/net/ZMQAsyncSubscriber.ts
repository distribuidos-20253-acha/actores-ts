
import { Config } from "@acha/distribuidos";
import { BaseZMQAsyncSubscriber } from "@acha/distribuidos/zeromq/BaseZMQAsyncSubscriber";
import "dotenv/config"

export default class ZMQAsyncSubscriber extends BaseZMQAsyncSubscriber {
  protected override host: string = process.env.ACTOR_LISTENING_HOST_PUBSUB!;
  protected override port: string = process.env.ACTOR_LISTENING_PORT_PUBSUB!;
  protected override topic: string = Config.getInstance().get("type");
}