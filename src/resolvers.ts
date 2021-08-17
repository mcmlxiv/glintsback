//mongoose User and JobList Models
const Users = require("../models/users"); //../dist/models/users
const JobList = require("../models/jobList");

//Define Mongoose schema to allow MongoDB to understand incoming data

const Query = {
  jobList: async () => {
    return JobList.find({});
  },
  user: async (root: unknown, { id }: { id: string }) =>
    await Users.findOne({ id }),
  users: async () => {
    return await Users.find({});
  },
};

//Construct a list of items based on the User Id
const User = {
  jobList: ({ id }: { id: string }) => {
    return JobList.find({ userId: id });
  },
};

interface create {
  input: {
    description: String;
    company: String;
    title: String;
    startDate: String;
    endDate: Boolean;
    id: String;
    userId: String;
  };
}

interface createUser {
  input: {
    id: String;
    email: String;
    password: String;
    firstName: String;
    lastName: String;
    age: Number;
    jobTitle: String;
    location: String;
    profileImg: String;
  };
}
//Mutate JSON data
const Mutation = {
  //job CRUD
  createJob: (root: unknown, { input }: create, context: { token: string }) => {
    //check user auth using context
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let JobsList = new JobList({
      id: input.id,
      description: input.description,
      company: input.company,
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      userId: input.userId,
    });
    return JobsList.save();
  },
  deleteJob: async (
    root: unknown,
    { id }: { id: String },
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let jobList = await JobList.findOne({ id });
    jobList.delete();
  },
  updateJob: async (
    root: unknown,
    { input }: create,
    context: { token: string }
  ) => {
    if (!context.token) {
      throw new Error("Unauthorized");
    }
    let jobList = await JobList.findOne({ id: input.id });
    jobList.overwrite(input);
    return await jobList.save();
  },
  //USER CRUD
  createUser: (root: unknown, { input }: createUser) => {
    let user = new Users({
      id: input.id,
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      age: input.age,
      jobTitle: input.jobTitle,
      location: input.location,
      profileImg: input.profileImg,
    });
    return user.save();
  },
  deleteUser: async (root: unknown, { id }: { id: String }) => {
    let user = await Users.findOne({ id });
    user.delete();
  },
  updateUser: async (root: unknown, { input }: createUser) => {
    let user = await Users.findOne({ id: input.id });
    user.overwrite(input);
    return await user.save();
  },
};

module.exports = { Query, Mutation, User };
