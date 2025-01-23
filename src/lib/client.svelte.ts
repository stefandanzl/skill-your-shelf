// src/lib/pocketbase.ts
import {type TypedPocketBase} from "./pocketbase-types";


import PocketBase from 'pocketbase';
// const PocketBase = require('pocketbase/cjs')

export const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase

let val = $state<number>();

/**
 * Was habe ich jetzt genau geändert?
 * ich habe die location für pocketbase-types geändert, das hat nicht gepasst
 * 
 * Die pocketbase libray wurde erkannt nachdem ich pocketbase-svelte installiert habe. glaube ich bin mir aber nicht sicher
 * die Error meldungen sind ohnehin egal, weil es trotzdem funktioniert!
 * kann enfach ignoriert werden
 * 
 * 
 * 
 */