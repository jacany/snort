import * as secp from "@noble/secp256k1";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { HDKey } from "@scure/bip32";

import { DerivationPath } from "Const";

export function generateBip39Entropy(mnemonic?: string): Uint8Array {
  try {
    const mn = mnemonic ?? bip39.generateMnemonic(wordlist, 256);
    return bip39.mnemonicToEntropy(mn, wordlist);
  } catch (e) {
    throw new Error("INVALID MNEMONIC PHRASE");
  }
}

/**
 * Convert hex-encoded entropy into mnemonic phrase
 */
export function hexToMnemonic(hex: string): string {
  const bytes = secp.utils.hexToBytes(hex);
  return bip39.entropyToMnemonic(bytes, wordlist);
}

/**
 * Convert mnemonic phrase into hex-encoded private key
 * using the derivation path specified in NIP06
 * @param mnemonic the mnemonic-encoded entropy
 */
export function entropyToDerivedKey(entropy: Uint8Array): string {
  const masterKey = HDKey.fromMasterSeed(entropy);
  const newKey = masterKey.derive(DerivationPath);

  if (!newKey.privateKey) {
    throw new Error("INVALID KEY DERIVATION");
  }

  return secp.utils.bytesToHex(newKey.privateKey);
}
