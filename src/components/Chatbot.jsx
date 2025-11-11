import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, MinusCircle, Loader, Bot } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// API functions to fetch dynamic data
const api = {
  async getAdmissionInfo() {
    const [admissions, students] = await Promise.all([
      axios.get('http://localhost:5000/api/admissions'),
      axios.get('http://localhost:5000/api/students')
    ]);
    
    // Calculate available seats per grade
    const gradeCapacity = {
      'Grade 8': 60,
      'Grade 9': 60,
      'Grade 10': 60
    };
    
    const currentStudents = students.data.data.students.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {});

    const availableSeats = Object.entries(gradeCapacity).map(([grade, capacity]) => ({
      grade,
      availableSeats: capacity - (currentStudents[grade] || 0),
      academicYear: '2025-2026'
    }));

    return {
      requirements: [
        "Completed application form",
        "Previous academic records",
        "Birth certificate",
        "Transfer certificate (if applicable)",
        "Passport size photographs (4)",
        "Entrance test results",
      ],
      process: [
        "Submit online application",
        "Pay application fee (14500)",
        "Take entrance assessment test",
        "Attend parent-student interview",
        "Receive acceptance letter",
        "Complete admission formalities",
      ],
      availableSeats,
      currentApplications: admissions.data.data.admissions.length,
      nextIntakeDate: "June 2026"
    };
  },

  async getFeeInfo() {
    const [fees, payments] = await Promise.all([
      axios.get('http://localhost:5000/api/fees'),
      axios.get('http://localhost:5000/api/fees/statistics')
    ]);

    const feeData = fees.data.data.fees;
    const stats = payments.data.data.statistics;

    return {
      grades: {
        "High School (Grades 8-10)": {
          tuition: 12000,
          lab: 1500,
          activity: 1000,
          total: 14500,
        },
      },
      paymentMethods: [
        "Credit/Debit Card",
        "Bank Transfer",
        "Check",
        "Cash at the Accounts Office",
      ],
      installments: [
        "Annual (7% discount)",
        "Semester-wise (3% discount)",
        "Quarterly (no discount)",
        "Monthly (3% additional fee)",
      ],
      statistics: stats,
      dueDates: feeData.map(fee => ({
        type: fee.feeType,
        dueDate: new Date(fee.dueDate).toLocaleDateString()
      }))
    };
  },

  async getCourseInfo() {
    const [materials, assignments, teachers] = await Promise.all([
      axios.get('http://localhost:5000/api/materials'),
      axios.get('http://localhost:5000/api/assignments'),
      axios.get('http://localhost:5000/api/teachers')
    ]);

    return {
      grades: {
        "High School (Grades 8-10)": {
          subjects: [
            "English",
            "Algebra, Geometry, Calculus",
            "Biology, Chemistry, Physics",
            "World History, Economics, Political Science",
            "Programming & Digital Media",
            "Advanced Placement Courses",
            "Foreign Languages",
          ],
          specialPrograms: [
            "International Exchange Program",
            "Entrepreneurship Academy",
            "Advanced Research Program",
            "College Preparation & Counseling",
          ],
        },
      },
      facilities: [
        "State-of-the-art Computer Labs",
        "Science Laboratories",
        "Digital Library with 20,000+ resources",
        "Indoor Sports Complex",
        "Performing Arts Center",
        "Innovation Hub & Maker Space",
        "Student Counseling Center",
      ],
      currentAssignments: assignments.data.data.assignments,
      studyMaterials: materials.data.data.materials,
      facultyInfo: teachers.data.data.teachers.map(t => ({
        subject: t.subject,
        qualification: t.qualification
      }))
    };
  },

  async getContactInfo() {
    const contacts = await axios.get('http://localhost:5000/api/contacts');
    
    return {
      address:
        "Panchjanya International School, NA-516 Nr Anjaneya Petrol Pump Vadthal, Kapadvanj Rd, Ta, Nadiad, Mahudha, Gujarat 387635",
      phone: {
        main: "09978997826",
        admissions: "09978997826",
      },
      email: {
        general: "schoolpanchjanya@gmail.com",
      },
      hours: {
        weekdays: "7:30 AM - 4:30 PM",
        saturday: "9:00 AM - 1:00 PM",
        sunday: "Closed",
      },
      responseTime: "Usually within 24 hours",
      inquiries: contacts.data.data.contacts.length
    };
  },

  async getEventInfo() {
    const events = await axios.get('http://localhost:5000/api/events');
    return events.data.data.events;
  },

  async getExamInfo() {
    const exams = await axios.get('http://localhost:5000/api/exams');
    return exams.data.data.exams;
  }
};

