const Course = require('../models/Course');

// Function to add a course
const addCourse = async (req, res) => {
    const { Name, Code, Credits, Description, Duration, Faculty } = req.body;
    let existingCourse;
    try {
        existingCourse = await Course.findOne({ Code: Code });
    } catch (err) {
        console.log(err.message);
    }
    if (existingCourse) {
        return res.status(400).json({ message: "Course Already Exists" });
    } else {
        const course = new Course({ Name: Name, Code: Code, Credits: Credits, Description: Description, Duration: Duration, Faculty: Faculty });
        try {
            await course.save();
            console.log("Course Registered to the DB");
        } catch (err) {
            console.log(err.message);
        }

        return res.status(201).json({ message: course });
    }
};

// Function to get all course data
const getCourseData = async (req, res) => {
    Course
        .find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => console.log(err));
};

// Function to remove a course
const removeCourse = async (req, res) => {
    Course.findByIdAndDelete({ _id: req.params.id })
        .then(res.status(200).send({ Status: "Course Deleted" }))
        .catch((err) => console.log(err));
};

// Function to update a course
const updateCourse = async (req, res) => {
    const { Name, Code, Credits, Description, Duration, Faculty } = req.body;
    Course.findByIdAndUpdate(
        { _id: req.params.id },
        {
            Name: Name,
            Code: Code,
            Credits: Credits,
            Description: Description,
            Duration: Duration,
            Faculty: Faculty
        }
    ).then(
        res.status(200).send({ Status: "Course Updated" })
    ).catch((err) => console.log(err));
};

// Exporting the functions
module.exports = {
    updateCourse,
    removeCourse,
    getCourseData,
    addCourse
}
