const Student = require("../models/student");
const Degree = require("../models/degree");

exports.students_get_all = async (req, res) => {
  await Student.find()
    .select("_id name age  sex dob")
    .populate("degree", "_id name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        students: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            age: doc.age,
            sex: doc.sex,
            dob: doc.dob,
            links: {
              type: "GET",
              url: "http://localhost:3000/students/" + doc._id,
            },
          };
        }),
      };
      if (docs.length > 0) {
        res.status(200).json({ response });
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.students_save = (req, res, next) => {
  postSet = [];
  const student = new Student( {
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    dob: req.body.dob,
  });

  student
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        Error: err,
      });
    });
  // Degree.findById(req.body.degree)
  //     .exec()
  //     .then(deg => {
  //         if (deg) {
  //             req.body.forEach(std => {
  //                 const student = new Student({
  //                     name: std.name,
  //                     age: std.age,
  //                     sex: std.sex,
  //                     degree: std.degree,
  //                 })
  //                 postSet.push(student);
  //             });

  //              Student.insertMany(postSet)
  //                 .then(doc => {
  //                     res.status(201).json({ doc });
  //                 })
  //                 .catch(error => {
  //                     res.status(500).json({ error })
  //                 })
  //         }
  //         else{
  //              res.status(404).json({
  //                 message: 'Invalid Degree',
  //             })
  //         }
  //     })
  //     .catch(err => {
  //         res.status(500).json({ error })
  //     })
};

exports.students_get_one = async (req, res) => {
  const studentId = req.params.id;
  await Student.findById(studentId)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({ doc });
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.students_update = async (req, res) => {
  const studentId = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  await Student.findByIdAndUpdate({ _id: studentId }, { $set: updateOps })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({ doc });
      } else {
        res.status(404).json({ message: "Student not Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.students_delete = async (req, res) => {
  const studentId = req.params.id;
  await Student.remove({ _id: studentId })
    .exec()
    .then((doc) => {
      if (doc.deletedCount > 0) {
        res.status(200).json({ doc });
      } else {
        res.status(404).json({ message: "Student not Found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
