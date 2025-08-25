import React, { useState, useEffect, createContext, useContext, useRef, Suspense } from 'react';
import { ChevronRight, Brain, BarChart3, User, LogOut, Plus, BookOpen, Clock, Trophy, Play, Pause, Zap, Target, TrendingUp } from 'lucide-react';
import * as THREE from 'three';
import * as d3 from 'd3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for demonstration
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  subscriptionTier: 'Pro'
};

const mockStats = {
  total_sessions: 24,
  total_time_spent: 3600,
  topics_completed: 12,
  recent_sessions: 5,
  streak: 7,
  accuracy: 85
};

const mockProgressData = [
  { name: 'Mon', sessions: 4, hours: 3.2, accuracy: 78 },
  { name: 'Tue', sessions: 6, hours: 4.1, accuracy: 82 },
  { name: 'Wed', sessions: 8, hours: 5.5, accuracy: 85 },
  { name: 'Thu', sessions: 6, hours: 4.8, accuracy: 88 },
  { name: 'Fri', sessions: 7, hours: 5.2, accuracy: 91 },
  { name: 'Sat', sessions: 5, hours: 3.8, accuracy: 89 },
  { name: 'Sun', sessions: 3, hours: 2.5, accuracy: 86 }
];

const mockTopicData = [
  { name: 'Programming', value: 35, color: '#8b5cf6' },
  { name: 'Science', value: 28, color: '#06b6d4' },
  { name: 'Math', value: 20, color: '#10b981' },
  { name: 'History', value: 17, color: '#f59e0b' }
];

const mockSessions = [
  {
    id: 1,
    prompt_text: 'Explain how machine learning works with examples and visualizations',
    visualization_type: 'flowchart',
    created_at: new Date().toISOString(),
    duration: 45,
    completed: true,
    score: 92
  },
  {
    id: 2,
    prompt_text: 'Show me the process of photosynthesis step by step',
    visualization_type: 'interactive',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    duration: 32,
    completed: true,
    score: 88
  },
  {
    id: 3,
    prompt_text: 'JavaScript fundamentals with interactive examples',
    visualization_type: '3d',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    duration: 28,
    completed: false,
    score: null
  }
];

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@example.com' && password === 'demo123') {
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials. Use demo@example.com / demo123' };
    }
  };

  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...mockUser,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      subscriptionTier: 'Free'
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Animated Card Component with Framer Motion-like animations
const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 3D Brain Visualization Component
const Brain3D = ({ isAnimating = true, size = 120 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const brainRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create brain-like geometry with more detail
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4f46e5, 
      shininess: 100,
      transparent: true,
      opacity: 0.8,
      wireframe: false
    });
    
    const brain = new THREE.Mesh(geometry, material);
    scene.add(brain);

    // Add wireframe overlay
    const wireframeGeometry = geometry.clone();
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x8b5cf6, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Add particles for neural effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ 
      color: 0x8b5cf6, 
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 3;

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    brainRef.current = { brain, wireframe, particles };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (isAnimating && brainRef.current) {
        brainRef.current.brain.rotation.x += 0.005;
        brainRef.current.brain.rotation.y += 0.01;
        brainRef.current.wireframe.rotation.x += 0.005;
        brainRef.current.wireframe.rotation.y += 0.01;
        brainRef.current.particles.rotation.x -= 0.002;
        brainRef.current.particles.rotation.y -= 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAnimating, size]);

  return <div ref={mountRef} className="flex items-center justify-center" />;
};

// D3 Network Visualization Component
const NetworkVisualization = ({ data, width = 300, height = 200 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = data.steps.map((step, i) => ({
      id: i,
      name: step.title,
      group: Math.floor(i / 2)
    }));

    const links = nodes.slice(0, -1).map((_, i) => ({
      source: i,
      target: i + 1
    }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.7);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 8)
      .attr("fill", d => d3.schemeCategory10[d.group])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => d.name.substring(0, 10) + "...")
      .attr("font-size", "10px")
      .attr("font-family", "system-ui")
      .attr("fill", "#374151")
      .attr("text-anchor", "middle")
      .attr("dy", 25);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      className="border border-gray-200 rounded-lg bg-gray-50"
    />
  );
};

