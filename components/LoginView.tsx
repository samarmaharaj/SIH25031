
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BuildingOffice2Icon, UserIcon } from './Icons';

interface LoginViewProps {
    role: 'citizen' | 'staff';
    onBack: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.9 0 129.8 110.3 20 244 20c66.5 0 123.6 25.3 166.3 64.9l-67.5 64.9C298.7 112.6 273.6 96 244 96 158.3 96 90.5 162.2 90.5 250.3c0 88.3 67.8 154.5 153.5 154.5 94.2 0 135.3-72.4 140.8-106.9H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);


const LoginView: React.FC<LoginViewProps> = ({ role, onBack }) => {
    const { login } = useAuth();

    const portalDetails = {
        citizen: {
            icon: UserIcon,
            title: 'Citizen Portal',
            subtitle: 'Sign in to report issues and view community feedback.',
        },
        staff: {
            icon: BuildingOffice2Icon,
            title: 'Staff Portal',
            subtitle: 'Access the report management system.',
        }
    };
    
    const { icon: Icon, title, subtitle } = portalDetails[role];

    return (
        <div className="flex flex-col items-center justify-center pt-16">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <Icon className="mx-auto h-12 w-auto text-blue-600" />
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {subtitle}
                    </p>
                </div>
                <div className="pt-4 space-y-4">
                    <button 
                        onClick={() => login(role)}
                        type="button" 
                        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center w-full"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                    <button
                        onClick={onBack}
                        className="w-full text-sm font-semibold text-slate-600 hover:text-blue-600"
                    >
                        &larr; Back to portal selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
