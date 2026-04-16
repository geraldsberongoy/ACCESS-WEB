import { RegistrationForm } from "@/features/auth/components/RegistrationForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl">Register </h1>
          <p className="mt-2 text-sm">Welcome to ACCESS-WEB, please register an account</p>
        </div>
        <div className="bg-white-900 border border-gray-800 p-8 rounded-lg">
          <RegistrationForm/>
          <div className="text-sm text-center mt-6">
            <span className="text-white-700">Already have an account? </span>
            <Link href={"/auth/login"} className="font-medium text-white underline">
            Log In
            </Link>
            <div className="text-sm text-center mt-1">
              <Link href={"/"} className="font-medium text-white underline">
              Register as Guest
              </Link>
            </div>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;