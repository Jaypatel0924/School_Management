// import Material from '../models/Material.js';
// import Teacher from '../models/Teacher.js';

// // Upload material
// export const uploadMaterial = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       subject,
//       grade,
//       section,
//       type,
//       attachmentUrl
//     } = req.body;

//     // Find the teacher profile for the logged in user
//     const teacher = await Teacher.findOne({ userId: req.user.id });
//     if (!teacher) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Teacher profile not found'
//       });
//     }

//     const newMaterial = await Material.create({
//       title,
//       description,
//       subject,
//       grade,
//       section,
//       type,
//       attachmentUrl,
//       uploadedBy: teacher._id
//     });

//     res.status(201).json({
//       status: 'success',
//       data: {
//         material: newMaterial
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };

// // Get materials by teacher
// export const getMyMaterials = async (req, res) => {
//   try {
//     // Find the teacher profile for the logged in user
//     const teacher = await Teacher.findOne({ userId: req.user.id });
//     if (!teacher) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Teacher profile not found'
//       });
//     }

//     const materials = await Material.find({ uploadedBy: teacher._id })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       status: 'success',
//       results: materials.length,
//       data: {
//         materials
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };

// // Delete material
// export const deleteMaterial = async (req, res) => {
//   try {
//     const material = await Material.findById(req.params.id);
//     if (!material) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Material not found'
//       });
//     }

//     // Find the teacher profile for the logged in user
//     const teacher = await Teacher.findOne({ userId: req.user.id });
    
//     // Check if the teacher is the owner of the material
//     if (material.uploadedBy.toString() !== teacher._id.toString()) {
//       return res.status(403).json({
//         status: 'error',
//         message: 'You are not authorized to delete this material'
//       });
//     }

//     await Material.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: null
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };
import Material from '../models/Material.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { sendNewMaterialNotification } from '../utils/email.js';

// Upload material
export const uploadMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      grade,
      section,
      type,
      attachmentUrl
    } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    const newMaterial = await Material.create({
      title,
      description,
      subject,
      grade,
      section,
      type,
      attachmentUrl,
      uploadedBy: teacher._id
    });

    // Find all students in this grade and section
    const students = await Student.find({ grade, section }).populate('userId', 'name email');

    // Send email notifications to all students
    await Promise.all(students.map(student =>
      sendNewMaterialNotification(
        student.userId.email,
        student.userId.name,
        {
          title,
          subject,
          type,
          description
        }
      ).catch(err => console.error(`Failed to send material notification to ${student.userId.email}:`, err))
    ));

    res.status(201).json({
      status: 'success',
      data: {
        material: newMaterial
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get materials by teacher
export const getMyMaterials = async (req, res) => {
  try {
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    const materials = await Material.find({ uploadedBy: teacher._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: materials.length,
      data: {
        materials
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get materials for student
export const getStudentMaterials = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    // Get materials for student's grade and section
    const materials = await Material.find({
      grade: student.grade,
      section: student.section
    })
    .populate('uploadedBy', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: materials.length,
      data: {
        materials
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        status: 'error',
        message: 'Material not found'
      });
    }

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the owner of the material
    if (material.uploadedBy.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this material'
      });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};