// src/lib/pocketbase.ts
import { type TypedPocketBase } from "./pocketbase-types";

import PocketBase from "pocketbase";
// const PocketBase = require('pocketbase/cjs')

export const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase;
