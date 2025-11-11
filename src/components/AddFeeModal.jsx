import { XCircle } from "lucide-react";

const AddFeeModal = ({
  showAddFeeModal,
  setShowAddFeeModal,
  handleAddFee,
  feeForm,
  setFeeForm,
  loading,
}) => {
  if (!showAddFeeModal) return null;

  const grades = ["Grade 8", "Grade 9", "Grade 10"];
  const feeTypes = ["Tuition", "Lab", "Activity", "Transport", "Other"];
  const terms = ["Term 1", "Term 2", "Term 3"];
  const currentYear = new Date().getFullYear();
  const academicYears = [
    currentYear.toString(),
    (currentYear + 1).toString(),
    (currentYear + 2).toString(),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Grade Fee Record</h2>
          <button onClick={() => setShowAddFeeModal(false)}>
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleAddFee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              value={feeForm.grade}
              onChange={(e) =>
                setFeeForm({ ...feeForm, grade: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="">Select Grade</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Type
            </label>
            <select
              value={feeForm.feeType}
              onChange={(e) =>
                setFeeForm({ ...feeForm, feeType: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="">Select Fee Type</option>
              {feeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={feeForm.amount}
              onChange={(e) =>
                setFeeForm({ ...feeForm, amount: e.target.value })
              }
              className="input-field"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={feeForm.dueDate}
              onChange={(e) =>
                setFeeForm({ ...feeForm, dueDate: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                value={feeForm.academicYear}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, academicYear: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <select
                value={feeForm.term}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, term: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select Term</option>
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddFeeModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Fee Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeeModal;
