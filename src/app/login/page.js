"use client"
import { useState } from "react";
import { signin } from "../../lib/actions"
import { useRouter } from 'next/navigation'
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";


export default function login() {
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const router = useRouter();

    const handleLogin = async (data) => {
        setLoading(true);
        toast.closeAll();
        toast({
            description: "loging in",
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: "top-right",
        })
        try {
            const result = await signin(data);
            if (result && typeof result === 'object' && result.error) {
                toast.closeAll()
                toast({
                    title: 'Login Failed',
                    description: result.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                })
            } else if (result?.status) {
                toast.closeAll()
                toast({
                    description: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                })
                router.push('/dashboard/company')
            }
        } catch (error) {
            console.error('Unexpected error during login:', error);
            toast.closeAll()
            toast({
                title: 'Unexpected Error',
                description: 'Please try again later.',
                status: 'error',
                duration: 5000,
                position: "top-right",
                isClosable: true,
            })
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            /> */}
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action={handleLogin} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                         <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? <Spinner/> : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
