const Course  = require("./course");

const updateAllCourses = async () => {
    try {
        await Course.updateMany({}, { 
            $set: { duration: "6 weeks", instructor: "John Doe" }
        });
        console.log("All courses updated successfully!");
    } catch (error) {
        console.error("Update failed:", error);
    }
};

module.exports = updateAllCourses
