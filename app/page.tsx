"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, GraduationCap, IndianRupee, Star, Phone, Mail, Globe, User, LogOut, Upload, Edit, Save, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// User interface
interface UserType {
  id: string
  name: string
  email: string
  profilePhoto?: string
  jeeRank?: number
  neetRank?: number
  twelfthPercentage?: number
  tenthPercentage?: number
  bio?: string
  phone?: string
  documents?: {
    jeeScorecard?: string
    neetScorecard?: string
    twelfthMarksheet?: string
    tenthMarksheet?: string
  }
}

// Sample college data with JEE/NEET cutoffs
const colleges = [
  {
    id: 1,
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    rating: 4.8,
    fees: "200000-300000",
    courses: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    facilities: ["Library", "Hostel", "Sports Complex", "Labs", "WiFi", "Cafeteria"],
    admissionRequirement: "JEE Advanced",
    established: 1961,
    students: 8000,
    phone: "+91-11-2659-1000",
    email: "info@iitd.ac.in",
    website: "www.iitd.ac.in",
    description: "Premier engineering institute known for excellence in technical education and research.",
    jeeAdvancedCutoff: 500,
    jeeMainsCutoff: 25000,
    neetCutoff: null,
  },
  {
    id: 2,
    name: "University of Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    rating: 4.5,
    fees: "50000-150000",
    courses: ["Arts", "Science", "Commerce", "Law", "Medicine"],
    facilities: ["Library", "Hostel", "Sports Complex", "Medical Center", "WiFi"],
    admissionRequirement: "CUET",
    established: 1922,
    students: 132000,
    phone: "+91-11-2766-7049",
    email: "info@du.ac.in",
    website: "www.du.ac.in",
    description: "One of India's largest and most prestigious universities offering diverse academic programs.",
    jeeAdvancedCutoff: null,
    jeeMainsCutoff: null,
    neetCutoff: null,
  },
  {
    id: 3,
    name: "All India Institute of Medical Sciences Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    rating: 4.9,
    fees: "100000-250000",
    courses: ["MBBS", "MD", "MS", "Nursing", "Pharmacy"],
    facilities: ["Research Labs", "Library", "Hostel", "Hospital", "WiFi", "Auditorium"],
    admissionRequirement: "NEET",
    established: 1956,
    students: 3500,
    phone: "+91-11-2659-3333",
    email: "info@aiims.edu",
    website: "www.aiims.edu",
    description: "India's premier medical institution for medical education and research.",
    jeeAdvancedCutoff: null,
    jeeMainsCutoff: null,
    neetCutoff: 50,
  },
  {
    id: 4,
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Government",
    rating: 4.7,
    fees: "200000-350000",
    courses: ["Computer Science", "Mechanical Engineering", "Chemical Engineering", "Aerospace"],
    facilities: ["Library", "Hostel", "Research Labs", "Sports Complex", "WiFi", "Innovation Center"],
    admissionRequirement: "JEE Advanced",
    established: 1958,
    students: 10000,
    phone: "+91-22-2572-2545",
    email: "info@iitb.ac.in",
    website: "www.iitb.ac.in",
    description: "Top-tier engineering institute with strong industry connections and research programs.",
    jeeAdvancedCutoff: 300,
    jeeMainsCutoff: 15000,
    neetCutoff: null,
  },
  {
    id: 5,
    name: "Manipal Academy of Higher Education",
    location: "Manipal",
    state: "Karnataka",
    type: "Private",
    rating: 4.3,
    fees: "300000-500000",
    courses: ["Engineering", "Medicine", "Pharmacy", "Management"],
    facilities: ["Library", "Hostel", "Hospital", "Sports", "WiFi", "Labs"],
    admissionRequirement: "JEE Mains/NEET",
    established: 1953,
    students: 28000,
    phone: "+91-820-292-3000",
    email: "info@manipal.edu",
    website: "www.manipal.edu",
    description: "Leading private university with diverse programs and global recognition.",
    jeeAdvancedCutoff: null,
    jeeMainsCutoff: 80000,
    neetCutoff: 15000,
  },
  {
    id: 6,
    name: "Vellore Institute of Technology",
    location: "Vellore",
    state: "Tamil Nadu",
    type: "Private",
    rating: 4.2,
    fees: "200000-400000",
    courses: ["Engineering", "Computer Science", "Biotechnology", "Management"],
    facilities: ["Library", "Hostel", "Sports Complex", "Labs", "WiFi", "Innovation Center"],
    admissionRequirement: "VITEEE/JEE Mains",
    established: 1984,
    students: 35000,
    phone: "+91-416-220-2020",
    email: "info@vit.ac.in",
    website: "www.vit.ac.in",
    description: "Premier private technical university with strong industry connections.",
    jeeAdvancedCutoff: null,
    jeeMainsCutoff: 120000,
    neetCutoff: null,
  },
]

