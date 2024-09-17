'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { signout } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Spinner, useToast } from '@chakra-ui/react'

const navigation = [

    { name: 'Employee', href: '/dashboard/employee' },
    { name: 'Company', href: '/dashboard/company' },
]

export default function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signout();
            if (result && typeof result === 'object' && result.error) {
                toast.closeAll();
                toast({
                    title: 'Failed',
                    description: result.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                })
            } else if (result?.status) {
                toast.closeAll();
                toast({
                    description: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                })
                router.push('/login')
            }
        } catch (error) {
            console.error('Unexpected error during login:', error);
            toast.closeAll();
            toast({
                title: 'Unexpected Error',
                description: 'Please try again.',
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
        <header className="bg-gray-300">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link href="/dashboard" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleLogout}>
                        {loading ? <Spinner /> : (
                            <>
                                Log out <span aria-hidden="true">&rarr;</span>
                            </>
                        )}
                    </button>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link href="/login" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6">
                                <button
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    {loading ? <Spinner /> : "Log out"}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
