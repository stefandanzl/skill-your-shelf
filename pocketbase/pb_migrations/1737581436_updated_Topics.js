/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2705931841")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3407250877",
    "max": null,
    "min": null,
    "name": "targetLevel",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2705931841")

  // remove field
  collection.fields.removeById("number3407250877")

  return app.save(collection)
})
