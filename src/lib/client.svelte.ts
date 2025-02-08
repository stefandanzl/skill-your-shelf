import { type TypedPocketBase } from "./pocketbase-types";

import PocketBase from "pocketbase";
import { recordsData } from "./state.svelte";
// const PocketBase = require('pocketbase/cjs')

export const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase;

import type { TopicsRecord } from "./pocketbase-types";

export async function loadTopics() {
  const records = await pb.collection("topics").getList<TopicsRecord>(1, 50, {
    sort: "name",
  });
  recordsData.topics = records.items;
  //   topics = records.items;
}
