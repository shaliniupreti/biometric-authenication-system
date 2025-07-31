document.addEventListener('DOMContentLoaded', function() {
    // Biometric authentication state
    const authState = {
        fingerprint: false,
        face: false,
        voice: false,
        completed: false
    };
    
    // Fingerprint authentication
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const fingerprintRing = document.querySelector('.progress-ring-circle');
    fingerprintBtn.addEventListener('click', function() {
        if (authState.fingerprint) return;
        
        fingerprintBtn.disabled = true;
        fingerprintBtn.textContent = 'Scanning...';
        
        // Simulate fingerprint scan with progress animation
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            const offset = 126 - (126 * progress) / 100;
            fingerprintRing.style.strokeDashoffset = offset;
            
            if (progress >= 100) {
                clearInterval(interval);
                authState.fingerprint = true;
                fingerprintBtn.textContent = 'Verified ✓';
                fingerprintBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                fingerprintBtn.classList.add('bg-green-100', 'text-green-700');
                document.querySelector('.fingerprint-svg').style.stroke = '#10b981';
                
                updateAuthStatus();
            }
        }, 50);
    });
    
    // Facial recognition
    const faceBtn = document.getElementById('face-btn');
    const faceVideo = document.getElementById('face-video');
    const faceCanvas = document.getElementById('face-canvas');
    const facePlaceholder = document.getElementById('face-placeholder');
    let faceStream = null;
    
    faceBtn.addEventListener('click', function() {
        if (authState.face) return;
        
        if (faceBtn.textContent === 'Start Face Scan') {
            faceBtn.textContent = 'Scanning...';
            facePlaceholder.style.display = 'none';
            
            // Access camera
            navigator.mediaDevices.getUser Media({ video: true })
                .then(function(stream) {
                    faceStream = stream;
                    faceVideo.srcObject = stream;
                    faceBtn.textContent = 'Processing...';
                    
                    // Simulate face detection
                    setTimeout(() => {
                        faceBtn.textContent = 'Verified ✓';
                        faceBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                        faceBtn.classList.add('bg-green-100', 'text-green-700');
                        
                        // Draw face mesh (simulated)
                        const ctx = faceCanvas.getContext('2d');
                        ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
                        ctx.strokeStyle = '#8b5cf6';
                        ctx.lineWidth = 2;
                        
                        // Draw oval for face
                        ctx.beginPath();
                        ctx.ellipse(240, 240, 180, 220, 0, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Draw eyes
                        // Left eye
                        ctx.beginPath();
                        ctx.ellipse(180, 200, 30, 20, 0, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Right eye
                        ctx.beginPath();
                        ctx.ellipse(300, 200, 30, 20, 0, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        authState.face = true;
                        updateAuthStatus();
                    }, 2000);
                })
                .catch(function(err) {
                    console.error("Error accessing camera:", err);
                    faceBtn.textContent = 'Error';
                    facePlaceholder.style.display = 'block';
                });
        } else if (faceBtn.textContent === 'Verified ✓') {
            return;
        } else {
            // Stop scanning
            if (faceStream) {
                faceStream.getTracks().forEach(track => track.stop());
            }
            faceVideo.srcObject = null;
            faceBtn.textContent = 'Start Face Scan';
            facePlaceholder.style.display = 'block';
            
            const ctx = faceCanvas.getContext('2d');
            ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        }
    });
    
    // Voice authentication
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    voiceBtn.addEventListener('click', function() {
        if (authState.voice) return;
        
        if (voiceBtn.textContent === 'Start Voice Scan') {
            voiceBtn.textContent = 'Listening...';
            voiceStatus.textContent = "Say: 'My voice is my password'";
            
            // Simulate voice recognition
            setTimeout(() => {
                voiceStatus.textContent = "Voice pattern recognized";
                voiceBtn.textContent = 'Verified ✓';
                voiceBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                voiceBtn.classList.add('bg-green-100', 'text-green-700');
                
                authState.voice = true;
                updateAuthStatus();
            }, 3000);
        } else if (voiceBtn.textContent === 'Verified ✓') {
            return;
        } else {
            voiceBtn.textContent = 'Start Voice Scan';
            voiceStatus.textContent = "Press button and say 'My voice is my password'";
        }
    });
    
    // Update authentication status
    function updateAuthStatus() {
        const authStatus = document.getElementById('auth-status');
        const authSteps = document.getElementById('auth-steps');
        const verifyBtn = document.getElementById('verify-btn');
        
        // Update fingerprint status
        const fingerprintStep = authSteps.children[0];
        if (authState.fingerprint) {
            fingerprintStep.children[0].className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
            fingerprintStep.children[1].textContent = 'Fingerprint: Verified';
        }
        
        // Update face status
        const faceStep = authSteps.children[1];
        if (authState.face) {
            faceStep.children[0].className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
            faceStep.children[1].textContent = 'Face: Recognized';
        }
        
        // Update voice status
        const voiceStep = authSteps.children[2];
        if (authState.voice) {
            voiceStep.children[0].className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
            voiceStep.children[1].textContent = 'Voice: Verified';
        }
        
        // Update overall status
        if (authState.fingerprint && authState.face && authState.voice) {
            authStatus.children[0].className = 'w-4 h-4 rounded-full bg-green-500 animate-pulse mr-2';
            authStatus.children[1].textContent = 'Authentication Complete!';
            authStatus.children[1].className = 'text-green-600 font-medium';
            verifyBtn.disabled = false;
        } else if (authState.fingerprint || authState.face || authState.voice) {
            authStatus.children[0].className = 'w-4 h-4 rounded-full bg-yellow-500 mr-2';
            authStatus.children[1].textContent = 'Partial verification';
            authStatus.children[1].className = 'text-yellow-600';
        } else {
            authStatus.children[0].className = 'w-4 h-4 rounded-full bg-gray-300 mr-2';
            authStatus.children[1].textContent = 'Waiting for verification...';
            authStatus.children[1].className = 'text-gray-600';
        }
    }
    
    // Complete verification
    document.getElementById('verify-btn').addEventListener('click', function() {
        if (!authState.completed && authState.fingerprint && authState.face && authState.voice) {
            authState.completed = true;
            alert('Biometric authentication successful! Access granted.');
            document.getElementById('verify-btn').textContent = 'Verified ✓';
            document.getElementById('verify-btn').classList.remove('bg-gray-800', 'hover:bg-gray-900');
            document.getElementById('verify-btn').classList.add('bg-green-100', 'text-green-700');
            
            // Stop any active streams
            if (faceStream) {
                faceStream.getTracks().forEach(track => track.stop());
            }
        }
    });
    
    // Clean up when page unloads
    window.addEventListener('beforeunload', function() {
        if (faceStream) {
            faceStream.getTracks().forEach(track => track.stop());
        }
    });
});