// Default credentials
const DEFAULT_CREDENTIALS = {
  email: "student@example.com",
  password: "password123"
}

const states = ["All States", "Delhi", "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "West Bengal"]
const courseCategories = ["All Courses", "Engineering", "Arts", "Science", "Commerce", "Medicine", "Law"]
const collegeTypes = ["All Types", "Government", "Private"]
const feeRanges = ["All Ranges", "0-50000", "50000-100000", "100000-200000", "200000+"]

export default function CollegeFinder() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser, any] = useState<UserType | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("All States")
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedFeeRange, setSelectedFeeRange] = useState("All Ranges")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [jeeRankFilter, setJeeRankFilter] = useState("")
  const [neetRankFilter, setNeetRankFilter] = useState("")

  // Profile edit state
  const [editedProfile, setEditedProfile] = useState<UserType | null>(null)

  const { toast } = useToast()

  const allFacilities = [
    "Library",
    "Hostel",
    "Sports Complex",
    "Labs",
    "WiFi",
    "Cafeteria",
    "Medical Center",
    "Research Labs",
    "Cultural Center",
    "Innovation Center",
  ]

  // Handle login
  const handleLogin = () => {
    if (loginEmail === DEFAULT_CREDENTIALS.email && loginPassword === DEFAULT_CREDENTIALS.password) {
      const user: UserType = {
        id: "1",
        name: "John Doe",
        email: loginEmail,
        profilePhoto: "/placeholder.svg?height=100&width=100",
        jeeRank: 15000,
        neetRank: 5000,
        twelfthPercentage: 92.5,
        tenthPercentage: 95.0,
        bio: "Aspiring engineer passionate about technology and innovation.",
        phone: "+91-9876543210"
      }
      setCurrentUser(user)
      setIsLoggedIn(true)
      setShowAuthDialog(false)
      setLoginEmail("")
      setLoginPassword("")
      toast({
        title: "Login Successful",
        description: "Welcome back! You can now access personalized features.",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use student@example.com / password123",
        variant: "destructive"
      })
    }
  }

  // Handle signup
  const handleSignup = () => {
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match.",
        variant: "destructive"
      })
      return
    }

    const user: UserType = {
      id: Date.now().toString(),
      name: signupData.name,
      email: signupData.email,
      profilePhoto: "/placeholder.svg?height=100&width=100"
    }
    setCurrentUser(user)
    setIsLoggedIn(true)
    setShowAuthDialog(false)
    setSignupData({ name: "", email: "", password: "", confirmPassword: "" })
    toast({
      title: "Account Created",
      description: "Welcome! Your account has been created successfully.",
    })
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setJeeRankFilter("")
    setNeetRankFilter("")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  // Handle profile update
  const handleProfileUpdate = () => {
    if (editedProfile && currentUser) {
      setCurrentUser(editedProfile)
      setIsEditingProfile(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    }
  }

  // Start editing profile
  const startEditingProfile = () => {
    setEditedProfile(currentUser ? { ...currentUser } : null)
    setIsEditingProfile(true)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditedProfile(null)
    setIsEditingProfile(false)
  }

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      // Search term filter
      if (
        searchTerm &&
        !college.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !college.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !college.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false
      }

      // State filter
      if (selectedState !== "All States" && college.state !== selectedState) {
        return false
      }

      // Course filter
      if (selectedCourse !== "All Courses") {
        const hasMatchingCourse = college.courses.some(
          (course) =>
            course.toLowerCase().includes(selectedCourse.toLowerCase()) ||
            selectedCourse.toLowerCase().includes(course.toLowerCase()),
        )
        if (!hasMatchingCourse) return false
      }

      // Type filter
      if (selectedType !== "All Types" && college.type !== selectedType) {
        return false
      }

      // Fee range filter
      if (selectedFeeRange !== "All Ranges") {
        const [feeMin, feeMax] = college.fees.split("-").map((f) => Number.parseInt(f))
        const avgFee = (feeMin + feeMax) / 2

        switch (selectedFeeRange) {
          case "0-50000":
            if (avgFee > 50000) return false
            break
          case "50000-100000":
            if (avgFee < 50000 || avgFee > 100000) return false
            break
          case "100000-200000":
            if (avgFee < 100000 || avgFee > 200000) return false
            break
          case "200000+":
            if (avgFee < 200000) return false
            break
        }
      }

      // Facilities filter
      if (selectedFacilities.length > 0) {
        const hasAllFacilities = selectedFacilities.every((facility) => college.facilities.includes(facility))
        if (!hasAllFacilities) return false
      }

      // JEE rank filter (only for logged-in users)
      if (isLoggedIn && jeeRankFilter && currentUser?.jeeRank) {
        const userJeeRank = currentUser.jeeRank
        if (college.jeeAdvancedCutoff && userJeeRank > college.jeeAdvancedCutoff) return false
        if (college.jeeMainsCutoff && userJeeRank > college.jeeMainsCutoff) return false
      }

      // NEET rank filter (only for logged-in users)
      if (isLoggedIn && neetRankFilter && currentUser?.neetRank) {
        const userNeetRank = currentUser.neetRank
        if (college.neetCutoff && userNeetRank > college.neetCutoff) return false
      }

      return true
    })
  }, [searchTerm, selectedState, selectedCourse, selectedType, selectedFeeRange, selectedFacilities, jeeRankFilter, neetRankFilter, isLoggedIn, currentUser])

  const handleFacilityChange = (facility: string, checked: boolean) => {
    if (checked) {
      setSelectedFacilities([...selectedFacilities, facility])
    } else {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">College Finder</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search colleges, courses, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* User Authentication */}
            {isLoggedIn && currentUser ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileDialog(true)}
                  className="flex items-center space-x-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.profilePhoto || "/placeholder.svg"} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{currentUser.name}</span>
                </Button>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Welcome to College Finder</DialogTitle>
                    <DialogDescription>
                      Sign in to your account or create a new one to access personalized features.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin" className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-md text-sm">
                        <p className="font-medium">Demo Credentials:</p>
                        <p>Email: student@example.com</p>
                        <p>Password: password123</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                      <Button className="w-full" onClick={handleLogin}>
                        Sign In
                      </Button>
                      <div className="text-center">
                        <Button variant="link" className="text-sm">
                          Forgot your password?
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="signup" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                          id="fullname"
                          placeholder="Enter your full name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <Button className="w-full" onClick={handleSignup}>
                        Create Account
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      {/* Profile Dashboard Dialog */}
      {isLoggedIn && currentUser && (
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Profile Dashboard
                {!isEditingProfile && (
                  <Button variant="outline" size="sm" onClick={startEditingProfile}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Profile Photo and Basic Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={isEditingProfile ? editedProfile?.profilePhoto : currentUser.profilePhoto} />
                  <AvatarFallback className="text-lg">
                    {(isEditingProfile ? editedProfile?.name : currentUser.name)?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Full Name"
                        value={editedProfile?.name || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                      <p className="text-muted-foreground">{currentUser.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">JEE Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        placeholder="Enter JEE Rank"
                        value={editedProfile?.jeeRank || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, jeeRank: Number(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">
                        {currentUser.jeeRank ? currentUser.jeeRank.toLocaleString() : "Not provided"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">NEET Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        placeholder="Enter NEET Rank"
                        value={editedProfile?.neetRank || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, neetRank: Number(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-2xl font-bold text-green-600">
                        {currentUser.neetRank ? currentUser.neetRank.toLocaleString() : "Not provided"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">12th Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter 12th %"
                        value={editedProfile?.twelfthPercentage || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, twelfthPercentage: Number(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-2xl font-bold text-purple-600">
                        {currentUser.twelfthPercentage ? `${currentUser.twelfthPercentage}%` : "Not provided"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">10th Percentage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter 10th %"
                        value={editedProfile?.tenthPercentage || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, tenthPercentage: Number(e.target.value) } : null)}
                      />
                    ) : (
                      <p className="text-2xl font-bold text-orange-600">
                        {currentUser.tenthPercentage ? `${currentUser.tenthPercentage}%` : "Not provided"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Phone Number</Label>
                    {isEditingProfile ? (
                      <Input
                        placeholder="Enter phone number"
                        value={editedProfile?.phone || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-sm">{currentUser.phone || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bio</Label>
                    {isEditingProfile ? (
                      <Textarea
                        placeholder="Tell us about yourself..."
                        value={editedProfile?.bio || ""}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-sm">{currentUser.bio || "No bio provided"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      JEE Scorecard
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      NEET Scorecard
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      12th Marksheet
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      10th Marksheet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {isEditingProfile && (
                <div className="flex space-x-3">
                  <Button onClick={handleProfileUpdate} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={cancelEditing} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* State Filter */}
                <div>
                  <Label className="text-sm font-medium">State</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Filter */}
                <div>
                  <Label className="text-sm font-medium">Course Category</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courseCategories.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium">College Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {collegeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fee Range Filter */}
                <div>
                  <Label className="text-sm font-medium">Fee Range (₹)</Label>
                  <Select value={selectedFeeRange} onValueChange={setSelectedFeeRange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {feeRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* JEE/NEET Rank Filters - Only for logged-in users */}
                {isLoggedIn && currentUser && (
                  <>
                    {currentUser.jeeRank && (
                      <div>
                        <Label className="text-sm font-medium">Filter by JEE Eligibility</Label>
                        <div className="mt-2 flex items-center space-x-2">
                          <Checkbox
                            id="jee-filter"
                            checked={jeeRankFilter === "eligible"}
                            onCheckedChange={(checked) => setJeeRankFilter(checked ? "eligible" : "")}
                          />
                          <Label htmlFor="jee-filter" className="text-sm">
                            Show only colleges I'm eligible for (JEE Rank: {currentUser.jeeRank.toLocaleString()})
                          </Label>
                        </div>
                      </div>
                    )}

                    {currentUser.neetRank && (
                      <div>
                        <Label className="text-sm font-medium">Filter by NEET Eligibility</Label>
                        <div className="mt-2 flex items-center space-x-2">
                          <Checkbox
                            id="neet-filter"
                            checked={neetRankFilter === "eligible"}
                            onCheckedChange={(checked) => setNeetRankFilter(checked ? "eligible" : "")}
                          />
                          <Label htmlFor="neet-filter" className="text-sm">
                            Show only colleges I'm eligible for (NEET Rank: {currentUser.neetRank.toLocaleString()})
                          </Label>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Facilities Filter */}
                <div>
                  <Label className="text-sm font-medium">Facilities</Label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {allFacilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={selectedFacilities.includes(facility)}
                          onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                        />
                        <Label htmlFor={facility} className="text-sm">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedState("All States")
                    setSelectedCourse("All Courses")
                    setSelectedType("All Types")
                    setSelectedFeeRange("All Ranges")
                    setSelectedFacilities([])
                    setJeeRankFilter("")
                    setNeetRankFilter("")
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Found {filteredColleges.length} colleges</h2>
              <p className="text-muted-foreground">
                {isLoggedIn ? "Personalized results based on your profile" : "Discover the best educational institutions in India"}
              </p>
            </div>

            <div className="grid gap-6">
              {filteredColleges.map((college) => (
                <Card key={college.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{college.name}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {college.location}, {college.state}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-semibold">{college.rating}</span>
                        </div>
                        <Badge variant={college.type === "Government" ? "default" : "secondary"}>{college.type}</Badge>
                        {/* Eligibility Badge */}
                        {isLoggedIn && currentUser && (
                          <div className="mt-1">
                            {((college.jeeAdvancedCutoff && currentUser.jeeRank && currentUser.jeeRank <= college.jeeAdvancedCutoff) ||
                              (college.jeeMainsCutoff && currentUser.jeeRank && currentUser.jeeRank <= college.jeeMainsCutoff) ||
                              (college.neetCutoff && currentUser.neetRank && currentUser.neetRank <= college.neetCutoff)) && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Eligible
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{college.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Courses Offered
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {college.courses.slice(0, 3).map((course) => (
                            <Badge key={course} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                          {college.courses.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{college.courses.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <IndianRupee className="h-4 w-4 mr-2" />
                          Annual Fees
                        </h4>
                        <p className="text-lg font-semibold text-green-600">
                          ₹{college.fees.split("-")[0]} - ₹{college.fees.split("-")[1]}
                        </p>
                      </div>
                    </div>

                    {/* Cutoff Information */}
                    {(college.jeeAdvancedCutoff || college.jeeMainsCutoff || college.neetCutoff) && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Cutoff Ranks</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.jeeAdvancedCutoff && (
                            <Badge variant="secondary" className="text-xs">
                              JEE Advanced: {college.jeeAdvancedCutoff.toLocaleString()}
                            </Badge>
                          )}
                          {college.jeeMainsCutoff && (
                            <Badge variant="secondary" className="text-xs">
                              JEE Mains: {college.jeeMainsCutoff.toLocaleString()}
                            </Badge>
                          )}
                          {college.neetCutoff && (
                            <Badge variant="secondary" className="text-xs">
                              NEET: {college.neetCutoff.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Accordion type="single" collapsible>
                      <AccordionItem value="details">
                        <AccordionTrigger>View More Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div>
                              <h5 className="font-semibold mb-2">Basic Information</h5>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Established:</strong> {college.established}
                                </p>
                                <p>
                                  <strong>Students:</strong> {college.students.toLocaleString()}
                                </p>
                                <p>
                                  <strong>Admission:</strong> {college.admissionRequirement}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-semibold mb-2">Contact Information</h5>
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {college.phone}
                                </p>
                                <p className="flex items-center">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {college.email}
                                </p>
                                <p className="flex items-center">
                                  <Globe className="h-3 w-3 mr-2" />
                                  {college.website}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-semibold mb-2">Facilities</h5>
                            <div className="flex flex-wrap gap-1">
                              {college.facilities.map((facility) => (
                                <Badge key={facility} variant="secondary" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-semibold mb-2">All Courses</h5>
                            <div className="flex flex-wrap gap-1">
                              {college.courses.map((course) => (
                                <Badge key={course} variant="outline" className="text-xs">
                                  {course}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No colleges found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find more results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6" />
                <h3 className="text-lg font-bold">College Finder</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your trusted partner in finding the perfect educational institution. Discover, compare, and connect with
                top colleges across India.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                  Facebook
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                  LinkedIn
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Home
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Search Colleges
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Compare Colleges
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Admission Guide
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Scholarships
                  </Button>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Engineering Colleges
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Medical Colleges
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Arts & Science
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Management
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Law Colleges
                  </Button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Help Center
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Contact Us
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    FAQ
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">
                    Terms of Service
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
                <p className="text-gray-300 text-sm">
                  Get the latest updates on college admissions and educational opportunities.
                </p>
              </div>
              <div className="flex space-x-2 w-full md:w-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-300">
                <p>&copy; {new Date().getFullYear()} College Finder. All rights reserved.</p>
              </div>
              <div className="flex space-x-6 text-sm text-gray-300">
                <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto text-sm">
                  Privacy Policy
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto text-sm">
                  Terms of Service
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto text-sm">
                  Cookie Policy
                </Button>
              </div>
            </div>
            <div className="text-center mt-4 text-xs text-gray-400">
              <p>Made with ❤️ for students across India | Empowering education </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
