/// <reference path="../pb_data/types.d.ts" />
/**
 * Client handoff: normalize admin user credential.
 * Email: user@smartfashion.com
 * Password: User@123
 */
migrate((app) => {
  const email = "user@smartfashion.com";
  const password = "User@123";

  try {
    const record = app.findFirstRecordByData("users", "email", email);
    record.setPassword(password);
    return app.save(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      const collection = app.findCollectionByNameOrId("users");
      const record = new Record(collection);
      record.set("email", email);
      record.setPassword(password);
      record.set("name", "Sample User");
      return app.save(record);
    }
    throw e;
  }
}, () => {
  // Intentional no-op: do not revert handoff password on migration down.
});
