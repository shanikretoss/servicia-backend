-- DropIndex
DROP INDEX "user_refresh_tokens_token_hash_key";

-- CreateIndex
CREATE INDEX "user_refresh_tokens_user_id_idx" ON "user_refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "user_refresh_tokens_expires_at_idx" ON "user_refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "user_refresh_tokens_revoked_at_idx" ON "user_refresh_tokens"("revoked_at");
