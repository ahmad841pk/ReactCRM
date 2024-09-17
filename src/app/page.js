'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // or a loading screen while redirecting
};

export default Home;
