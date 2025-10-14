import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import { LayoutTemplate } from 'lucide-react'
// import Navbar from './Navbar';

const DashboardLayout = ({ activeMenu, children }) => {
    const { user, loading } = useContext(UserContext);
    
    console.log('DashboardLayout - user:', user, 'loading:', loading);

    // Simple inline navbar component
    const SimpleNavbar = () => (
        <div className='h-16 bg-white/70 backdrop-blur-xl border-b border-violet-100/50 py-2.5 px-4 md:px-0 sticky top-0 z-50'>
            <div className='max-w-6xl mx-auto flex items-center justify-between gap-5'>
                <Link to='/' className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200'>
                        <LayoutTemplate className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent'>
                        ResumeXpert
                    </span>
                </Link>
                {user && (
                    <div className='flex items-center gap-3 p-2 sm:p-3 bg-white backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-md'>
                            <span className='text-base sm:text-lg font-black text-white'>
                                {user.name ? user.name.charAt(0).toUpperCase() : ""}
                            </span>
                        </div>
                        <div>
                            <div className='text-xs sm:text-sm font-bold text-gray-800'>
                                {user.name || ""}
                            </div>
                            <button 
                                className='text-violet-600 text-[10px] sm:text-xs font-bold cursor-pointer hover:text-fuchsia-600 transition-colors'
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Show loading state
    if (loading) {
        return (
            <div>
                <SimpleNavbar />
                <div className='container mx-auto pt-4 pb-4'>
                    <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
                    </div>
                </div>
            </div>
        )
    }

    // If no user, show message but still render content for debugging
    if (!user) {
        return (
            <div>
                <SimpleNavbar />
                <div className='container mx-auto pt-4 pb-4'>
                    <div className='text-center py-12 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Please log in to access the dashboard</h2>
                        <p className='text-gray-600'>You need to be authenticated to view this page.</p>
                        <p className='text-sm text-gray-500 mt-2'>Debug: user = {JSON.stringify(user)}, loading = {loading.toString()}</p>
                    </div>
                    {/* Still render children for debugging */}
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div>
            <SimpleNavbar />
            <div className='container mx-auto pt-4 pb-4'>{children}</div>
        </div>
    )
}

export default DashboardLayout