// CSS Styles for animations
const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      box-shadow: 0 0 0 rgba(79, 70, 229, 0);
    }
    50% {
      opacity: 1;
      transform: translateY(0) scale(1.02);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
    }
    30% {
      transform: translateY(-12px) scale(1.05);
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1);
    }
    50% {
      transform: translateY(-15px) scale(1.08);
      box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.25), 0 10px 10px -5px rgba(79, 70, 229, 0.2);
    }
    70% {
      transform: translateY(-12px) scale(1.05);
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes messageAppear {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes userMessageAppear {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes buttonPulse {
    0%, 100% {
      transform: scale(1);
      background-color: rgba(79, 70, 229, 1);
    }
    50% {
      transform: scale(1.05);
      background-color: rgba(67, 56, 202, 1);
    }
  }

  .animate-slideIn {
    animation: slideIn 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  .animate-bounce {
    animation: bounce 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-pulse {
    animation: pulse 2s infinite ease-in-out;
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .message-bot-appear {
    animation: messageAppear 0.5s ease-out forwards;
  }

  .message-user-appear {
    animation: userMessageAppear 0.5s ease-out forwards;
  }

  .button-pulse {
    animation: buttonPulse 2s infinite;
  }

  .chat-shadow {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .chat-shadow:hover {
    box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
  }

  .options-container {
    transition: all 0.3s ease;
  }

  .option-button {
    transition: all 0.2s ease;
    transform-origin: left;
  }
  
  .option-button:hover {
    transform: scale(1.03);
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm your Panchjanya shikshan sankul assistant. How can I help you today?",
      options: [
        "Admission Process",
        "Fee Structure",
        "Course Information",
        "Contact Details",
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced API fetch function that gets real-time data
  const fetchChatbotInfo = async (userMessage) => {
    try {
      const message = userMessage.toLowerCase();
      
      // Analyze message intent
      if (message.includes("admission") || message.includes("apply") || message.includes("enroll")) {
        return {
          type: "admission",
          data: await api.getAdmissionInfo()
        };
      } 
      
      if (message.includes("fee") || message.includes("payment") || message.includes("cost")) {
        return {
          type: "fees",
          data: await api.getFeeInfo()
        };
      }
      
      if (message.includes("course") || message.includes("class") || message.includes("subject") || 
          message.includes("study") || message.includes("learn") || message.includes("teach")) {
        return {
          type: "courses",
          data: await api.getCourseInfo()
        };
      }
      
      if (message.includes("contact") || message.includes("reach") || message.includes("visit") ||
          message.includes("address") || message.includes("phone") || message.includes("email")) {
        return {
          type: "contact",
          data: await api.getContactInfo()
        };
      }
      
      if (message.includes("event") || message.includes("program") || message.includes("activity") ||
          message.includes("schedule") || message.includes("calendar")) {
        return {
          type: "events",
          data: await api.getEventInfo()
        };
      }
      
      if (message.includes("exam") || message.includes("test") || message.includes("result") ||
          message.includes("score") || message.includes("grade")) {
        return {
          type: "exams",
          data: await api.getExamInfo()
        };
      }

      // Handle specific questions
      if (message.includes("interview")) {
        return {
          type: "admission",
          data: await api.getAdmissionInfo(),
          specificQuestion: "interview"
        };
      }

      if (message.includes("online payment") || message.includes("pay online")) {
        return {
          type: "fees",
          data: await api.getFeeInfo(),
          specificQuestion: "online_payment"
        };
      }

      if (message.includes("late fee")) {
        return {
          type: "fees",
          data: await api.getFeeInfo(),
          specificQuestion: "late_fee"
        };
      }

      // Default response for unrecognized queries
      return {
        type: "default",
        data: null
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error("Failed to fetch information. Please try again.");
      return {
        type: "error",
        data: null
      };
    }
  };

  const formatAdmissionResponse = (data) => {
    const details = [
      "Required Documents:",
      ...data.requirements.map((req) => `• ${req}`),
      "\nAdmission Steps:",
      ...data.process.map((step) => `• ${step}`),
      "\nAvailable Seats:",
      ...data.availableSeats.map(
        (info) =>
          `• ${info.grade}: ${info.availableSeats} seats (${info.academicYear})`
      ),
      `\nCurrent Applications: ${data.currentApplications}`,
      `Next Intake: ${data.nextIntakeDate}`
    ].join("\n");

    return {
      content: "Here's information about our admission process:",
      details,
      options: [
        "Fee Structure", 
        "Course Information", 
        "Contact Details",
        "What are the entrance exam dates?",
        "How to schedule an interview?"
      ],
    };
  };

  const formatFeesResponse = (data) => {
    const fees = Object.entries(data.grades)
      .map(
        ([grade, fees]) =>
          `${grade}:\n• Tuition: ₹${fees.tuition}\n• Lab Fee: ₹${fees.lab}\n• Activity Fee: ₹${fees.activity}\n• Total: ₹${fees.total}`
      )
      .join("\n\n");

    const dueDates = data.dueDates
      .map(fee => `• ${fee.type}: Due by ${fee.dueDate}`)
      .join("\n");

    const stats = data.statistics;
    
    return {
      content: "Here's our fee structure and payment information:",
      details: `${fees}\n\nPayment Methods:\n${data.paymentMethods
        .map((method) => `• ${method}`)
        .join("\n")}\n\nInstallment Options:\n${data.installments
        .map((option) => `• ${option}`)
        .join("\n")}\n\nUpcoming Due Dates:\n${dueDates}\n\nPayment Statistics:\n• Collection Rate: ${stats.collectionPercentage}%\n• Pending Fees: ₹${stats.pendingFees}`,
      options: [
        "Payment Methods",
        "Admission Process", 
        "Contact Details",
        "How to pay online?",
        "Late fee policy"
      ],
    };
  };

  const formatCoursesResponse = (data) => {
    const courses = Object.entries(data.grades)
      .map(
        ([grade, info]) =>
          `${grade}:\nCore Subjects:\n${info.subjects
            .map((sub) => `• ${sub}`)
            .join("\n")}\n\nSpecial Programs:\n${info.specialPrograms
            .map((prog) => `• ${prog}`)
            .join("\n")}`
      )
      .join("\n\n");

    const activeAssignments = data.currentAssignments
      .filter(assignment => new Date(assignment.dueDate) > new Date())
      .slice(0, 3)
      .map(assignment => `• ${assignment.title} (Due: ${new Date(assignment.dueDate).toLocaleDateString()})`);

    const recentMaterials = data.studyMaterials
      .slice(0, 3)
      .map(material => `• ${material.title} (${material.subject})`);

    return {
      content: "Here's our academic information:",
      details: `${courses}\n\nFacilities:\n${data.facilities
        .map((facility) => `• ${facility}`)
        .join("\n")}\n\nRecent Study Materials:\n${recentMaterials.join("\n")}\n\nActive Assignments:\n${activeAssignments.join("\n")}\n\nFaculty Highlights:\n${data.facultyInfo
        .slice(0, 3)
        .map(teacher => `• ${teacher.subject}: ${teacher.qualification}`)
        .join("\n")}`,
      options: [
        "Admission Process", 
        "Fee Structure", 
        "Contact Details",
        "Show all assignments",
        "Download study materials"
      ],
    };
  };

  const formatContactResponse = (data) => {
    return {
      content: "Here's how you can reach us:",
      details: `Address:\n${data.address}\n\nPhone Numbers:\n• Main: ${data.phone.main}\n• Admissions: ${data.phone.admissions}\n\nEmail:\n• General: ${data.email.general}\n\nOffice Hours:\n• Weekdays: ${data.hours.weekdays}\n• Saturday: ${data.hours.saturday}\n• Sunday: ${data.hours.sunday}\n\nTypical Response Time: ${data.responseTime}\nActive Inquiries: ${data.inquiries}`,
      options: [
        "Admission Process", 
        "Fee Structure",
        "Schedule a visit",
        "Request a callback",
        "Report an issue"
      ],
    };
  };
  
  const formatEventResponse = (events) => {
    const upcomingEvents = events
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
      .map(event => `• ${event.title} - ${new Date(event.date).toLocaleDateString()}: ${event.description}`)
      .join("\n");

    return {
      content: "Here are our upcoming events:",
      details: upcomingEvents || "No upcoming events at the moment.",
      options: [
        "View calendar",
        "Register for event",
        "Contact Details",
        "Fee Structure"
      ],
    };
  };

  const formatExamResponse = (exams) => {
    const upcomingExams = exams
      .filter(exam => new Date(exam.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(exam => `• ${exam.subject} (${exam.grade}) - ${new Date(exam.date).toLocaleDateString()}: ${exam.description}`)
      .join("\n");

    return {
      content: "Here's the exam schedule:",
      details: upcomingExams || "No upcoming exams at the moment.",
      options: [
        "View results",
        "Exam policy",
        "Study materials",
        "Contact teacher"
      ],
    };
  };

  const handleSendMessage = async (userMessage) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const result = await fetchChatbotInfo(userMessage);
      let response;

      if (result && result.data) {
        switch (result.type) {
          case "admission":
            response = formatAdmissionResponse(result.data);
            if (result.specificQuestion === "interview") {
              response.content = "About the admission interview:";
              response.details = "Interviews are typically scheduled within a week of your application submission. " +
                               "They are conducted by our academic panel and last about 30-45 minutes. " +
                               "Both parents and the student should be present. " +
                               "\n\nTo schedule an interview:\n" +
                               "1. Log in to your application portal\n" +
                               "2. Click on 'Schedule Interview'\n" +
                               "3. Select your preferred time slot\n" +
                               "\nOr contact our admissions office directly.";
            }
            break;

          case "fees":
            response = formatFeesResponse(result.data);
            if (result.specificQuestion === "online_payment") {
              response.content = "Online Payment Instructions:";
              response.details = "To pay fees online:\n" +
                               "1. Log in to the student portal\n" +
                               "2. Go to 'Fee Payment'\n" +
                               "3. Select the pending fee items\n" +
                               "4. Choose payment method (Card/UPI/Net Banking)\n" +
                               "5. Complete the transaction\n" +
                               "\nA receipt will be emailed to you immediately.";
            } else if (result.specificQuestion === "late_fee") {
              response.content = "Late Fee Policy:";
              response.details = "• Late fee of ₹500 per month applies to pending payments\n" +
                               "• Grace period: 5 days from due date\n" +
                               "• Payment plans available for special circumstances\n" +
                               "• Contact accounts office for arrangements";
            }
            break;

          case "courses":
            response = formatCoursesResponse(result.data);
            break;

          case "contact":
            response = formatContactResponse(result.data);
            break;

          case "events":
            response = formatEventResponse(result.data);
            break;

          case "exams":
            response = formatExamResponse(result.data);
            break;

          default:
            response = {
              content: "I'm here to help! What would you like to know about?",
              options: [
                "Admission Process",
                "Fee Structure",
                "Course Information",
                "Contact Details",
                "Upcoming Events",
                "Exam Schedule"
              ],
            };
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: response.content,
            details: response.details,
            options: response.options,
          },
        ]);
      } else {
        let suggestedOptions;
        const message = userMessage.toLowerCase();
        
        if (message.includes("study") || message.includes("learn")) {
          suggestedOptions = ["Course Information", "Study Materials", "Faculty Details"];
        } else if (message.includes("money") || message.includes("cost")) {
          suggestedOptions = ["Fee Structure", "Payment Methods", "Scholarships"];
        } else if (message.includes("time") || message.includes("when")) {
          suggestedOptions = ["School Timings", "Event Calendar", "Exam Schedule"];
        } else {
          suggestedOptions = [
            "Admission Process",
            "Fee Structure",
            "Course Information",
            "Contact Details",
            "Upcoming Events"
          ];
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "I'm not quite sure about that. Here are some options that might help:",
            options: suggestedOptions,
          },
        ]);
      }
    } catch (error) {
      console.error('Message handling error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "I apologize for the technical difficulty. Please try again or contact our support team.",
          options: ["Contact Support", "Try Again", "Visit Website"],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Inject CSS */}
      <style>{styles}</style>

      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Button */}
        {!isOpen && !isMinimized && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 animate-bounce"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}

        {/* Minimized Chat */}
        {isMinimized && (
          <button
            onClick={() => {
              setIsMinimized(false);
              setIsOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
          >
            <Bot className="h-5 w-5" />
            <span>Chat with us</span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transform transition-transform duration-300 animate-slideIn">
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <h3 className="font-semibold">
                  Panchjanya shikshan sankul Assistant
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsMinimized(true);
                    setIsOpen(false);
                  }}
                  className="hover:bg-indigo-700 p-1 rounded"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-indigo-700 p-1 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white rounded-l-xl rounded-tr-xl"
                        : "bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl"
                    } p-4 shadow-md transform hover:scale-[1.02] transition-transform duration-200`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.details && (
                      <p className="whitespace-pre-line mt-2 text-sm">
                        {message.details}
                      </p>
                    )}
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(option)}
                            className="block w-full text-left px-3 py-2 text-sm bg-white text-indigo-600 rounded hover:bg-indigo-50 transition-colors duration-200"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.message;
                  if (input.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = "";
                  }
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  name="message"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-110"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