// Login Component with enhanced animations
const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <AnimatedCard className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Brain3D size={80} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Demo credentials:</strong><br />
            Email: demo@example.com<br />
            Password: demo123
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Register Component with enhanced design
const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <AnimatedCard className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Brain3D size={80} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join LearnFlow</h2>
          <p className="text-gray-600">Create your account to start learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Enhanced Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('learn');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(mockStats);
      setSessions(mockSessions);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="mr-3">
                <Brain3D size={40} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LearnFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.charAt(0)}
                </div>
                <span className="text-gray-700 font-medium">Hello, {user?.firstName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white/60 backdrop-blur-md rounded-xl p-1 border border-gray-200/50">
            {[
              { id: 'learn', label: 'Learn', icon: Brain },
              { id: 'progress', label: 'Progress', icon: BarChart3 },
              { id: 'sessions', label: 'Sessions', icon: BookOpen },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="transition-all duration-300">
          {activeTab === 'learn' && <LearnTab />}
          {activeTab === 'progress' && <ProgressTab stats={stats} />}
          {activeTab === 'sessions' && <SessionsTab sessions={sessions} />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

// Enhanced Learn Tab Component
const LearnTab = () => {
  const [prompt, setPrompt] = useState('');
  const [visualizationType, setVisualizationType] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockContent = {
      visualization_type: visualizationType === 'auto' ? 'flowchart' : visualizationType,
      content: {
        title: `Learning: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`,
        description: `This is a comprehensive explanation of your topic: ${prompt}`,
        steps: [
          {
            id: 1,
            title: 'Introduction & Overview',
            description: 'We start by understanding the basic concepts, terminology, and why this topic matters.'
          },
          {
            id: 2,
            title: 'Core Concepts',
            description: 'Dive deeper into the fundamental principles and how they work together.'
          },
          {
            id: 3,
            title: 'Practical Examples',
            description: 'See real-world applications and examples to solidify understanding.'
          },
          {
            id: 4,
            title: 'Advanced Topics',
            description: 'Explore more complex aspects, edge cases, and advanced techniques.'
          },
          {
            id: 5,
            title: 'Practice & Assessment',
            description: 'Test your knowledge and apply what you\'ve learned.'
          }
        ],
        interactive_elements: [
          { type: 'Quiz', description: 'Test your understanding with interactive questions' },
          { type: 'Simulation', description: 'Practice with hands-on simulations' },
          { type: 'Code Lab', description: 'Write code to implement the concepts' },
          { type: '3D Model', description: 'Explore interactive 3D visualizations' }
        ]
      }
    };
    
    setGeneratedContent(mockContent);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <AnimatedCard delay={0}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            What would you like to learn today?
          </h3>
          
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your learning prompt... e.g., 'Explain how machine learning works with examples' or 'Show me the process of photosynthesis'"
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/70 backdrop-blur-sm transition-all duration-200"
            />
            
            <div className="flex items-center space-x-4">
              <select
                value={visualizationType}
                onChange={(e) => setVisualizationType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
              >
                <option value="auto">🤖 Auto-detect best type</option>
                <option value="flowchart">📊 Flowchart</option>
                <option value="timeline">⏳ Timeline</option>
                <option value="interactive">🎮 Interactive Diagram</option>
                <option value="3d">🌟 3D Visualization</option>
              </select>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Learning
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={1}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-6 w-6 text-indigo-500 mr-2" />
            Quick Start Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'JavaScript Fundamentals', description: 'Learn JS with interactive examples', category: 'Programming', icon: '💻', color: 'from-blue-500 to-cyan-500' },
              { title: 'Data Structures', description: 'Visualize arrays, trees, graphs', category: 'Computer Science', icon: '🌳', color: 'from-green-500 to-emerald-500' },
              { title: 'Photosynthesis Process', description: 'Step-by-step biological process', category: 'Biology', icon: '🌱', color: 'from-green-500 to-lime-500' },
              { title: 'World War II Timeline', description: 'Interactive historical timeline', category: 'History', icon: '⚔️', color: 'from-orange-500 to-red-500' },
              { title: 'Machine Learning Basics', description: 'AI concepts made simple', category: 'Technology', icon: '🧠', color: 'from-purple-500 to-pink-500' },
              { title: 'Financial Markets', description: 'How markets work visually', category: 'Finance', icon: '📈', color: 'from-yellow-500 to-orange-500' }
            ].map((topic, index) => (
              <button
                key={index}
                onClick={() => setPrompt(`Explain ${topic.title} with examples and visualizations`)}
                className="group text-left p-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${topic.color} flex items-center justify-center text-white text-lg mr-3 group-hover:scale-110 transition-transform duration-300`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">{topic.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                <span className="inline-block px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-xs text-gray-700 rounded-full">
                  {topic.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </AnimatedCard>

      {generatedContent && (
        <AnimatedCard delay={2}>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-6 w-6 text-purple-500 mr-2" />
              Generated Learning Content
            </h3>
            <VisualizationRenderer content={generatedContent} />
          </div>
        </AnimatedCard>
      )}
    </div>
  );
};

// Enhanced Visualization Renderer Component
const VisualizationRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200/50">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
          {content.content.title}
        </h4>
        <p className="text-gray-700">{content.content.description}</p>
      </div>

      {content.visualization_type === 'flowchart' && content.content.steps && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-900 text-lg">Learning Journey:</h5>
            <div className="text-sm text-gray-500">
              {content.content.steps.length} steps
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {content.content.steps.map((step, index) => (
              <div 
                key={step.id} 
                className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h6 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                      {step.title}
                    </h6>
                    <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < content.content.steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 hidden lg:block">
                    <ChevronRight className="h-4 w-4 text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <NetworkVisualization data={content.content} width={400} height={250} />
          </div>
        </div>
      )}

      {content.content.interactive_elements && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <Play className="h-5 w-5 text-yellow-600 mr-2" />
            Interactive Elements:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.content.interactive_elements.map((element, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-yellow-200/50 hover:border-yellow-300 transition-all duration-200 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-xs font-bold mr-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="inline-block bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 px-2 py-1 rounded text-xs font-medium mb-1">
                    {element.type}
                  </span>
                  <p className="text-gray-700 text-sm">{element.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Progress Tab Component
const ProgressTab = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Sessions', 
            value: stats?.total_sessions || 0, 
            icon: BookOpen, 
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50'
          },
          { 
            label: 'Time Spent', 
            value: `${Math.floor((stats?.total_time_spent || 0) / 60)}h`, 
            icon: Clock, 
            color: 'from-green-500 to-emerald-500',
            bgColor: 'from-green-50 to-emerald-50'
          },
          { 
            label: 'Topics Completed', 
            value: stats?.topics_completed || 0, 
            icon: Trophy, 
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'from-yellow-50 to-orange-50'
          },
          { 
            label: 'Current Streak', 
            value: `${stats?.streak || 0} days`, 
            icon: TrendingUp, 
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50'
          }
        ].map((stat, index) => (
          <AnimatedCard key={index} delay={index}>
            <div className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard delay={4}>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-6 w-6 text-indigo-500 mr-2" />
              Weekly Progress
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={5}>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 text-purple-500 mr-2" />
              Topics Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockTopicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockTopicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

// Enhanced Sessions Tab Component
const SessionsTab = ({ sessions }) => {
  return (
    <div className="space-y-6">
      <AnimatedCard delay={0}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-6 w-6 text-indigo-500 mr-2" />
            Recent Learning Sessions
          </h3>
          
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Brain3D size={80} isAnimating={false} />
              </div>
              <p className="text-gray-500 text-lg">No learning sessions yet.</p>
              <p className="text-gray-400">Start learning to see your history here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div 
                  key={index} 
                  className="group bg-gradient-to-r from-white/60 to-gray-50/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 flex-1 mr-4">
                          {session.prompt_text?.substring(0, 80)}...
                        </h4>
                        {session.score && (
                          <div className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs rounded-full font-medium">
                            Score: {session.score}%
                          </div>
                        )}
                      </div>
                      <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                        <span className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-xs font-medium">
                          📊 {session.visualization_type}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.duration}min
                        </span>
                        <span className="flex items-center">
                          📅 {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          session.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.completed ? '✅ Completed' : '⏳ In Progress'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
};

// Enhanced Profile Tab Component
const ProfileTab = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <AnimatedCard delay={0}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-6 w-6 text-indigo-500 mr-2" />
            Profile Information
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={user?.firstName || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={user?.lastName || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-900"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-900"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/80 backdrop-blur-sm text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
              <div className="flex items-center space-x-2">
                <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-medium shadow-sm">
                  🌟 {user?.subscriptionTier || 'Free'} Plan
                </span>
                {user?.subscriptionTier === 'Pro' && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium">
                    ✨ Premium Features
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200/50">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Account Stats
              </h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Member since:</span>
                  <p className="font-medium text-gray-900">January 2024</p>
                </div>
                <div>
                  <span className="text-gray-600">Total achievements:</span>
                  <p className="font-medium text-gray-900">12 badges earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

// Main App Component
const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AuthWrapper 
        showRegister={showRegister} 
        setShowRegister={setShowRegister} 
      />
    </AuthProvider>
  );
};

const AuthWrapper = ({ showRegister, setShowRegister }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Brain3D size={120} />
          </div>
          <div className="animate-pulse">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-48 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Initializing LearnFlow...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
};

export default App;