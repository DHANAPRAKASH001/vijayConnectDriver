// // import React, { useState } from 'react';
// // import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
// // import { APP_ICONS } from '../../utils/icons'; // Import the APP_ICONS object

// // const VerificationScreen = ({ navigation }) => {
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const steps = [
// //     { title: 'Profile Details', status: 'verified' },
// //     { title: 'Profile Photo', status: 'verified' },
// //     { title: 'Aadhaar Details', status: 'verified' },
// //     { title: 'Driving License', status: 'verified' },
// //   ];

// //   const handleStepPress = (index) => {
// //     setCurrentStep(index);
// //   };

// //   const renderStep = (step, index) => {
// //     const isCurrent = index === currentStep;
// //     const borderColor = step.status === 'verified' ? '#2ecc71' : '#e74c3c';

// //     return (
// //       <TouchableOpacity
// //         key={index}
// //         style={[styles.stepContainer, { borderColor }, isCurrent && styles.currentStep]}
// //         onPress={() => handleStepPress(index)}
// //       >
// //         <Text style={styles.stepTitle}>{step.title}</Text>
// //         <View style={[styles.statusIndicator, { backgroundColor: borderColor }]} />
// //       </TouchableOpacity>
// //     );
// //   };

// //   const handleBack = () => {
// //     navigation.goBack(); // Navigate to the previous screen
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Back Button */}
// //       <TouchableOpacity onPress={handleBack} style={styles.backButton}>
// //         <Image source={APP_ICONS.BACK} style={styles.backIcon} /> {/* Use the back icon from APP_ICONS */}
// //       </TouchableOpacity>

// //       <Text style={styles.header}>Verification</Text>
// //       <View style={styles.stepsContainer}>
// //         {steps.map(renderStep)}
// //       </View>
// //       <TouchableOpacity style={styles.takeRideButton}>
// //         <Text style={styles.buttonText}>Take Ride</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingHorizontal: 20,
// //     paddingVertical: 30,
// //     backgroundColor: '#fff', // Set background color to white
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     top: 30, // Adjust the top position as needed
// //     left: 20, // Adjust the left position as needed
// //   },
// //   backIcon: {
// //     width: 24,
// //     height: 24,
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#000', // Set header text color to black
// //     marginBottom: 20,
// //     paddingleft: 20,
// //   },
// //   stepsContainer: {
// //     flexDirection: 'column', // Change to column to display steps line by line
// //     justifyContent: 'space-between',
// //   },
// //   stepContainer: {
// //     flex: 1,
// //     alignItems: 'center',
// //     padding: 10,
// //     borderWidth: 2, // Increase border width for better visibility
// //     borderRadius: 5,
// //     marginBottom: 10, // Add margin between steps
// //     backgroundColor: '#fff', // Ensure the background color is white
// //   },
// //   currentStep: {
// //     backgroundColor: '#f0f0f0',
// //   },
// //   stepTitle: {
// //     fontSize: 16,
// //     color: '#000', // Set step title text color to black
// //     marginBottom: 5,
// //     textAlign: 'center', // Ensure the text is centered
// //   },
// //   statusIndicator: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //   },
// //   takeRideButton: {
// //     backgroundColor: '#3498db',
// //     padding: 15,
// //     borderRadius: 5,
// //     marginTop: 20,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     textAlign: 'center',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });

// // export default VerificationScreen;

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function RegisterVerificationScreen() {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
//       <div className="w-full max-w-md">
//         {/* Back Button */}
//         <button
//           className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" /> Back
//         </button>

//         {/* Header */}
//         <h2 className="text-xl font-semibold text-center mb-4">Verification</h2>

//         {/* Verification Sections */}
//         <div className="space-y-2">
//           {[
//             { label: "Profile Details", verified: true },
//             { label: "Profile Photo", verified: false },
//             { label: "Aadhaar Details", verified: true },
//             { label: "Driving License", verified: false },
//           ].map((item, index) => (
//             <Card
//               key={index}
//               className={`p-4 flex justify-between items-center border-2 rounded-lg ${
//                 item.verified ? "border-green-500" : "border-red-500"
//               }`}
//             >
//               <span>{item.label}</span>
//               <span className={`text-sm font-medium ${item.verified ? "text-green-500" : "text-red-500"}`}>
//                 {item.verified ? "✔ Verified" : "✖ Reupload"}
//               </span>
//             </Card>
//           ))}
//         </div>

//         {/* Legend */}
//         <div className="flex justify-center items-center gap-4 my-4 text-sm">
//           <div className="flex items-center">
//             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Verified
//           </div>
//           <div className="flex items-center">
//             <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Reupload the Document
//           </div>
//         </div>

//         {/* Take Ride Button */}
//         <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
//           Take Ride
//         </Button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

const VerificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-gray-700 hover:text-black"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-lg font-semibold">Back</span>
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4 mt-10">Verification</h2>

      {/* Divider */}
      <div className="w-full border-t border-gray-300 mb-4"></div>

      {/* Verification Buttons */}
      <div className="w-full max-w-sm">
        {["Profile Details", "Profile Photo", "Aadhaar Details", "Driving License"].map((item, index) => (
          <button
            key={index}
            className="w-full flex justify-between items-center border-2 border-green-500 text-black px-4 py-3 my-2 rounded-lg hover:bg-green-50 transition"
          >
            {item}
            <ChevronRight className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          <span className="text-sm">Verified</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          <span className="text-sm">Reupload the Document</span>
        </div>
      </div>

 {/* Login Button */}
      <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg w-full max-w-sm hover:bg-purple-700">
        Log in
      </button>
    </div>
  );
};

export default VerificationPage;