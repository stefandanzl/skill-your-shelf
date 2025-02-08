import { type TypedPocketBase } from "./pocketbase-types";

import PocketBase from "pocketbase";
import { recordsData, userInput } from "./state.svelte";
// const PocketBase = require('pocketbase/cjs')

export const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase;

import type { TopicsRecord } from "./pocketbase-types";
import type { TopicId } from "./types";

export async function loadTopics() {
  const records = await pb.collection("topics").getList<TopicsRecord>(1, 50, {
    sort: "name",
  });
  recordsData.topics = records.items;
  //   topics = records.items;
}

let loading = false;

export function isLoading() {
  return loading;
}

export async function loadTopic(topicId: TopicId) {
  try {
    loading = true;
    userInput.topic = await pb.collection("Topics")?.getOne<TopicsRecord>(topicId!);
  } catch (error) {
    console.error("Failed to load topic:", error);
  } finally {
    loading = false;
  }
}

export async function handleDelete(topicId: TopicId) {
  if (!topicId || !confirm("Are you sure you want to delete this topic?")) return;
  try {
    loading = true;
    const response = await pb.collection("Topics").delete(topicId);

    if (response) {
      userInput.currentView = "topicQuestions";
      userInput.selectedTopicId = "";
    } else {
      alert("Deletion failed");
    }
    onSave();
  } catch (error) {
    console.error("Failed to delete topic:", error);
  }
}

function onSave() {}
