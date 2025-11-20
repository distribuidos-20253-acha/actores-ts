import { BaseZMQSyncRequest } from "@acha/distribuidos/zeromq/BaseZMQSyncRequest"
import { BibOperation, type BibResponse } from "@acha/distribuidos/schemas/BibOperation"
import "dotenv/config"
export default class FallbackZMQSyncRequest extends BaseZMQSyncRequest {
  protected override host = process.env.FALLBACK_STORAGE_MANAGER_HOST!;
  protected override port = process.env.FALLBACK_STORAGE_MANAGER_PORT!;

  override sendReserve(context: { body: BibOperation, timeout: number }): Promise<BibResponse> {
    return super.resendBody(context)
  }
  override sendRenew(context: { body: BibOperation, timeout: number }): Promise<BibResponse> {
    return super.resendBody(context)
  }
  override sendReturn(context: { body: BibOperation, timeout: number }): Promise<BibResponse> {
    return super.resendBody(context)
  }
}