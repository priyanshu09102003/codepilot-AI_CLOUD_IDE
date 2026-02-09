import { ShieldCheckIcon, Code2Icon, LockKeyholeIcon, SparklesIcon, GithubIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const UnauthenticatedView = () => {
    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-4xl space-y-8">
                
                {/* Logo and Hero Section */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="relative w-16 h-16">
                            <Image 
                                src="/logo.svg" 
                                alt="CodePilot Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                            CodePilot
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your secure, AI-powered cloud IDE and code-editor with seamless GitHub integration. Import, code, and push—all in one place.
                    </p>
                </div>

                {/* Main Security Card */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 shadow-lg">
                    <Item variant={"outline"} className="border-0">
                        <ItemMedia variant={"icon"} className="bg-primary/10">
                            <ShieldCheckIcon className="text-primary" />
                        </ItemMedia>

                        <ItemContent className="flex-1">
                            <ItemTitle className="text-2xl mb-2">Secure Access Required</ItemTitle>
                            <ItemDescription className="text-base">
                                CodePilot implements enterprise-level security to protect your code, projects, and development environment. 
                            </ItemDescription>

                            <ItemDescription className="text-base">
                                Sign in to access your secure workspace and continue building amazing projects. 
                            </ItemDescription>
                        </ItemContent>

                        <ItemActions className="gap-3">
                            <SignInButton>
                                <Button variant={"default"} size={"lg"} className="font-semibold">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button variant={"outline"} size={"lg"} className="font-semibold">
                                    Get Started
                                </Button>
                            </SignUpButton>
                        </ItemActions>
                    </Item>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <LockKeyholeIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & Private</h3>
                                <p className="text-sm text-muted-foreground">
                                    End-to-end encryption for your code and data
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-chart-2/10 rounded-lg">
                                <Code2Icon className="w-5 h-5 text-chart-2" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Cloud-Native IDE</h3>
                                <p className="text-sm text-muted-foreground">
                                    Code anywhere, on any device, seamlessly
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-chart-3/10 rounded-lg">
                                <SparklesIcon className="w-5 h-5 text-chart-3" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">AI-Powered</h3>
                                <p className="text-sm text-muted-foreground">
                                    Intelligent code completion and suggestions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-chart-4/10 rounded-lg">
                                <GithubIcon className="w-5 h-5 text-chart-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">GitHub Integration</h3>
                                <p className="text-sm text-muted-foreground">
                                    Import repos and push directly from the IDE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-muted-foreground">
                    Trusted by developers worldwide for secure, collaborative coding
                </p>
            </div>
        </div>
    )
}