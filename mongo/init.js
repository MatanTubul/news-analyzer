
db = db.getSiblingDB("news-analyzer")

db.createUser(
    {
      user: "root",
      roles: [ { role: "readWrite", db: "news-analyzer" } ]
    }
);
db.createCollection('occurrences')