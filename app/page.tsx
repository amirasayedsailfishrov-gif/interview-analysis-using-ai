"use client"

import { useState, useRef } from "react"
import {
  Brain,
  MessageCircle,
  Target,
  Users,
  TrendingUp,
  Code,
  Zap,
  CheckCircle,
  BarChart3,
  Globe,
  Upload,
  FileText,
  Settings,
  ChevronDown,
  Play,
  Loader2,
  X,
  AlertCircle,
  Mic,
  RotateCcw,
  Heart,
  Shield,
  Languages,
  TrendingDown,
  Award,
  Activity,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AIInterviewAnalyzer() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';
  
  const analysisCards = [
    {
      id: 1,
      arabicTitle: "التواصل",
      englishLabel: "communication",
      icon: MessageCircle,
      description: "تحليل مهارات التواصل الفعال",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      arabicTitle: "الجودة",
      englishLabel: "quality",
      icon: Target,
      description: "ضمان الجودة والتميز",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      arabicTitle: "المهارات",
      englishLabel: "skills",
      icon: Zap,
      description: "تطوير المهارات المتخصصة",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      arabicTitle: "الالتزام",
      englishLabel: "engagement",
      icon: CheckCircle,
      description: "الالتزام والمسؤولية",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: 5,
      arabicTitle: "الأنماط",
      englishLabel: "patterns",
      icon: BarChart3,
      description: "تحليل الأنماط والسلوكيات",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 6,
      arabicTitle: "اللغوي",
      englishLabel: "linguistic",
      icon: Globe,
      description: "المهارات اللغوية والتواصلية",
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      id: 7,
      arabicTitle: "التحليل الفني",
      englishLabel: "technical",
      icon: Code,
      description: "الخبرة التقنية المتخصصة",
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      id: 8,
      arabicTitle: "أسلوب التواصل",
      englishLabel: "communication",
      icon: Users,
      description: "وضوح وهيكلة التقييم",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: 9,
      arabicTitle: "جودة الاستجابة",
      englishLabel: "response",
      icon: Target,
      description: "عمق وتحديد التقييم",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: 10,
      arabicTitle: "أنماط التردد",
      englishLabel: "patterns",
      icon: TrendingUp,
      description: "تحليل الكلمات والتوقف المؤقت",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ]

  const [isArabic, setIsArabic] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const analysisRef = useRef<HTMLElement>(null)

  const uploadVideo = async (file: File) => {
    const formData = new FormData()
    formData.append('video', file)
    
    try {
      const response = await fetch(`${API_URL}/video`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed - Status:', response.status, 'Response:', errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Upload error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      }
      throw error
    }
  }

  const getAnalysis = async (videoId: string) => {
    try {
      const response = await fetch(`${API_URL}/video/${videoId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Analysis fetch failed - Status:', response.status, 'Response:', errorText)
        throw new Error(`Failed to get analysis: ${response.status} - ${errorText}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Analysis fetch error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.')
      }
      throw error
    }
  }

  // Event handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select triggered', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      })
      
      // Validate file type by extension and MIME type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
      const allowedExtensions = ['.mp4', '.mov', '.avi', '.mkv']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      
      console.log('File validation:', {
        type: file.type,
        extension: fileExtension,
        allowedTypes,
        allowedExtensions
      })
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        console.log('File type validation failed')
        setError(isArabic ? 'نوع الملف غير مدعوم. يرجى اختيار ملف فيديو (MP4, MOV, AVI, MKV)' : 'Unsupported file type. Please choose a video file (MP4, MOV, AVI, MKV)')
        return
      }
      
      // Validate file size (100MB)
      if (file.size > 100 * 1024 * 1024) {
        console.log('File size validation failed')
        setError(isArabic ? 'حجم الملف كبير جداً (الحد الأقصى 100 ميجابايت)' : 'File size too large (maximum 100MB)')
        return
      }
      
      console.log('File validation passed, setting selected file')
      setSelectedFile(file)
      setError(null)
    } else {
      console.log('No file selected')
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      
      // Validate file type by extension and MIME type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
      const allowedExtensions = ['.mp4', '.mov', '.avi', '.mkv']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        setError(isArabic ? 'نوع الملف غير مدعوم. يرجى اختيار ملف فيديو (MP4, MOV, AVI, MKV)' : 'Unsupported file type. Please choose a video file (MP4, MOV, AVI, MKV)')
        return
      }
      
      if (file.size > 100 * 1024 * 1024) {
        setError(isArabic ? 'حجم الملف كبير جداً (الحد الأقصى 100 ميجابايت)' : 'File size too large (maximum 100MB)')
        return
      }
      
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    try {
      setIsUploading(true)
      setError(null)
      
      console.log('🚀 Starting upload process...')
      
      // Upload video
      console.log('📤 Uploading video to backend...')
      const uploadResponse = await uploadVideo(selectedFile)
      console.log('✅ Upload response:', uploadResponse)
      
      const videoId = uploadResponse.id
      console.log('🔍 Getting analysis results for ID:', videoId)
      
      // Get analysis results
      const analysisData = await getAnalysis(videoId)
      console.log('✅ Analysis results:', analysisData)
      setAnalysisResult(analysisData)
      
      // Close upload modal and show results
      setShowUploadModal(false)
      setShowResults(true)
      setSelectedFile(null)
      
    } catch (err: any) {
      console.error('❌ Upload/Analysis failed:', err)
      let errorMessage = isArabic ? 'فشل في تحليل الفيديو' : 'Failed to analyze video'
      
      if (err.message) {
        errorMessage += `: ${err.message}`
      }
      
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalyzeClick = () => {
    setShowUploadModal(true)
  }

  const handleExploreFeatures = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const goToPartnersPage = () => {
    setCurrentPage(2)
  }

  const goToMainPage = () => {
    setCurrentPage(1)
  }

  if (currentPage === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-400">AI Interview Analyzer</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <button onClick={goToMainPage} className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "الرئيسية" : "Home"}
                </button>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "رفع فيديو" : "Upload Video"}
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "كيف يعمل؟" : "How It Works"}
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "الميزات" : "Features"}
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "الفوائد" : "Benefits"}
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium">
                  {isArabic ? "محرك التحليل" : "Analysis Engine"}
                </a>
              </nav>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsArabic(!isArabic)}
                  variant="outline"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700 bg-transparent"
                >
                  {isArabic ? "English" : "العربية"}
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  {isArabic ? "جرب الآن" : "Try Now"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Partners Section */}
        <section className="bg-white py-20" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">الفريق والشركاء الاستراتيجيون</h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                شراكة مع المؤسسات الأكاديمية والحكومية المرموقة لتطوير وتحليل المقابلات بالذكاء الاصطناعي
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center justify-items-center">
              {/* KAUST Academy */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KAUST_Academy_logo_Full_Color%20%281%29-xnC9ihMz3T603WqvItPY49oYIEbVFj.png"
                  alt="KAUST Academy"
                  className="h-24 w-auto object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center">أكاديمية كاوست</p>
              </div>

              {/* Asset 1 */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Asset%201-Pr8kNVQ6WBF3Pr6BITyjclP601qHo1.png"
                  alt="Partner Organization"
                  className="h-24 w-auto object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center">شريك استراتيجي</p>
              </div>

              {/* KAUST University */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KAUST_Logo.svg%20%281%29-GvwXKbYNQ36j0eqwnA53Kxtvxtr6EO.png"
                  alt="KAUST University"
                  className="h-24 w-auto object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center">جامعة الملك عبدالله للعلوم والتقنية</p>
              </div>

              {/* King Fahad Security College */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kfsc%20logo%20%281%29_kfsc%20logo.jpg-Q4PUIxIRFH1joLo5bYE2d3zCJ8ngLY.jpeg"
                  alt="King Fahad Security College"
                  className="h-24 w-auto object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center">كلية الملك فهد الأمنية</p>
              </div>

              {/* Ministry of Interior */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%B4%D8%B9%D8%A7%D8%B1%20%D9%88%D8%B2%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AF%D8%A7%D8%AE%D9%84%D9%8A%D8%A9-0%D9%A1.jpg-w5GnL3kWaeMNumnZaqOorkvmYfoEDK.jpeg"
                  alt="Ministry of Interior"
                  className="h-24 w-auto object-contain mb-4"
                />
                <p className="text-sm text-gray-600 text-center">وزارة الداخلية</p>
              </div>
            </div>

            <div className="text-center mt-16">
              <Button
                onClick={goToMainPage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-400">AI Interview Analyzer</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "الرئيسية" : "Home"}
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "رفع فيديو" : "Upload Video"}
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "كيف يعمل؟" : "How It Works"}
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "الميزات" : "Features"}
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "الفوائد" : "Benefits"}
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium">
                {isArabic ? "محرك التحليل" : "Analysis Engine"}
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsArabic(!isArabic)}
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700 bg-transparent"
              >
                {isArabic ? "English" : "العربية"}
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">{isArabic ? "جرب الآن" : "Try Now"}</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 border border-blue-400 rotate-45"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border border-purple-400 rotate-12"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-cyan-400 rotate-45"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 border border-pink-400 rotate-12"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Stats badges */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              🚀 {isArabic ? "مدعوم بالذكاء الاصطناعي المتقدم" : "Powered by Advanced AI"}
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              📊 50K+ {isArabic ? "مقابلة تم تحليلها" : "Interviews Analyzed"}
            </div>
          </div>

          {/* Main hero content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isArabic ? "المنصة مدعومة" : "The platform is"}
              </span>
              <br />
              <span className="text-white">
                {isArabic ? "بالذكاء الاصطناعي" : "supported by artificial intelligence"}
              </span>
            </h1>

            <div className="mb-8">
              <p className="text-xl text-gray-300 mb-2">
                {isArabic
                  ? "لتحويل المقابلات إلى نصوص دقيقة تُفهم،"
                  : "To convert interviews into accurate texts that are understood"}
              </p>
              <p className="text-2xl font-semibold text-cyan-400">
                {isArabic ? "وتُعتمد في اتخاذ القرار...." : "and relied upon in decision-making..."}
              </p>
            </div>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {isArabic
                ? "ارفع فيديو المقابلة الخاصة بك واحصل على تحليل فوري وشامل مدعوم بالشبكات العصبية المتقدمة. احصل على رؤى مفصلة حول مهارات التواصل ومستويات الثقة واستراتيجيات التحسين القابلة للتطبيق."
                : "Upload your interview video and receive instant, comprehensive feedback powered by advanced neural networks. Get detailed insights on communication skills, confidence levels, and actionable improvement strategies."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={handleAnalyzeClick}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                {isArabic ? "تحليل مقابلتي" : "Analyze My Interview"}
              </Button>
              <Button
                onClick={handleExploreFeatures}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                {isArabic ? "استكشف الميزات" : "Explore Features"}
              </Button>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {isArabic ? "محرك التحليل العصبي" : "Neural Analysis Engine"}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isArabic
                  ? "تقوم خوارزميات التعلم العميق المتقدمة بفك تشفير التعبيرات الدقيقة وأنماط الكلام ومؤشرات الثقة بدقة علمية"
                  : "Advanced deep learning algorithms decode micro-expressions, speech patterns, and confidence indicators with scientific precision"}
              </p>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {isArabic ? "معالجة فائقة السرعة" : "Lightning-Fast Processing"}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isArabic
                  ? "توفر البنية التحتية الثورية للذكاء الاصطناعي تحليلًا شاملاً للمقابلات في أقل من 60 ثانية بدقة على مستوى المؤسسات"
                  : "Revolutionary AI infrastructure delivers comprehensive interview analysis in under 60 seconds with enterprise-grade accuracy"}
              </p>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{isArabic ? "رؤى دقيقة" : "Precision Insights"}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isArabic
                  ? "احصل على تعليقات مركزة بدقة على لغة الجسد ونبرة الصوت وتوصيات التحسين الاستراتيجية المصممة خصيصًا لقطاعك"
                  : "Get laser-focused feedback on body language, vocal tonality, and strategic improvement recommendations tailored to your industry"}
              </p>
            </Card>
          </div>

          {/* Discover more */}
          <div className="text-center">
            <p className="text-gray-400 mb-2">{isArabic ? "اكتشف القوة أدناه" : "Discover the Power Below"}</p>
            <ChevronDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">⚙️ {isArabic ? "كيف يعمل؟" : "How It Works"} ⚙️</h2>
            <p className="text-xl text-gray-600">
              {isArabic
                ? "خطوات بسيطة للحصول على تحليل شامل للمقابلة"
                : "Simple steps to get comprehensive interview analysis"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{isArabic ? "رفع فيديو" : "Upload Video"}</h3>
              <p className="text-gray-600 mb-6">
                {isArabic
                  ? "ارفع فيديو المقابلة الخاصة بك بأي صيغة مدعومة"
                  : "Upload your interview video in any supported format"}
              </p>
              <div className="text-left space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {isArabic ? "يدعم صيغ MP4, MOV, AVI, MKV" : "Supports MP4, MOV, AVI, MKV formats"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {isArabic ? "حجم الملف يصل إلى 100 ميجابايت" : "Up to 100MB file size"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {isArabic ? "تحسين الجودة تلقائيًا" : "Automatic quality optimization"}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {isArabic ? "تحميل مشفر آمن" : "Secure encrypted upload"}
                </div>
              </div>
            </Card>

            <Card className="bg-white p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isArabic ? "تحليل الذكاء الاصطناعي" : "AI Analysis"}
              </h3>
              <p className="text-gray-600">
                {isArabic
                  ? "يقوم الذكاء الاصطناعي لدينا بتحليل أنماط الكلام والثقة وأسلوب التواصل"
                  : "Our AI analyzes speech patterns, confidence, and communication style"}
              </p>
            </Card>

            <Card className="bg-white p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{isArabic ? "احصل على النتائج" : "Get Results"}</h3>
              <p className="text-gray-600">
                {isArabic
                  ? "تلقي رؤى وتوصيات مفصلة للتحسين"
                  : "Receive detailed insights and recommendations for improvement"}
              </p>
            </Card>
          </div>

          {/* Processing Pipeline */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              🔧 {isArabic ? "خط أنابيب المعالجة المدعوم بالذكاء الاصطناعي" : "AI-Powered Processing Pipeline"}
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{isArabic ? "استخراج الصوت" : "Audio Extraction"}</h4>
                <p className="text-sm text-gray-600">
                  {isArabic
                    ? "صوت عالي الجودة مستخرج من محتوى الفيديو"
                    : "High-quality audio extracted from video content"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{isArabic ? "الكلام إلى نص" : "Speech-to-Text"}</h4>
                <p className="text-sm text-gray-600">
                  {isArabic ? "التعرف المتقدم على الكلام باللغة العربية" : "Advanced Arabic speech recognition"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {isArabic ? "10 وظائف تحليل" : "10 Analysis Functions"}
                </h4>
                <p className="text-sm text-gray-600">
                  {isArabic ? "معالجة متوازية للحصول على رؤى شاملة" : "Parallel processing for comprehensive insights"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{isArabic ? "إنشاء تقرير" : "Report Generation"}</h4>
                <p className="text-sm text-gray-600">
                  {isArabic ? "نتائج مفصلة مع توصيات" : "Detailed results with recommendations"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arabic Analysis Functions Section */}
      <section ref={analysisRef} className="bg-white py-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10 وظيفة تحليل متوازية</h2>
            <p className="text-xl text-gray-600">تحليل شامل ومتعدد الأبعاد لمهاراتك في المقابلة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {analysisCards.map((card) => {
              const IconComponent = card.icon
              return (
                <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center h-24">
                    <div className={`w-20 h-full ${card.bgColor} flex items-center justify-center`}>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1 px-4 py-3">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{card.arabicTitle}</h3>
                      <p className="text-xs text-gray-600">{card.description}</p>
                    </div>
                    <div className="px-3">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-medium"
                        size="sm"
                      >
                        {card.englishLabel}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-100 py-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">نظام التقييم الشامل</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">74%</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">الأكاديمية التقنية</div>
              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "74%" }}></div>
              </div>
              <p className="text-sm text-gray-600">تحسين الخبرة التقنية</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">87</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">درجة الطلاقة</div>
              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "87%" }}></div>
              </div>
              <p className="text-sm text-gray-600">0-100 في التوضيحات</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-cyan-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">مستوى الثقة</div>
              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "95%" }}></div>
              </div>
              <p className="text-sm text-gray-600">في حالة تطبيق ما</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isArabic ? "جاهز لبدء رحلتك؟" : "Ready to Start Your Journey?"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {isArabic ? "اكتشف المزيد عن شركائنا الاستراتيجيين" : "Discover more about our strategic partners"}
          </p>
          <Button
            onClick={goToPartnersPage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            {isArabic ? "تعرف على شركائنا" : "Meet Our Partners"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-400">AI Interview Analyzer</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              منصة مدعومة بالذكاء الاصطناعي لتحويل المقابلات إلى نصوص دقيقة وتحليل شامل للمهارات والأداء مع توصيات قابلة
              للتطبيق
            </p>
          </div>
        </div>
      </footer>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => {
                setShowUploadModal(false)
                setSelectedFile(null)
                setError(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                {isArabic ? "ارفع فيديو المقابلة" : "Upload Your Interview Video"}
              </h2>
              <p className="text-gray-600 mb-8">
                {isArabic ? "اختر ملف فيديو للتحليل" : "Select a video file to analyze"}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Upload Area with Glowing Animation */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 hover:border-blue-400 transition-colors relative overflow-hidden upload-glow cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                {/* Glowing Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 animate-pulse upload-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-blue-50 opacity-20 animate-ping"></div>

                <div className="relative z-10">
                  {selectedFile ? (
                    <div className="text-green-600">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {isArabic ? "تم اختيار الملف" : "File Selected"}
                      </h3>
                      <p className="text-gray-700 mb-4">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {isArabic ? "الحجم:" : "Size:"} {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Upload className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {isArabic ? "اسحب وأفلت ملف الفيديو هنا" : "Drag and drop your video file here"}
                      </h3>
                      <p className="text-gray-500 mb-4">{isArabic ? "أو انقر لاختيار الملف" : "or click to select file"}</p>
                      <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center justify-center font-medium transition-colors">
                        {isArabic ? "اختر ملف" : "Choose File"}
                      </div>
                    </>
                  )}
                  
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/mkv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-1 mb-6">
                <p>{isArabic ? "الصيغ المدعومة: MP4, MOV, AVI, MKV" : "Supported formats: MP4, MOV, AVI, MKV"}</p>
                <p>{isArabic ? "الحد الأقصى لحجم الملف: 100 ميجابايت" : "Maximum file size: 100MB"}</p>
              </div>

              {selectedFile && (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSelectedFile(null)
                      setError(null)
                    }}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    {isArabic ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isArabic ? "جاري التحليل..." : "Analyzing..."}
                      </>
                    ) : (
                      isArabic ? "تحليل الفيديو" : "Analyze Video"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => {
                setShowResults(false)
                setAnalysisResult(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-blue-600">
                  {isArabic ? "📊 نتائج التحليل النفسي والجنائي" : "📊 Psychological & Forensic Analysis Results"}
                </h2>
                <Button
                  onClick={() => setIsArabic(!isArabic)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Languages className="w-4 h-4" />
                  {isArabic ? "English" : "العربية"}
                </Button>
              </div>
              <p className="text-gray-600">
                {isArabic ? "تحليل شامل لشخصية المتحدث وأنماط السلوك" : "Comprehensive personality and behavioral pattern analysis"}
              </p>
            </div>

            {/* Performance Overview */}
            <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                {isArabic ? "📈 التقييم العام للأداء" : "📈 Overall Performance Assessment"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">A</div>
                  <div className="text-sm text-gray-600">
                    {isArabic ? "الدرجة الإجمالية" : "Overall Grade"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">
                    {isArabic ? "الثقة بالنفس" : "Confidence Level"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">
                    {isArabic ? "وضوح التعبير" : "Communication Clarity"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">78%</div>
                  <div className="text-sm text-gray-600">
                    {isArabic ? "الاستقرار العاطفي" : "Emotional Stability"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Charts and Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Sentiment Analysis Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  {isArabic ? "📊 تحليل المشاعر" : "📊 Sentiment Analysis"}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? "إيجابي | Positive" : "Positive | إيجابي"}</span>
                    <span className="font-semibold text-green-600">{analysisResult.sentiment?.positive || "0%"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: analysisResult.sentiment?.positive || "0%"}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? "محايد | Neutral" : "Neutral | محايد"}</span>
                    <span className="font-semibold text-gray-600">{analysisResult.sentiment?.neutral || "0%"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full" 
                      style={{width: analysisResult.sentiment?.neutral || "0%"}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{isArabic ? "سلبي | Negative" : "Negative | سلبي"}</span>
                    <span className="font-semibold text-red-600">{analysisResult.sentiment?.negative || "0%"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: analysisResult.sentiment?.negative || "0%"}}
                    ></div>
                  </div>
                </div>
              </Card>

              {/* Speech Metrics */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-blue-600" />
                  {isArabic ? "🎤 مقاييس الكلام" : "🎤 Speech Metrics"}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-blue-700">
                        {isArabic ? "سرعة الكلام | Speech Rate" : "Speech Rate | سرعة الكلام"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {analysisResult.speech_rate_wps?.toFixed(2) || "0"} {isArabic ? "كلمة/ثانية" : "words/sec"}
                      </div>
                    </div>
                    <div className="text-2xl">🗣️</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-green-700">
                        {isArabic ? "إجمالي الكلمات | Total Words" : "Total Words | إجمالي الكلمات"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {analysisResult.total_words || 0} {isArabic ? "كلمة" : "words"}
                      </div>
                    </div>
                    <div className="text-2xl">📝</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* New Analysis Cards - Response Quality, Hesitation, Soft Skills, Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Response Quality Analysis */}
              {analysisResult.response_quality && (
                <Card className="p-6 border-green-200 bg-green-50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Award className="w-5 h-5 ml-2 text-green-600" />
                    {isArabic ? "🏆 جودة الاستجابة" : "🏆 Response Quality"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className={isArabic ? "text-right" : "text-left"}>
                        <div className="font-semibold text-green-700">
                          {isArabic ? "الدرجة الإجمالية" : "Overall Score"}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {(analysisResult.response_quality.score * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? analysisResult.response_quality.level : analysisResult.response_quality.level}
                        </div>
                      </div>
                      <div className="text-4xl">🎯</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${analysisResult.response_quality.score * 100}%`}}
                      ></div>
                    </div>
                    
                    {analysisResult.response_quality.depth_indicators?.length > 0 && (
                      <div className="p-3 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-green-700 mb-2">
                          {isArabic ? "مؤشرات العمق" : "Depth Indicators"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.response_quality.depth_indicators.map((indicator: string, index: number) => (
                            <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                              {indicator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Hesitation Patterns */}
              {analysisResult.hesitation_patterns && (
                <Card className="p-6 border-orange-200 bg-orange-50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <TrendingDown className="w-5 h-5 ml-2 text-orange-600" />
                    {isArabic ? "📊 أنماط التردد" : "📊 Hesitation Patterns"}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {analysisResult.hesitation_patterns.filler_ratio}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "كلمات الحشو" : "Filler Words"}
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {analysisResult.hesitation_patterns.hesitation_ratio}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {isArabic ? "أنماط التردد" : "Hesitation"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg text-right">
                      <div className="font-semibold text-orange-700">
                        {isArabic ? "مستوى الطلاقة:" : "Fluency Level:"} {analysisResult.hesitation_patterns.fluency_level}
                      </div>
                    </div>

                    {Object.keys(analysisResult.hesitation_patterns.filler_words).length > 0 && (
                      <div className="p-3 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-orange-700 mb-2">
                          {isArabic ? "كلمات الحشو المكتشفة" : "Detected Filler Words"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(analysisResult.hesitation_patterns.filler_words).map(([word, count], index: number) => (
                            <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                              {word} ({String(count)}x)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Soft Skills and Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Soft Skills Detection */}
              {analysisResult.soft_skills && (
                <Card className="p-6 border-purple-200 bg-purple-50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Users className="w-5 h-5 ml-2 text-purple-600" />
                    {isArabic ? "🤝 المهارات الناعمة" : "🤝 Soft Skills"}
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analysisResult.soft_skills.skills_count}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isArabic ? "مهارات مكتشفة" : "Skills Detected"}
                      </div>
                    </div>
                    
                    {Object.keys(analysisResult.soft_skills.detected_skills).length > 0 && (
                      <div className="space-y-2">
                        {Object.entries(analysisResult.soft_skills.detected_skills).map(([skill, keywords], index: number) => (
                          <div key={index} className="p-3 bg-white rounded-lg text-right">
                            <div className="font-semibold text-purple-700 mb-1">{skill}</div>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(keywords) && keywords.map((keyword: string, keyIndex: number) => (
                                <span key={keyIndex} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                            {analysisResult.soft_skills.skill_scores[skill] && (
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{width: `${analysisResult.soft_skills.skill_scores[skill] * 100}%`}}
                                ></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Engagement Level */}
              {analysisResult.engagement_level && (
                <Card className="p-6 border-blue-200 bg-blue-50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Activity className="w-5 h-5 ml-2 text-blue-600" />
                    {isArabic ? "🔥 مستوى المشاركة" : "🔥 Engagement Level"}
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(analysisResult.engagement_level.engagement_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {analysisResult.engagement_level.engagement_level}
                      </div>
                    </div>
                    
                    {/* Engagement Bar Chart */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {isArabic ? "مشاركة عالية" : "High Engagement"}
                        </span>
                        <span className="font-semibold text-green-600">
                          {analysisResult.engagement_level.high_engagement_count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${Math.min(analysisResult.engagement_level.high_engagement_count * 20, 100)}%`}}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {isArabic ? "مشاركة متوسطة" : "Medium Engagement"}
                        </span>
                        <span className="font-semibold text-yellow-600">
                          {analysisResult.engagement_level.medium_engagement_count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{width: `${Math.min(analysisResult.engagement_level.medium_engagement_count * 20, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Flow Chart - Analysis Summary */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  {isArabic ? "📈 مخطط التحليل التدفقي" : "📈 Analysis Flow Chart"}
                </h3>
                <div className="space-y-4">
                  {/* Flow Steps */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-blue-700">
                          {isArabic ? "استخراج الصوت" : "Audio Extraction"}
                        </div>
                        <div className="text-sm text-gray-600">✅ {isArabic ? "مكتمل" : "Completed"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-green-700">
                          {isArabic ? "تحويل الكلام" : "Speech Recognition"}
                        </div>
                        <div className="text-sm text-gray-600">✅ {analysisResult.total_words} {isArabic ? "كلمة" : "words"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-purple-700">
                          {isArabic ? "التحليل النفسي" : "Psychological Analysis"}
                        </div>
                        <div className="text-sm text-gray-600">✅ {isArabic ? "تم" : "Done"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-orange-700">
                          {isArabic ? "إنشاء التقرير" : "Report Generation"}
                        </div>
                        <div className="text-sm text-gray-600">✅ {isArabic ? "جاهز" : "Ready"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bar Chart - Skills Overview */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  {isArabic ? "📊 الرسم البياني الإجمالي" : "📊 Overall Bar Chart"}
                </h3>
                <div className="space-y-4">
                  {/* Analysis Scores Bar Chart */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {isArabic ? "جودة الاستجابة" : "Response Quality"}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {analysisResult.response_quality ? (analysisResult.response_quality.score * 100).toFixed(0) + '%' : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${analysisResult.response_quality ? analysisResult.response_quality.score * 100 : 0}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {isArabic ? "المشاعر الإيجابية" : "Positive Sentiment"}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {analysisResult.sentiment?.positive || "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: analysisResult.sentiment?.positive || "0%"}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {isArabic ? "الطلاقة" : "Speech Fluency"}
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {analysisResult.hesitation_patterns ? (100 - analysisResult.hesitation_patterns.filler_ratio).toFixed(0) + '%' : '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${analysisResult.hesitation_patterns ? 100 - analysisResult.hesitation_patterns.filler_ratio : 100}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {isArabic ? "مستوى المشاركة" : "Engagement Level"}
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {analysisResult.engagement_level ? (analysisResult.engagement_level.engagement_score * 100).toFixed(0) + '%' : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${analysisResult.engagement_level ? analysisResult.engagement_level.engagement_score * 100 : 0}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Comprehensive Arabic Report */}
            {analysisResult.comprehensive_report && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-r-4 border-green-500">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <FileText className="w-5 h-5 ml-2 text-green-600" />
                    📋 الملخص التنفيذي
                  </h3>
                  <div className="text-right whitespace-pre-line text-gray-700">
                    {analysisResult.comprehensive_report.executive_summary}
                  </div>
                </Card>

                {/* Speech Pattern Analysis */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Mic className="w-5 h-5 ml-2 text-blue-600" />
                    🎤 تحليل أنماط الكلام
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-right">
                      <h4 className="font-semibold text-blue-700 mb-2">تحليل سرعة الكلام</h4>
                      <p className="text-sm text-gray-700">{analysisResult.comprehensive_report.speech_pattern_analysis?.rate_analysis}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-right">
                      <h4 className="font-semibold text-green-700 mb-2">التقييم النفسي</h4>
                      <div className="space-y-1">
                        {analysisResult.comprehensive_report.speech_pattern_analysis?.psychological_indicators?.map((indicator: string, index: number) => (
                          <p key={index} className="text-sm text-gray-700">• {indicator}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-right">
                    <h4 className="font-semibold text-yellow-700 mb-2">التقييم الجنائي</h4>
                    <p className="text-sm text-gray-700">{analysisResult.comprehensive_report.speech_pattern_analysis?.forensic_assessment}</p>
                  </div>
                </Card>

                {/* Word Repetition Analysis */}
                {analysisResult.comprehensive_report.repetition_analysis && (
                  <Card className="p-6 border-purple-200 bg-purple-50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                      <RotateCcw className="w-5 h-5 ml-2 text-purple-600" />
                      🔄 تحليل تكرار الكلمات
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-purple-700 mb-2">نظرة عامة</h4>
                        <p className="text-gray-700">{analysisResult.comprehensive_report.repetition_analysis.overview}</p>
                        <p className="text-sm text-gray-600 mt-2">{analysisResult.comprehensive_report.repetition_analysis.interpretation}</p>
                      </div>
                      
                      {analysisResult.comprehensive_report.repetition_analysis.psychological_meaning?.length > 0 && (
                        <div className="p-4 bg-white rounded-lg text-right">
                          <h4 className="font-semibold text-purple-700 mb-2">المعنى النفسي للتكرار</h4>
                          <div className="space-y-2">
                            {analysisResult.comprehensive_report.repetition_analysis.psychological_meaning.map((meaning: string, index: number) => (
                              <p key={index} className="text-sm text-gray-700">• {meaning}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisResult.comprehensive_report.repetition_analysis.excessive_words?.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg text-right border border-red-200">
                          <h4 className="font-semibold text-red-700 mb-2">كلمات مكررة بإفراط</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.comprehensive_report.repetition_analysis.excessive_words.map(([word, count]: [string, number], index: number) => (
                              <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                                {word} ({count}x)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Emotional Stability */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Heart className="w-5 h-5 ml-2 text-red-600" />
                    💖 الاستقرار العاطفي
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg text-right">
                      <h4 className="font-semibold text-green-700 mb-2">التقييم العام</h4>
                      <p className="text-gray-700">{analysisResult.comprehensive_report.emotional_stability?.overall_rating}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg text-right">
                      <h4 className="font-semibold text-orange-700 mb-2">تقييم المخاطر</h4>
                      <p className="text-gray-700">{analysisResult.comprehensive_report.emotional_stability?.risk_assessment}</p>
                    </div>
                  </div>
                  {analysisResult.comprehensive_report.emotional_stability?.recommendations?.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-right">
                      <h4 className="font-semibold text-blue-700 mb-2">التوصيات</h4>
                      <div className="space-y-1">
                        {analysisResult.comprehensive_report.emotional_stability.recommendations.map((rec: string, index: number) => (
                          <p key={index} className="text-sm text-gray-700">• {rec}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Psychological Profile */}
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-r-4 border-purple-500">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Brain className="w-5 h-5 ml-2 text-purple-600" />
                    🧠 الملف النفسي الشامل
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-purple-700 mb-2">أسلوب التواصل</h4>
                        <p className="text-gray-700">{analysisResult.comprehensive_report.psychological_profile?.communication_style}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-purple-700 mb-2">تقييم الشخصية</h4>
                        <p className="text-gray-700">{analysisResult.comprehensive_report.psychological_profile?.personality_assessment}</p>
                      </div>
                    </div>
                    
                    {analysisResult.comprehensive_report.psychological_profile?.dominant_traits?.length > 0 && (
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-purple-700 mb-2">الصفات المهيمنة</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.comprehensive_report.psychological_profile.dominant_traits.map((trait: string, index: number) => (
                            <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.comprehensive_report.psychological_profile?.behavioral_indicators?.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-lg text-right border border-yellow-200">
                        <h4 className="font-semibold text-yellow-700 mb-2">المؤشرات السلوكية</h4>
                        <div className="space-y-1">
                          {analysisResult.comprehensive_report.psychological_profile.behavioral_indicators.map((indicator: string, index: number) => (
                            <p key={index} className="text-sm text-gray-700">⚠️ {indicator}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Forensic Analysis */}
                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <Shield className="w-5 h-5 ml-2 text-red-600" />
                    🛡️ التحليل الجنائي
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg text-right">
                      <h4 className="font-semibold text-red-700 mb-2">تقييم المصداقية</h4>
                      <p className="text-gray-700">{analysisResult.comprehensive_report.forensic_analysis?.credibility_assessment}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg text-right">
                      <h4 className="font-semibold text-red-700 mb-2">مؤشرات الخداع</h4>
                      <p className="text-gray-700">{analysisResult.comprehensive_report.forensic_analysis?.deception_indicators}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg text-right">
                      <h4 className="font-semibold text-red-700 mb-2">مناسبة المقابلة</h4>
                      <p className="text-gray-700">{analysisResult.comprehensive_report.forensic_analysis?.interview_suitability}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg text-right">
                      <h4 className="font-semibold text-red-700 mb-2">عوامل المخاطر</h4>
                      <div className="space-y-1">
                        {analysisResult.comprehensive_report.forensic_analysis?.risk_factors?.map((risk: string, index: number) => (
                          <p key={index} className="text-sm text-gray-700">⚠️ {risk}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Final Recommendations */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-r-4 border-green-500">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-right">
                    <CheckCircle className="w-5 h-5 ml-2 text-green-600" />
                    ✅ التوصيات النهائية
                  </h3>
                  <div className="space-y-4">
                    {analysisResult.comprehensive_report.final_recommendations?.psychological_development?.length > 0 && (
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-green-700 mb-2">التطوير النفسي</h4>
                        <div className="space-y-1">
                          {analysisResult.comprehensive_report.final_recommendations.psychological_development.map((rec: string, index: number) => (
                            <p key={index} className="text-sm text-gray-700">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.comprehensive_report.final_recommendations?.communication_improvement?.length > 0 && (
                      <div className="p-4 bg-white rounded-lg text-right">
                        <h4 className="font-semibold text-green-700 mb-2">تحسين التواصل</h4>
                        <div className="space-y-1">
                          {analysisResult.comprehensive_report.final_recommendations.communication_improvement.map((rec: string, index: number) => (
                            <p key={index} className="text-sm text-gray-700">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-right">
                        <h4 className="font-semibold text-blue-700 mb-2">المناسبة المهنية</h4>
                        <p className="text-gray-700">{analysisResult.comprehensive_report.final_recommendations?.professional_suitability}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg text-right">
                        <h4 className="font-semibold text-purple-700 mb-2">اقتراحات المتابعة</h4>
                        <div className="space-y-1">
                          {analysisResult.comprehensive_report.final_recommendations?.follow_up_suggestions?.map((suggestion: string, index: number) => (
                            <p key={index} className="text-sm text-gray-700">• {suggestion}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Personality Analysis Report */}
            <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                {isArabic ? "🧠 تقرير تحليل الشخصية" : "🧠 Personality Analysis Report"}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-2">
                    {isArabic ? "📍 نمط الشخصية المهيمن" : "📍 Dominant Personality Pattern"}
                  </h4>
                  <p className="text-gray-700">
                    {isArabic 
                      ? `بناءً على تحليل سرعة الكلام (${(analysisResult.speech_rate_wps || 0).toFixed(2)} كلمة/ثانية)، يشير هذا إلى شخصية ${(analysisResult.speech_rate_wps || 0) > 2 ? 'نشطة ومتحمسة' : 'هادئة ومتأنية'}. النسبة العالية من المشاعر الإيجابية (${analysisResult.sentiment?.positive || '0%'}) تدل على ${parseInt(analysisResult.sentiment?.positive || '0') > 60 ? 'استقرار نفسي جيد وثقة بالنفس' : 'حاجة لتعزيز الثقة بالنفس'}.`
                      : `Based on speech rate analysis (${(analysisResult.speech_rate_wps || 0).toFixed(2)} words/sec), this indicates an ${(analysisResult.speech_rate_wps || 0) > 2 ? 'active and enthusiastic' : 'calm and deliberate'} personality. The high positive sentiment ratio (${analysisResult.sentiment?.positive || '0%'}) suggests ${parseInt(analysisResult.sentiment?.positive || '0') > 60 ? 'good psychological stability and self-confidence' : 'need for confidence building'}.`
                    }
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-2">
                    {isArabic ? "🎯 المؤشرات السلوكية" : "🎯 Behavioral Indicators"}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {isArabic 
                        ? `التواصل: ${(analysisResult.speech_rate_wps || 0) > 1.5 ? 'ممتاز - يتحدث بوضوح وثقة' : 'جيد - قد يحتاج لمزيد من الممارسة'}`
                        : `Communication: ${(analysisResult.speech_rate_wps || 0) > 1.5 ? 'Excellent - speaks clearly and confidently' : 'Good - may need more practice'}`
                      }
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      {isArabic 
                        ? `الاستقرار العاطفي: ${parseInt(analysisResult.sentiment?.negative || '0') < 20 ? 'مستقر عاطفياً' : 'يحتاج لإدارة الضغوط'}`
                        : `Emotional Stability: ${parseInt(analysisResult.sentiment?.negative || '0') < 20 ? 'emotionally stable' : 'needs stress management'}`
                      }
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      {isArabic 
                        ? `التفكير التحليلي: ${(analysisResult.total_words || 0) > 100 ? 'قادر على التعبير بتفصيل' : 'يفضل الإيجاز'}`
                        : `Analytical Thinking: ${(analysisResult.total_words || 0) > 100 ? 'capable of detailed expression' : 'prefers brevity'}`
                      }
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-2">
                    {isArabic ? "💡 التوصيات للتطوير" : "💡 Development Recommendations"}
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• {isArabic ? "العمل على تنويع نبرة الصوت لجذب انتباه أفضل" : "Work on voice modulation for better engagement"}</li>
                    <li>• {isArabic ? "تطوير مهارات القصص لجعل الحديث أكثر تشويقاً" : "Develop storytelling skills for more engaging communication"}</li>
                    <li>• {isArabic ? "ممارسة تقنيات الاسترخاء لتحسين الأداء تحت الضغط" : "Practice relaxation techniques for better performance under pressure"}</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Frequent Words with Arabic Translation */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                {isArabic ? "🔤 الكلمات الأكثر تكراراً مع المعاني" : "🔤 Most Frequent Words with Meanings"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.frequent_words?.slice(0, 8).map(([word, count]: [string, number], index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-800">{word}</span>
                      <div className="text-sm text-gray-600">
                        {/* Simple word translation mapping */}
                        {word === 'الجرائم' && (isArabic ? 'الجرائم | Crimes' : 'Crimes | الجرائم')}
                        {word === 'العلوم' && (isArabic ? 'العلوم | Sciences' : 'Sciences | العلوم')}
                        {word === 'التحليل' && (isArabic ? 'التحليل | Analysis' : 'Analysis | التحليل')}
                        {word === 'المحكمة' && (isArabic ? 'المحكمة | Court' : 'Court | المحكمة')}
                        {word === 'الأدلة' && (isArabic ? 'الأدلة | Evidence' : 'Evidence | الأدلة')}
                        {word === 'الجنائية' && (isArabic ? 'الجنائية | Criminal' : 'Criminal | الجنائية')}
                        {!['الجرائم', 'العلوم', 'التحليل', 'المحكمة', 'الأدلة', 'الجنائية'].includes(word) && word}
                      </div>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">{count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bilingual Transcription */}
            {analysisResult.translation && (
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  {isArabic ? "📝 النص الكامل (عربي - إنجليزي)" : "📝 Full Transcription (Arabic - English)"}
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {analysisResult.translation.map((segment: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-300 pl-4 py-2">
                      <div className="text-xs text-gray-500 mb-2">
                        ⏱️ {segment.start?.toFixed(2)}s - {segment.end?.toFixed(2)}s
                      </div>
                      <div className="text-sm mb-2 p-2 bg-blue-50 rounded text-right">
                        <strong>{isArabic ? "العربي:" : "Arabic:"}</strong> {segment.arabic_text || segment.text}
                      </div>
                      <div className="text-sm p-2 bg-green-50 rounded text-left">
                        <strong>{isArabic ? "الإنجليزي:" : "English:"}</strong> {segment.english_text || segment.text}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Sensitive Words Alert */}
            {analysisResult.sensitive_words && analysisResult.sensitive_words.length > 0 && (
              <Card className="p-6 mb-6 border-red-200 bg-red-50">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {isArabic ? "⚠️ تحذير: كلمات حساسة" : "⚠️ Warning: Sensitive Content Detected"}
                </h3>
                <div className="space-y-2">
                  {analysisResult.sensitive_words.map((alert: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                      <div className="font-semibold text-red-600">{alert.word}</div>
                      <div className="text-sm text-gray-600">{alert.text}</div>
                      <div className="text-xs text-gray-500">
                        ⏱️ {isArabic ? "الوقت:" : "Time:"} {alert.start.toFixed(2)}s - {alert.end.toFixed(2)}s
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={() => {
                  // Download report functionality can be added here
                  console.log('Download report')
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                📄 {isArabic ? "تحميل التقرير" : "Download Report"}
              </Button>
              <Button
                onClick={() => {
                  setShowResults(false)
                  setAnalysisResult(null)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                ✓ {isArabic ? "إغلاق" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
