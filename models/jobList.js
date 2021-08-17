const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define Mongoose schema to allow MongoDB to understand incoming data
const jobListSchema = new Schema(
  {
    id: String,
    description: String,
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    userId: String,
  },
  {
    collection: "joblist",
  }
);

const JobList = mongoose.model("JobList", jobListSchema);
module.exports = JobList;
