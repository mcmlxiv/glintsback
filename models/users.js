const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define Mongoose schema to allow MongoDB to understand incoming data

const userSchema = new Schema(
  {
    id: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    age: Number,
    jobTitle: String,
    location: String,
    showEmail: Boolean,
    showFirstName: Boolean,
    showLastName: Boolean,
    showLocation: Boolean,
    showJobTitle: Boolean,
    showAge: Boolean,
    jobList: {
      id: String,
      description: String,
      company: String,
      title: String,
      startDate: String,
      endDate: String,
      userId: String,
    },
  },
  {
    collection: "usersJob",
  }
);

const Users = mongoose.model("User", userSchema);
module.exports = Users;
