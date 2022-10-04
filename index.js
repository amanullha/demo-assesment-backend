
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');


app.use(cors());

// app.use(express.json());

//! Warning: Do not use in production
app.use(express.json({
    origin: "*",
}));


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





// const corsOptions = {
//     origin: '*',
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
// }

// app.use(cors(corsOptions))



const uri = "mongodb+srv://assignmentDemoDB:jvEBZhThhbtSdoyY@cluster0.ssglgxr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
        await client.connect();
        const studentCollection = client.db('assignmentStudentDB').collection('students');


        // get all the students

        app.get('/get-students', async (req, res) => {

            console.log("called : get-students");

            const query = {};

            const students = await studentCollection.find(query).toArray();

            console.log(students);

            res.send(students);

        })

        // add student 
        app.post('/add-student', async (req, res) => {

            const student = req.body;
            const result = await studentCollection.insertOne(student);
            res.send(result)
        })

        // delete a student
        app.delete('/delete-student/:_id', async (req, res) => {

            const _id = req.params._id;
            const query = { _id: ObjectId(_id) };

            const result = await studentCollection.deleteOne(query)
            res.send(result);
        })

        // update student

        app.put('/update-student/:_id', async (req, res) => {

            const student = req.body;
            const _id = req.params._id;
            console.log('student: ', student);

            const filter = { _id: ObjectId(_id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    address1: student.address1,
                    address2: student.address1,
                    class: student.class,
                    division: student.division,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    middle: student.middle,
                    pinCode: student.pinCode,
                    roll: student.roll,
                }
            }

            const result = await studentCollection.updateOne(filter, updateDoc, options);

            res.send(result)

        })
    }
    finally {
        // client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {

    res.send("Running ras Server")
})

app.listen(port, () => {
    console.log("Listening to port: ", port);
})
