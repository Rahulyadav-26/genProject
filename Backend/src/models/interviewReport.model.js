const mongoose = require('mongoose');


const techincalQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true , "Technical question is required"]
    },
    intention : {
        type : String,
        required : [true , "Intention is required"]
    },
    answer : {
        type : String,
        required : [true , "Answer is required"]
    }
},{
    _id : false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true , "Behavioral question is required"]
    },

    intention : {
        type : String,
        required : [true , "Intention is required"]
    },
    answer : {
        type : String,
        required : [true , "Answer is required"]
    }
    
},{
    _id : false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [true , "Skill is required"]
    },
    severity : {
        type : String,
        enum : ["low", "medium" , "high"],
        required : [true , "Severity is required"]
    },  
},{
    _id : false
})

const preparationPlanSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : [true , "Day is required"]
    },
    focus : {
        type : [String],
        required : [true , "Focus is required"]
    },
    tasks : [{
        type : String,
        required : [true , "Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [true , "Job Description is Required"]
    },
    resume : {
        type : String,
        required : [true , "Resume is Required"]
    },
    selfDescription : {
        type : String,
        required : [true , "Self Description is Required"]
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100
    },
    technicalQuestions : [techincalQuestionSchema],
    behavioralQuestions : [behavioralQuestionSchema],
    skillGaps : [skillGapSchema],
    preparationPlan : [preparationPlanSchema]
},{
    timestamps: true
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
