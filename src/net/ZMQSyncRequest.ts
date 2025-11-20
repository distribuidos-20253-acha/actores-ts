import { BaseZMQSyncRequest } from "@acha/distribuidos/zeromq/BaseZMQSyncRequest"
import { BibOperation, type BibResponse } from "@acha/distribuidos/schemas/BibOperation"
import "dotenv/config"
export default class ZMQSyncRequest extends BaseZMQSyncRequest {
  protected override host = process.env.STORAGE_MANAGER_HOST!;
  protected override port = process.env.STORAGE_MANAGER_PORT!;

  override sendReserve(context: { body: BibOperation; }): Promise<BibResponse> {
    return super.resendBody(context)
  }
  override sendRenew(context: { body: BibOperation; }): Promise<BibResponse> {
    return super.resendBody(context)
  }
  override sendReturn(context: { body: BibOperation; }): Promise<BibResponse> {
    return super.resendBody(context)
  }
}