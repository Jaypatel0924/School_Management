import ExcelJS from 'exceljs';
import Student from '../models/Student.js';

export const generateResultTemplate = async (grade, section) => {
  try {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${grade} ${section} Results`);

    // Get all students for the specified grade and section
    const students = await Student.find({ grade, section })
      .sort({ name: 1 }) // Sort by name alphabetically
      .lean();

    // Define subjects based on grade
    const subjects = [
      'Mathematics',
      'Science',
      'English',
      'Social Studies',
      'Hindi',
      'Gujarati',
      'Computer Science',
      'Physical Education'
    ];

    // Define columns
    const columns = [
      { header: 'Student ID', key: 'studentId', width: 12 },
      { header: 'Student Name', key: 'name', width: 25 },
      ...subjects.map(subject => ({ header: subject, key: subject.toLowerCase().replace(/\s+/g, '_'), width: 15 })),
      { header: 'Total Marks', key: 'total_marks', width: 12 },
      { header: 'Percentage', key: 'percentage', width: 12 },
      { header: 'Grade', key: 'grade', width: 10 },
      { header: 'Remarks', key: 'remarks', width: 20 }
    ];

    // Set columns in worksheet
    worksheet.columns = columns;

    // Style the header row
    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' }
    };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F46E5' }
    };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

    // Add student data
    students.forEach((student, index) => {
      const row = {
        studentId: student.studentId,
        name: student.name,
      };
      // Add empty cells for marks
      subjects.forEach(subject => {
        row[subject.toLowerCase().replace(/\s+/g, '_')] = '';
      });
      row.total_marks = '';
      row.percentage = '';
      row.grade = '';
      row.remarks = '';

      worksheet.addRow(row);
    });

    // Style all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (rowNumber > 1) { // Data rows
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }
      });
      row.height = 20;
    });

    // Add validation for marks columns
    subjects.forEach(subject => {
      const column = worksheet.getColumn(subject.toLowerCase().replace(/\s+/g, '_'));
      const colNumber = column.number;
      const maxRow = students.length + 1;

      // Add data validation for marks (0-100)
      worksheet.dataValidations.add('B2:B' + maxRow, {
        type: 'decimal',
        operator: 'between',
        formulae: [0, 100],
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Invalid Marks',
        error: 'Marks must be between 0 and 100'
      });
    });

    // Add instructions at the bottom
    const instructionRow = worksheet.addRow([]);
    worksheet.addRow(['Instructions:']);
    worksheet.addRow(['1. Enter marks between 0 and 100 for each subject']);
    worksheet.addRow(['2. Do not modify Student ID and Student Name columns']);
    worksheet.addRow(['3. Total Marks and Percentage will be calculated automatically']);
    worksheet.addRow(['4. Save the file and upload it back to the system']);

    return workbook;
  } catch (error) {
    console.error('Error generating Excel template:', error);
    throw new Error('Failed to generate Excel template');
  }
};