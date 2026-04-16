import { LogInForm } from "@/features/auth/components/LogInForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl">Sign In </h1>
          <p className="mt-2 text-sm">Welcome to ACCESS-WEB, please sign-in to your account</p>
        </div>
        <div className="bg-white-900 border border-gray-800 p-8 rounded-lg">
          <LogInForm/>
          <div className="text-sm text-center mt-6">
            <span className="text-white-700">{"Dont have an account?"} </span>
            <Link href={"/auth/register"} className="font-medium text-white underline">
            Sign Up
            </Link>
            <div className="text-sm text-center mt-1">
              <Link href={"/"} className="font-medium text-white underline">
              Sign In as Guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;