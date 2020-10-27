

const AGGREGATE_OCCURRENCES = [{
      $project: {
        _id: 0,
        fields: {
          $filter: {
            input: { $objectToArray: "$$ROOT" }, // Converts a document to an array
            cond: { $eq: [
                { $type: "$$this.v"
                },
                "int"
              ] }
          }
        }
      }
    },
    {
      $unwind: "$fields" // Deconstructs an array field from the input documents to output a document for each element.
    },
    {
      // Groups input documents by the specified _id expression and for each distinct grouping
      $group: {
        _id: "$fields.k",
        total: {
          $sum: "$fields.v"
        }
      }
    },
    {
      $group: {
        _id: null,
        aggregates: {
          $push: //Returns an array of expression values for each group.
              { k: "$_id",
                v: "$total"
              }
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$aggregates" }
      }
    }]
module.exports = {
  AGGREGATE_OCCURRENCES
}