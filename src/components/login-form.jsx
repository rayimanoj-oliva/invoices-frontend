import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import axios from "axios";
import api from "@/api/api.js";
import {useUser} from "@/context/user-context.js";
import { motion } from "framer-motion";

export function LoginForm({
  className,
  ...props
}) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {setUsername} = useUser();

  const handleSubmit = async () => {
    try {
      const response = await api.post("/login", {
        username,
        password,
      })

      if (response.data && response.data.centers) {
        localStorage.setItem("centers", JSON.stringify(response.data.centers));
        setUsername("user");
      } else {
        setErrorMessage("Login failed. No centers returned.");
      }
    } catch (error) {
      setErrorMessage("Invalid credentials.");
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat",
        className
      )} 
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.7)
          ),
          url('/clinic-bg.jpg')
        `,
        backgroundColor: '#f0f9fa'
      }}
      {...props}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,164,167,0.1) 0%, rgba(0,164,167,0) 70%)'
          }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,164,167,0.1) 0%, rgba(0,164,167,0) 70%)'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <Card className="w-full shadow-xl bg-white/95 backdrop-blur-sm border border-teal-100/50">
          <CardHeader className="space-y-1 pb-2">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <img 
                src="/oliva-logo.svg" 
                alt="Oliva Skin & Hair Clinic" 
                className="w-[280px] h-auto mb-4"
              />
              <div className="h-[1px] w-3/4 bg-gradient-to-r from-transparent via-teal-200 to-transparent my-4"/>
              <p className="text-[#00A4A7] text-sm font-medium">
                Invoice Management Portal
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Username</Label>
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                  >
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg transition-all duration-200 
                               focus:ring-2 focus:ring-[#00A4A7] focus:border-transparent 
                               hover:border-[#00A4A7]/50 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg transition-all duration-200 
                               focus:ring-2 focus:ring-[#00A4A7] focus:border-transparent 
                               hover:border-[#00A4A7]/50 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>
                {errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-sm text-center"
                  >
                    {errorMessage}
                  </motion.p>
                )}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#00A4A7] hover:bg-[#008487] text-white rounded-lg 
                             font-medium transition-all duration-200
                             hover:shadow-lg hover:shadow-[#00A4A7]/25 border border-[#00A4A7]/10"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
