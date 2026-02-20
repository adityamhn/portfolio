import React from 'react';

export default function Divider() {
    return (
        <div className="flex items-center justify-center my-12" style={{ gap: '10px' }}>
            <div className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
            <div className="w-full h-0.5  rounded-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
        </div>
    );
}
