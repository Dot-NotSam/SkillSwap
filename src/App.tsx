import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Globe, Plus, Search, Heart, Sparkles, ArrowRight, Shuffle, X, Sun, Moon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  country: string;
  canTeach: string;
  wantToLearn: string;
  timestamp: number;
}

interface Match {
  id: string;
  teacher: User;
  learner: User;
  skill: string;
  timestamp: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    canTeach: '',
    wantToLearn: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMatches, setNewMatches] = useState<Match[]>([]);
  const [showRandomMatch, setShowRandomMatch] = useState(false);
  const [randomMatch, setRandomMatch] = useState<Match | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('skillswap-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillswap-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillswap-theme', 'light');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const findMatches = (newUser: User, existingUsers: User[]): Match[] => {
    const foundMatches: Match[] = [];
    
    existingUsers.forEach(existingUser => {
      // Check if new user wants to learn what existing user can teach
      if (newUser.wantToLearn.toLowerCase().includes(existingUser.canTeach.toLowerCase()) ||
          existingUser.canTeach.toLowerCase().includes(newUser.wantToLearn.toLowerCase())) {
        foundMatches.push({
          id: `${newUser.id}-${existingUser.id}-${Date.now()}`,
          teacher: existingUser,
          learner: newUser,
          skill: existingUser.canTeach,
          timestamp: Date.now()
        });
      }
      
      // Check if existing user wants to learn what new user can teach
      if (existingUser.wantToLearn.toLowerCase().includes(newUser.canTeach.toLowerCase()) ||
          newUser.canTeach.toLowerCase().includes(existingUser.wantToLearn.toLowerCase())) {
        foundMatches.push({
          id: `${existingUser.id}-${newUser.id}-${Date.now()}`,
          teacher: newUser,
          learner: existingUser,
          skill: newUser.canTeach,
          timestamp: Date.now()
        });
      }
    });
    
    return foundMatches;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country || !formData.canTeach || !formData.wantToLearn) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        country: formData.country,
        canTeach: formData.canTeach,
        wantToLearn: formData.wantToLearn,
        timestamp: Date.now()
      };

      // Find matches before adding the new user
      const foundMatches = findMatches(newUser, users);
      
      // Update users
      setUsers(prev => [newUser, ...prev]);
      
      // Update matches
      if (foundMatches.length > 0) {
        setMatches(prev => [...foundMatches, ...prev]);
        setNewMatches(foundMatches);
        
        // Clear new matches highlight after 3 seconds
        setTimeout(() => {
          setNewMatches([]);
        }, 3000);
      }
      
      setFormData({
        name: '',
        country: '',
        canTeach: '',
        wantToLearn: ''
      });
      setIsSubmitting(false);
    }, 500);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.canTeach.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.wantToLearn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRandomMatch = () => {
    if (matches.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * matches.length);
    setRandomMatch(matches[randomIndex]);
    setShowRandomMatch(true);
  };

  const closeRandomMatch = () => {
    setShowRandomMatch(false);
    setRandomMatch(null);
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 
    'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Argentina', 'Mexico',
    'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Other'
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-teal-50 via-white to-orange-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b sticky top-0 z-20 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-teal-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                  SkillSwap
                </h1>
                <p className={`text-sm mt-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Connect, Learn, Teach, Grow Together
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative hidden sm:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search skills or names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Random Match Button */}
              {matches.length > 0 && (
                <button
                  onClick={handleRandomMatch}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  } shadow-lg`}
                >
                  <Shuffle className="h-4 w-4" />
                  <span className="hidden sm:inline">Random Match</span>
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search skills or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Section */}
        <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 mb-12 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="text-center mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Join Our Learning Community
            </h2>
            <p className={`max-w-2xl mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Share your skills and discover new ones! Connect with learners and teachers from around the world.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Name Input */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Country Select */}
              <div className="sm:col-span-2">
                <label htmlFor="country" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Globe className="inline h-4 w-4 mr-1" />
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
                  }`}
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* I Can Teach */}
              <div>
                <label htmlFor="canTeach" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <GraduationCap className="inline h-4 w-4 mr-1" />
                  I Can Teach
                </label>
                <input
                  type="text"
                  id="canTeach"
                  name="canTeach"
                  value={formData.canTeach}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                  placeholder="e.g., Spanish, Guitar, Cooking"
                  required
                />
              </div>

              {/* I Want to Learn */}
              <div>
                <label htmlFor="wantToLearn" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  I Want to Learn
                </label>
                <input
                  type="text"
                  id="wantToLearn"
                  name="wantToLearn"
                  value={formData.wantToLearn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                  placeholder="e.g., Photography, Python, Dancing"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Finding Matches...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Join SkillSwap Community</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Matches Section */}
        {matches.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl shadow-lg animate-pulse">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Matches Found!
                </h3>
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl shadow-lg animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className={`max-w-2xl mx-auto transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Amazing! We found skill matches in our community. Connect with these learners and teachers!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matches.map((match) => {
                const isNewMatch = newMatches.some(newMatch => newMatch.id === match.id);
                return (
                  <div
                    key={match.id}
                    className={`relative rounded-2xl shadow-xl border-2 p-6 transition-all duration-500 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-pink-900/30 to-rose-900/30'
                        : 'bg-gradient-to-r from-pink-50 to-rose-50'
                    } ${
                      isNewMatch 
                        ? 'border-pink-300 shadow-pink-200 shadow-2xl animate-pulse' 
                        : `${isDarkMode ? 'border-pink-700 hover:shadow-2xl hover:shadow-pink-900/20' : 'border-pink-200 hover:shadow-2xl hover:shadow-pink-100'}`
                    }`}
                  >
                    {/* Glowing effect for new matches */}
                    {isNewMatch && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-2xl animate-pulse"></div>
                    )}
                    
                    <div className="relative z-10">
                      {/* Match Header */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full">
                          <span className="text-white font-semibold text-sm flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            Perfect Match!
                          </span>
                        </div>
                      </div>

                      {/* Users Side by Side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {/* Teacher */}
                        <div className={`rounded-xl p-4 border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border-pink-700' 
                            : 'bg-white border-pink-100'
                        }`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 p-2 rounded-full">
                              <GraduationCap className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className={`font-bold transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>{match.teacher.name}</h4>
                              <p className={`text-sm flex items-center transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <Globe className="h-3 w-3 mr-1" />
                                {match.teacher.country}
                              </p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 rounded-lg border border-emerald-200">
                            <p className="text-emerald-800 font-medium text-sm">Can teach:</p>
                            <p className="text-emerald-700 font-semibold">{match.teacher.canTeach}</p>
                          </div>
                        </div>

                        {/* Learner */}
                        <div className={`rounded-xl p-4 border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border-pink-700' 
                            : 'bg-white border-pink-100'
                        }`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-2 rounded-full">
                              <BookOpen className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <h4 className={`font-bold transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>{match.learner.name}</h4>
                              <p className={`text-sm flex items-center transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                <Globe className="h-3 w-3 mr-1" />
                                {match.learner.country}
                              </p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                            <p className="text-orange-800 font-medium text-sm">Wants to learn:</p>
                            <p className="text-orange-700 font-semibold">{match.learner.wantToLearn}</p>
                          </div>
                        </div>
                      </div>

                      {/* Match Connection */}
                      <div className="flex items-center justify-center">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 rounded-full shadow-lg">
                          <div className="flex items-center space-x-2 text-white">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-semibold text-sm">Skill Match: {match.skill}</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className={`mt-4 pt-4 border-t transition-colors duration-300 ${
                        isDarkMode ? 'border-pink-700' : 'border-pink-200'
                      }`}>
                        <p className={`text-xs text-center transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Match found {new Date(match.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users Section */}
        {users.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold mb-4 sm:mb-0 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Community Members ({filteredUsers.length})
              </h3>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/20' 
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-teal-100 to-teal-200 p-3 rounded-full">
                        <Users className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>{user.name}</h4>
                        <p className={`text-sm flex items-center transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Globe className="h-3 w-3 mr-1" />
                          {user.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center mb-2">
                        <GraduationCap className="h-4 w-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-semibold text-emerald-800">Can Teach</span>
                      </div>
                      <p className="text-emerald-700 font-medium">{user.canTeach}</p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center mb-2">
                        <BookOpen className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-semibold text-orange-800">Wants to Learn</span>
                      </div>
                      <p className="text-orange-700 font-medium">{user.wantToLearn}</p>
                    </div>
                  </div>

                  <div className={`mt-4 pt-4 border-t transition-colors duration-300 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Joined {new Date(user.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <Search className={`h-16 w-16 mx-auto mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>No matches found</h3>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-16">
            <div className={`p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-teal-800 to-orange-800' 
                : 'bg-gradient-to-r from-teal-100 to-orange-100'
            }`}>
              <Users className={`h-16 w-16 transition-colors duration-300 ${
                isDarkMode ? 'text-teal-400' : 'text-teal-600'
              }`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Be the First to Join!</h3>
            <p className={`max-w-md mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Start building our learning community by sharing your skills above. 
              Connect with others and begin your learning journey today.
            </p>
          </div>
        )}
      </main>

      {/* Random Match Popup */}
      {showRandomMatch && randomMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`max-w-2xl w-full rounded-2xl shadow-2xl border-2 p-6 sm:p-8 relative animate-in fade-in zoom-in duration-300 ${
            isDarkMode
              ? 'bg-gray-800 border-purple-500'
              : 'bg-white border-purple-300'
          }`}>
            {/* Close Button */}
            <button
              onClick={closeRandomMatch}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Popup Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl shadow-lg animate-bounce">
                  <Shuffle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Random Match!
                </h3>
              </div>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Here's a randomly selected skill match from our community!
              </p>
            </div>

            {/* Match Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Teacher */}
              <div className={`rounded-xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-xl transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{randomMatch.teacher.name}</h4>
                    <p className={`flex items-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Globe className="h-4 w-4 mr-1" />
                      {randomMatch.teacher.country}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 p-4 rounded-lg">
                  <p className="text-emerald-800 font-medium mb-1">Can teach:</p>
                  <p className="text-emerald-700 font-bold text-lg">{randomMatch.teacher.canTeach}</p>
                </div>
              </div>

              {/* Learner */}
              <div className={`rounded-xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-xl transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{randomMatch.learner.name}</h4>
                    <p className={`flex items-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Globe className="h-4 w-4 mr-1" />
                      {randomMatch.learner.country}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium mb-1">Wants to learn:</p>
                  <p className="text-orange-700 font-bold text-lg">{randomMatch.learner.wantToLearn}</p>
                </div>
              </div>
            </div>

            {/* Match Connection */}
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full shadow-lg">
                <div className="flex items-center space-x-3 text-white">
                  <Heart className="h-5 w-5 animate-pulse" />
                  <span className="font-bold">Perfect Match: {randomMatch.skill}</span>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className={`text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Built with ❤️ for the learning community • SkillSwap 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;