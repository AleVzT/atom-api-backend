import { onRequest } from "firebase-functions/v2/https";
import app  from "./interfaces/http/app";

export const api = onRequest(app);
