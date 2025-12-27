import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email);
            if (success) {
                toast.success("Welcome back!");
                navigate("/");
            } else {
                toast.error("Invalid email or user not found");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_#000] rounded-none">
                <CardHeader className="space-y-2 text-center pb-8 border-b-4 border-black">
                    <CardTitle className="text-3xl font-bold tracking-tighter uppercase font-mono">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono uppercase text-xs">
                        Enter your credentials to access the terminal
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-mono uppercase font-bold text-xs">Email</Label>
                            <Input
                                id="email"
                                placeholder="user@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-2 border-black rounded-none h-12 font-mono shadow-[4px_4px_0px_0px_#000] focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-mono uppercase font-bold text-xs">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-2 border-black rounded-none h-12 font-mono shadow-[4px_4px_0px_0px_#000] focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none transition-all"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base rounded-none border-2 border-black bg-primary text-primary-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_#000] transition-all font-mono font-bold uppercase tracking-wide"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>Login <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm font-mono">
                        Don't have an account?{" "}
                        <Link to="/signup" className="underline underline-offset-4 hover:text-primary font-bold decoration-2">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
