import { useEffect } from 'react';

export default function UnbakedThoughtsRedirect() {
  useEffect(() => {
    // Redirect to the correct URL
    const directUrl = '/unbaked-thoughts';
    console.log('Redirecting to:', directUrl);
    window.location.href = directUrl;
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1>Redirecting to Unbaked Thoughts...</h1>
      <p>Please wait a moment...</p>
    </div>
  );
} 