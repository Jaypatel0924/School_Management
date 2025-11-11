import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  Receipt,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  FileText,
  Clock,
  Download,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";

// Create styles for PDF receipt
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#4F46E5",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    color: "#111827",
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
});

// Receipt PDF Component
const FeeReceipt = ({ fee, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Panchjanya Shiksan Sankul</Text>
        <Text style={styles.subtitle}>Fee Payment Receipt</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Receipt Number:</Text>
          <Text style={styles.value}>{`RCPT-${fee._id
            .slice(-8)
            .toUpperCase()}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(fee.paymentDate || new Date()).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Academic Year:</Text>
          <Text style={styles.value}>{fee.academicYear}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Term:</Text>
          <Text style={styles.value}>{fee.term}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={{ ...styles.row, marginBottom: 10 }}>
          <Text style={{ ...styles.label, fontSize: 14 }}>Fee Details</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fee Type:</Text>
          <Text style={styles.value}>{fee.feeType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>₹{fee.amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>
            {new Date(fee.paymentDate || new Date()).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{fee.paymentMethod || "Online"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={{ ...styles.row, marginTop: 10 }}>
          <Text style={styles.label}>Total Paid:</Text>
          <Text style={styles.total}>₹{fee.amount}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>
          This is an computer generated receipt. No signature required.
        </Text>
        <Text>Thank you for your payment!</Text>
      </View>
    </Page>
  </Document>
);

const Fees = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);
  const [statistics, setStatistics] = useState({
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    overdueFees: 0,
    paymentPercentage: 0,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/fees/my-fees"
      );
      setFees(response.data.data.fees);
      setStatistics(response.data.data.statistics);
    } catch (error) {
      toast.error("Failed to fetch fee details");
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedFee(null);
    setCardDetails({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    });
  };

  const openReceiptModal = (fee) => {
    setSelectedReceipt(fee);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleDirectPayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    try {
      setLoading(true);

      if (paymentMethod === "card") {
        if (
          !cardDetails.cardNumber ||
          !cardDetails.cardHolder ||
          !cardDetails.expiryDate ||
          !cardDetails.cvv
        ) {
          toast.error("Please fill all card details");
          setLoading(false);
          return;
        }
      }

      await displayRazorpay(selectedFee);
      closePaymentModal();
    } catch (error) {
      toast.error("Payment failed");
      setLoading(false);
    }
  };

  const displayRazorpay = async (fee) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderResponse = await axios.post(
        "http://localhost:5000/api/fees/create-payment",
        { feeId: fee._id }
      );

      if (!orderResponse.data || !orderResponse.data.data) {
        toast.error("Failed to get order details. Please try again.");
        return;
      }

      const { order, key } = orderResponse.data.data;
      const { amount, id: order_id, currency } = order;

      const options = {
        key: key,
        amount: amount.toString(),
        currency: currency,
        name: "Panchjanya Shiksan Sankul",
        description: ` Payment for ${fee.feeType}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/fees/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                feeId: fee._id,
              }
            );

            // Set receipt data for download
            const paidFee = {
              ...fee,
              paymentDate: new Date(),
              paymentMethod: "Online (Razorpay)",
              status: "Paid",
            };

            setReceiptData(paidFee);
            setSelectedReceipt(paidFee); // Set for immediate viewing

            toast.success(verifyResponse.data.message || "Payment successful!");
            fetchFees();
            setShowReceiptModal(true); // Automatically show receipt after payment
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Payment verification failed"
            );
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    }
  };

  const PaymentModal = () => {
    if (!showPaymentModal || !selectedFee) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative mx-auto p-5 border w-full max-w-md bg-white rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Pay Fee</h3>
            <button
              onClick={closePaymentModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Fee Type:{" "}
              <span className="font-medium text-gray-900">
                {selectedFee.feeType}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Amount:{" "}
              <span className="font-medium text-gray-900">
                ₹{selectedFee.amount}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Due Date:{" "}
              <span className="font-medium text-gray-900">
                {new Date(selectedFee.dueDate).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 text-sm rounded ${
                  paymentMethod === "card"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                Credit/Debit Card
              </button>
              <button
                className={`px-4 py-2 text-sm rounded ${
                  paymentMethod === "upi"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                UPI
              </button>
            </div>

            {paymentMethod === "card" && (
              <form onSubmit={handleDirectPayment}>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardDetailsChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardDetailsChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardDetailsChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </form>
            )}

            {paymentMethod === "upi" && (
              <div className="upi-container">
                <div className="qr-section">
                  <h3 className="text-center font-medium mb-2">Scan QR Code</h3>
                  <div className="qr-code bg-gray-100 p-4 rounded-md mb-4 flex flex-col items-center">
                    <img
                      src="https://sigmawire.net/i/04/aHFsX2.jpg"
                      alt="UPI Payment QR Code"
                      width="200"
                      height="200"
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Or pay using UPI ID:
                    </p>
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value="academy@upi"
                        readOnly
                        className="px-2 py-1 border rounded-l bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("academy@upi");
                          toast.success("UPI ID copied to clipboard");
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-r text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDirectPayment}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  {loading ? "Processing..." : "Continue with UPI"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="h-4 w-4" />
              <p>Secure payment processed by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptModal = () => {
    if (!showReceiptModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative mx-auto p-5 border w-full max-w-4xl bg-white rounded-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Payment Receipt</h3>
            <button
              onClick={closeReceiptModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="h-[80vh] w-full">
            <PDFViewer width="100%" height="100%">
              <FeeReceipt fee={selectedReceipt} user={currentUser} />
            </PDFViewer>
          </div>

          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={<FeeReceipt fee={selectedReceipt} user={currentUser} />}
              fileName={`Fee_Receipt_${selectedReceipt._id.slice(-8)}.pdf`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {({ loading }) => (
                <button className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? "Preparing download..." : "Download Receipt"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Fee Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View fee details and make payments securely.
        </p>
      </section>

      {/* Fee Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              ₹{statistics.totalFees}
            </h3>
            <p className="text-gray-600">Total Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              ₹{statistics.paidFees}
            </h3>
            <p className="text-gray-600">Paid Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              ₹{statistics.pendingFees}
            </h3>
            <p className="text-gray-600">Pending Fees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              ₹{statistics.overdueFees}
            </h3>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {fee.feeType}
                          </div>
                          <div className="text-sm text-gray-500 ml-2">
                            ({fee.academicYear} - {fee.term})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{fee.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fee.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : fee.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fee.status !== "Paid" ? (
                          <button
                            onClick={() => openPaymentModal(fee)}
                            disabled={loading}
                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button
                            onClick={() => openReceiptModal(fee)}
                            className="text-green-600 hover:text-green-900 font-medium text-sm flex items-center"
                          >
                            <Receipt className="h-4 w-4 mr-1" />
                            View Receipt
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
                  All payments are processed securely through Razorpay
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Payment Timeline</h3>
                <p className="text-sm text-gray-500">
                  Please pay fees before the due date to avoid late charges
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Late Payment</h3>
                <p className="text-sm text-gray-500">
                  Late payment fees apply after the due date
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal />

      {/* Receipt Modal */}
      <ReceiptModal />
    </div>
  );
};

export default Fees;
