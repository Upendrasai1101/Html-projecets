import { Actor, HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { idlFactory } from "./idl";

const CANISTER_ID = process.env.REACT_APP_CANISTER_ID || "";
const IC_HOST = process.env.REACT_APP_IC_HOST || "http://127.0.0.1:4943";

const getIdentity = () => {
  try {
    const stored = localStorage.getItem("wav5coin_key");
    if (stored) return Ed25519KeyIdentity.fromJSON(stored);
  } catch (e) {}
  const id = Ed25519KeyIdentity.generate();
  localStorage.setItem("wav5coin_key", JSON.stringify(id.toJSON()));
  return id;
};

export const identity = getIdentity();
export const userPrincipal = identity.getPrincipal();

let actor = null;

export const connectToIC = async () => {
  if (actor) return actor;
  if (!CANISTER_ID) throw new Error("No canister ID. Run: npm run deploy");
  const agent = new HttpAgent({ host: IC_HOST, identity });
  await agent.fetchRootKey();
  actor = Actor.createActor(idlFactory, { agent, canisterId: CANISTER_ID });
  return actor;
};

export const getActor = () => actor;
