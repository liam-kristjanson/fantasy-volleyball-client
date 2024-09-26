const dbretriever = require('../dbretriever')

module.exports.get = async (userId) => {
    return dbretriever.fetchDocumentById('users', userId);
}

module.exports.getAll = async () => {
    return dbretriever.fetchDocuments('users', {}, {password: 0});
}

