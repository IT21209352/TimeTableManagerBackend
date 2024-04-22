const Resources = require('../models/Resource');

// Function to add a resource
const addResource = async (req, res) => {
    const { Code, Name, Availability, Date, EndTime, StartTime, Location, Faculty } = req.body;
    let existingResource;
    try {
        existingResource = await Resources.findOne({ Code: Code });
    } catch (err) {
        console.log(err.message);
    }
    if (existingResource) {
        return res.status(400).json({ message: "Resource with the same code already exists" });
    } else {
        const resource = new Resources({
            Code: Code,
            Name: Name,
            Availability: Availability,
            Date: Date,
            StartTime: StartTime,
            EndTime: EndTime,
            Faculty: Faculty,
            Location: Location
        });
        try {
            await resource.save();
            console.log("Resource Registered to the DB");
        } catch (err) {
            console.log(err.message);
            res.status(400).send({ Status: err.message });
        }

        return res.status(201).json({ message: resource });
    }
};

// Function to update a resource
const updateResource = async (req, res) => {
    const { Code, Name, Availability, Date, EndTime, StartTime, Location, Faculty } = req.body;
    try {
        const updatedResource = await Resources.findByIdAndUpdate(
            { _id: req.params.id },
            {
                Code,
                Name,
                Availability,
                Date,
                StartTime,
                EndTime,
                Faculty,
                Location
            },
            { new: true }
        );

        if (!updatedResource) {
            return res.status(404).json({ Status: "Resource not found" });
        }

        res.status(200).json({ Status: "Resource Updated" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ Status: error.message });
    }
};

// Function to delete a resource
const deleteResource = async (req, res) => {
    Resources.findByIdAndDelete({ _id: req.params.id })
        .then(res.status(200).send({ Status: "Resources Deleted" }))
        .catch((err) => {
            res.status(400).send({ Status: err.message });
            console.log(err);
        });
};

// Function to get all resources
const getResource = async (req, res) => {
    try {
        const resource = await Resources.find();
        if (!resource) {
            return res.status(404).json({ message: "Resources Not Found" });
        }
        return res.status(200).json({ resource });
    } catch (err) {
        return new Error(err);
    }
};

// Function to book or free a resource
const bookResource = async (req, res) => {
    const { Date, EndTime, StartTime, Location, Faculty, Operation } = req.body;
    try {
        // Find the resource by ID
        const resource = await Resources.findById(req.params.id);

        // If resource does not exist, return 404 status
        if (!resource) {
            return res.status(404).json({ Status: "Resource not found" });
        }

        // Check if the resource is available
        if (resource.Availability === "True" && Operation === "book") {

            // Update the resource to booked
            resource.Availability = "False";
            resource.Date = Date;
            resource.EndTime = EndTime;
            resource.StartTime = StartTime;
            resource.Location = Location;
            resource.Faculty = Faculty;

            await resource.save();
            return res.status(200).json({ Status: "Resource booked successfully" });

        } else if (resource.Availability === "False" && Operation == "free") {

            // Update the resource to free
            resource.Availability = "True";
            resource.Date = "";
            resource.EndTime = "";
            resource.StartTime = "";

            await resource.save();
            return res.status(200).json({ Status: "Resource freed successfully" });

        } else {
            // Resource is already booked or freed
            return res.status(409).json({ Status: "Resource is already booked" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Status: "Internal server error" });
    }
};

// Exporting the functions
module.exports = {
    bookResource,
    addResource,
    updateResource,
    deleteResource,
    getResource
}