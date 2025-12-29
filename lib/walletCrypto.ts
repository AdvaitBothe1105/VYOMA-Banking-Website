import crypto from "crypto";

export function decryptPrivateKey(enc: string): string {
  const masterKey = process.env.MASTER_WALLET_ENCRYPTION_KEY;
  if (!masterKey) throw new Error("MASTER_WALLET_ENCRYPTION_KEY missing");

  const [ivHex, tagHex, dataHex] = enc.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(masterKey, "hex"),
    iv
  );
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
