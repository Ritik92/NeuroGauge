"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { Upload, FileUp, CheckCircle, CreditCard } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

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

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 }
const th: React.CSSProperties = { textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', padding: '11px 16px', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { fontSize: 13.5, color: 'var(--ink)', padding: '13px 16px' }

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
        color: "#0E9384",
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
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? 'var(--pri)' : 'var(--border-c)'}`,
        background: isDragActive ? 'var(--tint)' : 'var(--canvas)',
        borderRadius: 16,
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease',
      }}
    >
      <input {...getInputProps()} />
      <FileUp size={44} style={{ margin: '0 auto 14px', display: 'block', color: isDragActive ? 'var(--pri)' : 'var(--muted)' }} />
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
        {isDragActive ? "Drop your CSV file here" : "Drag & drop your CSV file here"}
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>or click to select from your computer</p>
    </div>
  )

  const renderPaymentSummary = () => (
    <div style={{ background: 'var(--tint)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--pri)' }}>
        <CreditCard size={18} />
        Payment summary
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>Total students: {parsedData.length}</p>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>Cost per student: ₹100</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '4px 0 0', letterSpacing: '-0.01em' }}>Total amount: ₹{parsedData.length * 100}</p>
      </div>
    </div>
  )

  const renderDataPreview = () => (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}>
        <CheckCircle size={18} style={{ color: '#1F8A5B' }} />
        Preview data
      </h3>
      <div style={{ border: '1px solid var(--border-c)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--border-c)' }}>
                <th style={th}>First name</th>
                <th style={th}>Last name</th>
                <th style={th}>Email</th>
                <th style={th}>Date of birth</th>
                <th style={th}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.slice(0, 5).map((row, index) => (
                <tr key={index} style={{ borderTop: index !== 0 ? '1px solid var(--border-c)' : 'none' }}>
                  <td style={td}>{row.firstName}</td>
                  <td style={td}>{row.lastName}</td>
                  <td style={{ ...td, color: 'var(--muted)' }}>{row.email}</td>
                  <td style={{ ...td, color: 'var(--muted)' }}>{row.dateOfBirth}</td>
                  <td style={td}>{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

  const btnDisabled = paymentStatus === "processing" || uploading || loading || parsedData.length > MAX_STUDENTS

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
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Upload size={24} style={{ color: 'var(--pri)' }} />
          Bulk student upload
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Import multiple students at once from a CSV file</p>

        <div style={{ ...card, marginTop: 24 }}>
          {!parsedData.length && renderFileUpload()}

          {parsedData.length > 0 && (
            <div>
              {parsedData.length > MAX_STUDENTS && (
                <div style={{ marginBottom: 20, padding: 14, background: 'color-mix(in srgb, #C0453B 10%, transparent)', border: '1px solid color-mix(in srgb, #C0453B 30%, transparent)', borderRadius: 12 }}>
                  <p style={{ fontSize: 13.5, color: '#C0453B', fontWeight: 500, margin: 0 }}>
                    Warning: You can only upload up to {MAX_STUDENTS} students at once. Current count: {parsedData.length}
                  </p>
                </div>
              )}

              {renderPaymentSummary()}
              {renderDataPreview()}

              {uploading && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ height: 8, borderRadius: 999, background: 'var(--border-c)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--pri)', borderRadius: 999, transition: 'width 0.2s ease' }} />
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '8px 0 0', textAlign: 'center' }}>Uploading... {progress}%</p>
                </div>
              )}

              <button
                onClick={paymentStatus === "pending" ? handlePayment : undefined}
                disabled={btnDisabled}
                className="ng-btn-primary"
                style={{
                  width: '100%',
                  height: 48,
                  background: 'var(--pri)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: btnDisabled ? 'not-allowed' : 'pointer',
                  opacity: btnDisabled ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {getButtonText()}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentBulkUpload
