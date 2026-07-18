document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PASSWORD TOGGLE =====
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
    
    // ===== AUTO-DISMISS ALERTS =====
    const alerts = document.querySelectorAll('.alert:not(.alert-danger)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
    
    // ===== FILE UPLOAD VALIDATION =====
    const fileInput = document.getElementById('document');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const sizeMB = file.size / (1024 * 1024);
                if (sizeMB > 5) {
                    alert('File size is too big. Maximum 5MB allowed.');
                    this.value = '';
                }
                
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Only JPEG, PNG, and PDF files are allowed.');
                    this.value = '';
                }
            }
        });
    }
    
    // ===== CONFIRM DELETE =====
    const deleteBtns = document.querySelectorAll('.delete-confirm');
    deleteBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this?')) {
                e.preventDefault();
            }
        });
    });
    
    // ===== FORM VALIDATION HELPERS =====
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const required = this.querySelectorAll('[required]');
            let isValid = true;
            
            required.forEach(function(field) {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});

// ===== LIVE PREMIUM PREVIEW (Optional) =====
function previewPremium() {
    const age = document.getElementById('age')?.value || 30;
    const bmi = document.getElementById('bmi')?.value || 22;
    const smoking = document.querySelector('input[name="smoking"]:checked')?.value === 'true';
    
    let risk = 0;
    
    if (age < 25) risk += 10;
    else if (age < 35) risk += 20;
    else if (age < 50) risk += 35;
    else risk += 50;
    
    if (bmi < 18.5) risk += 15;
    else if (bmi < 25) risk += 5;
    else if (bmi < 30) risk += 25;
    else risk += 40;
    
    if (smoking) risk += 30;
    
    const premium = 50 + (risk * 1.5);
    return Math.round(premium * 100) / 100;
}