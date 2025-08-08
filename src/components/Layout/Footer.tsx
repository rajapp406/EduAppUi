export default function Footer() {
    return (
        <footer className="bg-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
            </div>
        </footer>
    );
}