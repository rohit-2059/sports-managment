const Alert = ({ type, message }) => {
    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const icon = isSuccess ? '✓' : '✗';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-md`}>
                <p className={`${textColor} font-medium`}>{icon} {message}</p>
            </div>
        </div>
    );
};

export default Alert;
