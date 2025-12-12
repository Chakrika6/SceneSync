// client/src/pages/EditorLogin.jsx

import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // <--- NEW IMPORT
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { editorLogin } from '../api/auth'; // <--- NEW IMPORT: The API helper

export default function EditorLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(''); // State to display login errors
    const [loading, setLoading] = useState(false); // State to disable button
    const navigate = useNavigate(); // <--- NEW HOOK

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError('');
        setLoading(true);

        try {
            // 1. Call the backend API helper
            const response = await editorLogin(email, password);
            
            // 2. Store the JWT Token upon success
            localStorage.setItem('editorToken', response.token); 
            
            // 3. Navigate to the Editor Dashboard
            navigate('/editor/dashboard');

        } catch (err) {
            // Display error from the backend (e.g., "Invalid credentials")
            setError(err.message || "Login failed. Please check server status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <Card>
                <h2 className="text-3xl font-semibold mb-6">Editor Login</h2>

                {/* Display Error Message */}
                {error && <p className="text-red-600 font-bold mb-3">{error}</p>} 
                
                {/* Form Wrapper with handleSubmit */}
                <form onSubmit={handleSubmit}>
                    <Input 
                        placeholder="Email (e.g., citysync.editor@citysync.com)" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input 
                        type="password" 
                        placeholder="Password (e.g., demoeditor)" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-3"
                        required
                    />

                    <Button 
                        className="w-full mt-3" 
                        type="submit" // CRITICAL: Sets button to submit the form
                        disabled={loading} // Disable during request
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Card>
        </PageContainer>
    );
}