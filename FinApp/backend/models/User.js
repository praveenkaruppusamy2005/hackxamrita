const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    personalInfo: {
        firstName: String,
        lastName: String,
        dob: String,
        gender: String,
        maritalStatus: String,
        dependents: String,
        education: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    jobDetails: {
        employmentType: String,
        employerName: String,
        industry: String,
        jobTitle: String,
        experience: String,
        officeAddress: String
    },
    incomeDetails: {
        monthlyIncome: String,
        otherIncome: String,
        totalAnnualIncome: String,
        existingEMIs: String,
        savings: String,
        primaryBank: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
