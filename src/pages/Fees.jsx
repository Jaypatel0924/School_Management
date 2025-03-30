// import React, { useState } from 'react';
// import { CreditCard, Calendar, Receipt, AlertCircle, CheckCircle, DollarSign, FileText, Clock } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Fees = () => {
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [paymentStep, setPaymentStep] = useState(1);
  
//   const feeStructure = [
//     {
//       id: 1,
//       grade: 'Grade 8',
//       tuitionFee: 5000,
//       labFee: 800,
//       activityFee: 500,
//       totalFee: 6300,
//       dueDate: 'March 15, 2024'
//     },
//     {
//       id: 2,
//       grade: 'Grade 9',
//       tuitionFee: 5500,
//       labFee: 1000,
//       activityFee: 500,
//       totalFee: 7000,
//       dueDate: 'March 15, 2024'
//     },
//     {
//       id: 3,
//       grade: 'Grade 10',
//       tuitionFee: 6000,
//       labFee: 1200,
//       activityFee: 500,
//       totalFee: 7700,
//       dueDate: 'March 15, 2024'
//     }
//   ];

//   const paymentHistory = [
//     {
//       id: 1,
//       date: 'Feb 15, 2024',
//       amount: 3150,
//       type: 'First Installment',
//       status: 'Paid',
//       transactionId: 'TXN123456'
//     },
//     {
//       id: 2,
//       date: 'Jan 15, 2024',
//       amount: 3150,
//       type: 'Second Installment',
//       status: 'Pending',
//       transactionId: 'TXN123457'
//     }
//   ];

//   const handlePayment = (e) => {
//     e.preventDefault();
//     // Here you would integrate with your payment gateway
//     toast.success('Payment processed successfully!');
//     setPaymentStep(1);
//     setSelectedPlan(null);
//   };

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Fee Management</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           View fee structure, make payments, and track your payment history.
//         </p>
//       </section>

