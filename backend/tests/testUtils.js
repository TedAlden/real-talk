/**
 * Print all items in a collection to the console. Used for manual debugging and
 * testing purposes.
 *
 * @param {*} db The database object to use to access the collection.
 * @param {*} collectionName The name of the collection to print.
 */
export async function printCollection(db, collectionName) {
  try {
    const items = await db.collection(collectionName).find().toArray();
    console.log("retrieved items:", items);
  } catch (err) {
    console.error("Error retrieving items:", err);
  }
}
