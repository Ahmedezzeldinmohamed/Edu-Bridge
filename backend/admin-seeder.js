const adminDetails = require("./models/Admin/details.model.js");
const adminCredential = require("./models/Admin/credential.model.js");
const connectToMongo = require("./database/db.js");
const mongoose = require("mongoose");

const seedData = async () => {
    try {
        await connectToMongo();

        await adminCredential.deleteMany({})
        await adminDetails.deleteMany({})

        await adminCredential.create({
            loginid: 123456,
            password: "admin123"
        });

        const adminDetail = {
            employeeId: "123456",
            firstName: "Ahmed",
            middleName: "Gamal",
            lastName: "Anwer",
            email: "ag8410088@gmail.com",
            phoneNumber: "01276318991",
            gender: "Male",
            type: "Admin",
            profile: "Faculty_Profile_123456.jpg",
        };

        await adminDetails.create(adminDetail);

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error while seeding:", error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seedData();
