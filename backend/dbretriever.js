const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const uri = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(uri);
const database = client.db("cw-fantasy-volleyball");

async function fetchDocuments(collectionName, criteriaObj, projectObj) {
  let collection = database.collection(collectionName);
  let retrievedDocs = [];

  let cursor = collection.find(criteriaObj);

  if (projectObj) {
    cursor.project(projectObj);
  }

  for await (let doc of cursor) {
    retrievedDocs.push(doc);
  }

  return retrievedDocs;
}

async function fetchOneDocument(collectionName, criteriaObj, projectObj) {
  let collection = database.collection(collectionName);
  return await collection.findOne(criteriaObj, projectObj);
}

async function fetchOrdered(collectionName, criteriaObj, sortObj, count, projectObj) {
  let collection = database.collection(collectionName);
  let returnDocs;

  let cursor = collection.find(criteriaObj).sort(sortObj).project(projectObj);

  //if count is specified, return that number of documents, if not defined, return all matches.
  if (!count) {
    returnDocs = []
    for await (let doc of cursor) {
      returnDocs.push(doc);
    }
  } else if (count === 1) {
    returnDocs = await cursor.next();
  } else {
    returnDocs = []
    for (let i = 0; i < count; i++) {
      returnDocs.push(await cursor.next());
    }
  }

  return returnDocs;
}

async function updateOne(collectionName, criteriaObj, updateObj) {
  let collection = database.collection(collectionName);

  const result = await collection.updateOne(criteriaObj, updateObj);

  return result;
}

async function insertOne(collectionName, doc) {
  let collection = database.collection(collectionName);

  const result = await collection.insertOne(doc);

  return result;
}

async function fetchDocumentById(collectionName, oid) {
  let collection = database.collection(collectionName);
  let searchOid = new ObjectId(oid);

  const result = await collection.findOne({ _id: searchOid });

  return result;
}

async function deleteDocumentById(collectionName, oid) {
  let collection = database.collection(collectionName);
  let searchOid = new ObjectId(oid);

  const result = await collection.deleteOne({ _id: searchOid });
  return result;
}

async function aggregateDocuments(collectionName, pipeline) {
  let collection = database.collection(collectionName);
  return await collection.aggregate(pipeline).toArray();
}



module.exports.fetchDocuments = fetchDocuments;
module.exports.fetchOneDocument = fetchOneDocument;
module.exports.fetchDocumentById = fetchDocumentById;
module.exports.fetchOrdered = fetchOrdered;
module.exports.updateOne = updateOne;
module.exports.insertOne = insertOne;
module.exports.deleteDocumentById = deleteDocumentById;
module.exports.aggregateDocuments = aggregateDocuments;

