const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [true , "Job Description is Required"]
    },
    resume : {
        type : String,
        required : [true , "Resume is Required"]
    },
    
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
