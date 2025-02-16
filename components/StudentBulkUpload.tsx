"use client"

import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { Upload, FileUp, CheckCircle, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { parseCSV, validateStudentData, MAX_STUDENTS } from "@/lib/csvUtils"

// Types
interface CSVRow {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  grade: string
}

type PaymentStatus = "pending" | "processing" | "completed"

declare global {
  interface Window {
    Razorpay: any
  }
}

// Component
export function StudentBulkUpload() {
  // Hooks
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [parsedData, setParsedData] = useState<CSVRow[]>([])
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [loading, setLoading] = useState(false)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  // File upload handlers
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    try {
      const { data, errors } = await parseCSV<CSVRow>(file)

      if (errors.length > 0) {
        toast.error("CSV validation errors", {
          description: `${errors.length} errors found in CSV file`,
        })
        return
      }

      const validationErrors = validateStudentData(data)
      if (validationErrors.length > 0) {
        toast.error("Validation failed", {
          description: validationErrors.join(", "),
        })
        return
      }

      setParsedData(data)
      setPaymentStatus("pending")
    } catch (error) {
      toast.error("Error parsing CSV")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  // Payment handlers
  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error("Payment system is still loading. Please refresh and try again .")
      return
    }

    try {
      // setLoading(true)
      // setPaymentStatus("processing")

      // const response = await axios.post("/api/create-payment", {
      //   studentCount: parsedData.length,
      // })

      // const { orderId, amount } = response.data
      // initializeRazorpay(orderId, amount)
      await handleUpload()
    } catch (error) {
      console.error("Error initializing payment:", error)
      toast.error("Error initializing payment")
      setPaymentStatus("pending")
    } finally {
      setLoading(false)
    }
  }

  const initializeRazorpay = (orderId: string, amount: number) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "School Assessment Platform",
      description: `Payment for ${parsedData.length} students`,
      order_id: orderId,
      handler: handlePaymentSuccess,
      prefill: {
        name: "School Name",
        email: "school@example.com",
      },
      theme: {
        color: "#4F46E5",
      },
      modal: {
        ondismiss: handlePaymentCancellation,
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  const handlePaymentSuccess = async (response: any) => {
    try {
      const verificationResponse = await axios.post("/api/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      })

      if (verificationResponse.data.success) {
        setPaymentStatus("completed")
        toast.success("Payment successful")
        await handleUpload()
      } else {
        throw new Error("Payment verification failed")
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error("Payment failed. Please try again.")
      setPaymentStatus("pending")
    }
  }

  const handlePaymentCancellation = () => {
    toast.error("Payment was cancelled. Please try again.")
    setPaymentStatus("pending")
  }

  // Upload handlers
  const handleUpload = async () => {
    setUploading(true)
    try {
      const response = await axios.post("/api/students/bulkupload", parsedData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

      if (response.data.success) {
        toast.success("Upload successful", {
          description: `${response.data.createdCount} students created`,
        })
        setParsedData([])
        setPaymentStatus("pending")
        router.push("/dashboard/school/studentlist")
      }
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.response?.data?.message || "An error occurred",
      })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  // Effects
  useEffect(() => {
    const checkRazorpayLoaded = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true)
      }
    }

    checkRazorpayLoaded()
    const interval = setInterval(checkRazorpayLoaded, 1000)
    return () => clearInterval(interval)
  }, [])

  // UI Components
  const renderFileUpload = () => (
    //@ts-ignore
    <motion.div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        ${isDragActive ? "border-blue-400 bg-blue-50/50" : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />
      <motion.div animate={{ y: isDragActive ? -10 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <FileUp className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? "text-blue-600" : "text-gray-400"}`} />
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? "Drop your CSV file here" : "Drag & drop your CSV file here"}
        </p>
        <p className="text-sm text-gray-500 mt-2">or click to select from your computer</p>
      </motion.div>
    </motion.div>
  )

  const renderPaymentSummary = () => (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
        <CreditCard className="w-5 h-5" />
        Payment Summary
      </h3>
      <div className="space-y-2">
        <p className="text-gray-600">Total Students: {parsedData.length}</p>
        <p className="text-gray-600">Cost per Student: ₹100</p>
        <p className="text-xl font-bold text-blue-600">Total Amount: ₹{parsedData.length * 100}</p>
      </div>
    </motion.div>
  )

  const renderDataPreview = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
        <CheckCircle className="w-5 h-5" />
        Preview Data
      </h3>
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.slice(0, 5).map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-blue-50/50 transition-colors"
              >
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.dateOfBirth}</TableCell>
                <TableCell>{row.grade}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  const getButtonText = () => {
    if (parsedData.length > MAX_STUDENTS) return `Exceeds ${MAX_STUDENTS} student limit`
    if (loading) return "Initializing Payment..."
    if (!loading && paymentStatus === "pending") return `Pay ₹${parsedData.length * 100}`
    if (!loading && paymentStatus === "processing") return "Processing Payment..."
    if (!loading && paymentStatus === "completed" && uploading) return "Creating Students..."
    return ""
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
        onLoad={() => setIsRazorpayLoaded(true)}
        onError={() => {
          console.error("Failed to load Razorpay script")
          toast.error("Failed to load payment system")
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 py-8 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <Card className="bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Bulk Student Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!parsedData.length && renderFileUpload()}

              {parsedData.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                  {parsedData.length > MAX_STUDENTS && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 font-medium">
                        Warning: You can only upload up to {MAX_STUDENTS} students at once. Current count:{" "}
                        {parsedData.length}
                      </p>
                    </div>
                  )}

                  {renderPaymentSummary()}
                  {renderDataPreview()}

                  {uploading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-600 mt-2 text-center">Uploading... {progress}%</p>
                    </motion.div>
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={paymentStatus === "pending" ? handlePayment : undefined}
                      disabled={
                        paymentStatus === "processing" || uploading || loading || parsedData.length > MAX_STUDENTS
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-6 font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {getButtonText()}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}

export default StudentBulkUpload