//       {/* Fee Structure */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl font-bold mb-6">Fee Structure</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {feeStructure.map((fee) => (
//             <div key={fee.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-4">{fee.grade}</h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tuition Fee</span>
//                     <span className="font-medium">${fee.tuitionFee}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Lab Fee</span>
//                     <span className="font-medium">${fee.labFee}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Activity Fee</span>
//                     <span className="font-medium">${fee.activityFee}</span>
//                   </div>
//                   <div className="pt-3 border-t">
//                     <div className="flex justify-between font-semibold">
//                       <span>Total</span>
//                       <span className="text-indigo-600">${fee.totalFee}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <button
//                     onClick={() => {
//                       setSelectedPlan(fee);
//                       setPaymentStep(2);
//                     }}
//                     className="btn-primary w-full"
//                   >
//                     Pay Now
//                   </button>
//                 </div>
//                 <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Due Date: {fee.dueDate}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Payment Form */}
//       {selectedPlan && (
//         <section className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
//             <div className="mt-3 text-center">
//               <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Payment Details</h3>
//               <div className="mt-2 px-7 py-3">
//                 {paymentStep === 2 ? (
//                   <form onSubmit={handlePayment} className="space-y-4">
//                     <div className="text-left">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Card Number
//                       </label>
//                       <input
//                         type="text"
//                         className="input-field"
//                         placeholder="1234 5678 9012 3456"
//                         required
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="text-left">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Expiry Date
//                         </label>
//                         <input
//                           type="text"
//                           className="input-field"
//                           placeholder="MM/YY"
//                           required
//                         />
//                       </div>
//                       <div className="text-left">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           CVV
//                         </label>
//                         <input
//                           type="text"
//                           className="input-field"
//                           placeholder="123"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div className="text-left">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Name on Card
//                       </label>
//                       <input
//                         type="text"
//                         className="input-field"
//                         placeholder="John Doe"
//                         required
//                       />
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex justify-between mb-2">
//                         <span className="text-gray-600">Amount</span>
//                         <span className="font-medium">${selectedPlan.totalFee}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Processing Fee</span>
//                         <span className="text-gray-500">$0</span>
//                       </div>
//                     </div>
//                     <button type="submit" className="btn-primary w-full">
//                       Pay ${selectedPlan.totalFee}
//                     </button>
//                   </form>
//                 ) : (
//                   <div className="text-center">
//                     <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful</h3>
//                     <p className="text-gray-500">Thank you for your payment!</p>
//                   </div>
//                 )}
//               </div>
//               <div className="items-center px-4 py-3">
//                 <button
//                   onClick={() => {
//                     setSelectedPlan(null);
//                     setPaymentStep(1);
//                   }}
//                   className="btn-secondary w-full"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Payment History */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl font-bold mb-6">Payment History</h2>
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Transaction ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Receipt
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paymentHistory.map((payment) => (
//                   <tr key={payment.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.type}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                       ${payment.amount}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           payment.status === 'Paid'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}
//                       >
//                         {payment.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.transactionId}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.status === 'Paid' && (
//                         <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
//                           <FileText className="h-4 w-4 mr-1" />
//                           Download
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* Payment Instructions */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-xl font-bold mb-4">Payment Instructions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="flex items-start space-x-3">
//               <CreditCard className="h-6 w-6 text-indigo-600 flex-shrink-0" />
//               <div>
//                 <h3 className="font-medium mb-1">Secure Payment</h3>
//                 <p className="text-sm text-gray-500">
//                   All payments are processed through secure payment gateways
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <Clock className="h-6 w-6 text-indigo-600 flex-shrink-0" />
//               <div>
//                 <h3 className="font-medium mb-1">Payment Timeline</h3>
//                 <p className="text-sm text-gray-500">
//                   Fees can be paid in two installments per semester
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-3">
//               <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0" />
//               <div>
//                 <h3 className="font-medium mb-1">Late Payment</h3>
//                 <p className="text-sm text-gray-500">
//                   Late payment fees apply after due date
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Fees;

import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Receipt, AlertCircle, CheckCircle, DollarSign, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Fees = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);
  const [statistics, setStatistics] = useState({
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    overdueFees: 0,
    paymentPercentage: 0
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/fees/my-fees');
      setFees(response.data.data.fees);
      setStatistics(response.data.data.statistics);
    } catch (error) {
      toast.error('Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (feeId) => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const orderResponse = await axios.post('/api/fees/create-payment', { feeId });
      const order = orderResponse.data.data.order;

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Panchjanya Shikshan Sankul',
        description: 'Fee Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await axios.post('/api/fees/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              feeId,
            });

            toast.success('Payment successful!');
            fetchFees();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (fee) => {
    const doc = new jsPDF();
    
    // Add school logo and header
    doc.setFontSize(20);
    doc.text('Modern Academy', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Fee Receipt', 105, 30, { align: 'center' });
    
    // Add receipt details
    doc.setFontSize(12);
    const details = [
      ['Receipt No:', fee._id],
      ['Student Name:', currentUser.name],
      ['Fee Type:', fee.feeType],
      ['Academic Year:', fee.academicYear],
      ['Term:', fee.term],
      ['Amount:',`₹${fee.amount}`],
      ['Payment Date:', new Date(fee.paymentDate).toLocaleDateString()],
      ['Transaction ID:', fee.transactionId],
      ['Status:', fee.status],
    ];

    doc.autoTable({
      startY: 40,
      head: [],
      body: details,
      theme: 'plain',
      styles: { fontSize: 12 },
    });

    // Add footer
    doc.setFontSize(10);
    doc.text('This is a computer-generated receipt and does not require signature.', 105, 180, { align: 'center' });

    // Save the PDF
    doc.save(`fee_receipt_${fee._id}.pdf`);
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Fee Management</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View fee details, make payments, and download receipts.
        </p>
      </section>

      {/* Fee Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{statistics.totalFees}</h3>
            <p className="text-gray-600">Total Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{statistics.paidFees}</h3>
            <p className="text-gray-600">Paid Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{statistics.pendingFees}</h3>
            <p className="text-gray-600">Pending Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{statistics.overdueFees}</h3>
            <p className="text-gray-600">Overdue Fees</p>
          </div>
        </div>
      </section>

      {/* Fee Records */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Fee Records</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fee.feeType}</div>
                          <div className="text-sm text-gray-500">{fee.term} - {fee.academicYear}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{fee.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          fee.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : fee.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.status === 'Paid' ? (
                          <button
                            onClick={() => generateReceipt(fee)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <Receipt className="h-4 w-4 mr-1" />
                            Download Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePayment(fee._id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Instructions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Payment Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <CreditCard className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-500">
                  All payments are processed through secure payment gateways
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Payment Timeline</h3>
                <p className="text-sm text-gray-500">
                  Please pay fees before the due date to avoid late fees
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Late Payment</h3>
                <p className="text-sm text-gray-500">
                  Late payment fees apply after due date
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fees;