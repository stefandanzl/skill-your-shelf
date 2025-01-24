/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_239454482")

  // update field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2705931841",
    "hidden": false,
    "id": "relation2638274075",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "topicId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_239454482")

  // update field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2705931841",
    "hidden": false,
    "id": "relation2638274075",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "topic",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
