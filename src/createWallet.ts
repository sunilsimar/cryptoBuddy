import { generateMnemonic } from 'bip39';
import { mnemonicToSeedSync, mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import axios from 'axios';

interface wallet {
    id: number;
    publicKey: string;
    privateKey: string;
    balance: number | null;
  }

let length = 0;
  
async function createMnemonic() {
    const generatedMnemonic = await generateMnemonic();
    return generatedMnemonic;
}

export async function createWallet(){
        const mnemonic = await createMnemonic();
        let seedPhrase = mnemonic.toString();
        const seed = mnemonicToSeedSync(mnemonic.toString());
        const path = `m/44'/501'/${length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
  
        const newWallet: wallet = {
          id: length + 1,
          publicKey: keypair.publicKey.toBase58(),
          privateKey: bs58.encode(keypair.secretKey),
          balance: null,
        };
        length++;

        console.log(newWallet.publicKey);
        return {
            walletAddress: newWallet.publicKey,
            seedPhrase
        }
}

export async function getBalance(address: string) {
    const balance = await axios.post('https://solana-devnet.g.alchemy.com/v2/5sYrdbUp61JoUg7D-pkDCzWLRPSaD7wR', {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    });
    const value = balance.data.result.value;
    const valueToSOL = value / 1_000_000_000; // Convert lamports to SOL

    return valueToSOL;
}

