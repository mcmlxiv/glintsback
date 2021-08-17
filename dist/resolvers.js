"use strict";
//mongoose User and JobList Models
const Users = require("../models/users"); //../dist/models/users
const JobList = require("../models/jobList");
//Define Mongoose schema to allow MongoDB to understand incoming data
const Query = {
    jobList: async () => {
        return JobList.find({});
    },
    user: async (root, { id }) => await Users.findOne({ id }),
    users: async () => {
        return await Users.find({});
    },
};
//Construct a list of items based on the User Id
const User = {
    jobList: ({ id }) => {
        return JobList.find({ userId: id });
    },
};
//Mutate JSON data
const Mutation = {
    //job CRUD
    createJob: (root, { input }, context) => {
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
    deleteJob: async (root, { id }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        let jobList = await JobList.findOne({ id });
        jobList.delete();
    },
    updateJob: async (root, { input }, context) => {
        if (!context.token) {
            throw new Error("Unauthorized");
        }
        let jobList = await JobList.findOne({ id: input.id });
        jobList.overwrite(input);
        return await jobList.save();
    },
    //USER CRUD
    createUser: (root, { input }) => {
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
    deleteUser: async (root, { id }) => {
        let user = await Users.findOne({ id });
        user.delete();
    },
    updateUser: async (root, { input }) => {
        let user = await Users.findOne({ id: input.id });
        user.overwrite(input);
        return await user.save();
    },
};
module.exports = { Query, Mutation, User };
