// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router";
// import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
// import { useAuth } from "../store/AuthContext";

// export default function LoginPage() {
//   const { login, loading, error: authError } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = (location.state as any)?.from?.pathname;

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [formError, setFormError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setFormError("Please enter your email and password.");
//       return;
//     }
//     setFormError("");
//     try {
//       const user = await login(email, password);
//       if (user.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate(from || "/shop");
//       }
//     } catch (err: any) {
//       setFormError(err.message || err || "Login failed");
//     }
//   };

//   const displayError = formError || authError;

//   return (
//     <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
//         <Link to="/" className="inline-flex items-center gap-2 mb-4">
//           <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
//             S
//           </div>
//           <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
//             Selam Market
//           </span>
//         </Link>
//         <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
//           Sign In to Your Account
//         </h2>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Enter your registered email and password to access your account
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-card py-8 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10">
//           {displayError && (
//             <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium leading-snug">
//               {displayError}
//             </div>
//           )}

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-1.5">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
//                   <Mail size={18} />
//                 </div>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.et"
//                   className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="block text-sm font-medium text-foreground">
//                   Password
//                 </label>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
//                   <Lock size={18} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="block w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//               <ArrowRight size={16} />
//             </button>
//           </form>

//           <div className="mt-6 border-t border-border pt-4 text-center">
//             <p className="text-sm text-muted-foreground">
//               Don't have an account?{" "}
//               <Link to="/register" className="font-semibold text-primary hover:underline">
//                 Create Account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
