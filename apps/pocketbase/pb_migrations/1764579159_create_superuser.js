/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const superusers = app.findCollectionByNameOrId("_superusers")
    const record = new Record(superusers)
    
    record.set("email", "admin@smartfashion.site")
    record.set("password", "Admin@12345")
    
    app.save(record)
})
