import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useOrgStore } from "@/store/orgStore";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const fetchOrgs = useOrgStore((state) => state.fetchOrgs);
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AuthService.login({
                email: data.email,
                password: data.password,
            });

            const { access_token, refresh_token, user } = response;
            setAuth(user, access_token, refresh_token);

            // Check if user has any organizations
            const orgs = await fetchOrgs();
            if (orgs && orgs.length > 0) {
                navigate("/dashboard");
            } else {
                navigate("/onboarding");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
            {/* Left side - Branding / Abstract Canvas */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-primary to-blue-900 text-white p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-md text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/20">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                        Project Hub
                    </h1>
                    <p className="text-xl text-primary-foreground/80 leading-relaxed font-light">
                        The ultimate workspace to manage your projects, collaborate with your team, and ship faster.
                    </p>
                </div>
            </div>

            {/* Right side - Form container */}
            <div className="flex items-center justify-center p-6 sm:p-12 relative">
                {/* Subtle background glow for the form side */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/50 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h2>
                        <p className="text-slate-500">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/5 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-start animate-in slide-in-from-top-2">
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-white shadow-sm placeholder:text-slate-400"
                                placeholder="name@company.com"
                            />
                            {errors.email && (
                                <p className="text-destructive text-xs font-medium ml-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-white shadow-sm placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-destructive text-xs font-medium ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-primary text-white py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-70 mt-4 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-semibold text-slate-900 hover:text-primary transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
