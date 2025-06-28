# Fonctionnalités d'Email - Codes de Coupon

## Vue d'ensemble

Le système d'email a été amélioré pour inclure les codes de coupon avec leurs statuts de validation dans tous les emails envoyés aux utilisateurs.

## Types d'Emails

### 1. Email de Confirmation de Réception
**Fonction:** `sendCouponReceivedEmail`
**Déclencheur:** Lorsqu'un coupon est reçu et enregistré
**Route:** `POST /api/coupons/:id/send-received-email`

**Contenu inclus:**
- Détails du coupon (type, montant, devise)
- Numéro de référence
- **Codes du coupon avec leurs statuts de validation**
- Instructions pour les prochaines étapes

### 2. Email de Notification de Statut
**Fonction:** `sendStatusNotificationEmail`
**Déclencheur:** Lorsqu'un coupon est validé ou invalidé
**Routes:** 
- `PUT /api/coupons/validate/:id` (statut: verified)
- `PUT /api/coupons/invalidate/:id` (statut: invalid)

**Contenu inclus:**
- Nouveau statut du coupon
- **Codes du coupon avec leurs statuts de validation**
- Message explicatif selon le statut

## Structure des Codes

Chaque coupon peut avoir jusqu'à 4 codes :
- `code1` (obligatoire)
- `code2` (optionnel)
- `code3` (optionnel)
- `code4` (optionnel)

Chaque code a un statut de validation correspondant :
- `code1Valid` (boolean)
- `code2Valid` (boolean)
- `code3Valid` (boolean)
- `code4Valid` (boolean)

## Affichage dans les Emails

### Format des Codes
```
Code 1: ABC123DEF456     ✅ Valide
Code 2: XYZ789GHI012     ❌ Invalide
Code 3: MNO345PQR678     ✅ Valide
Code 4: (non fourni)     ❌ Invalide
```

### Couleurs
- **Vert (#28a745):** Code valide ✅
- **Rouge (#dc3545):** Code invalide ❌

## Configuration

### Variables d'Environnement
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Test des Emails
Exécutez le script de test pour vérifier le fonctionnement :
```bash
node test-email.js
```

## API Endpoints

### Envoyer un email de réception
```http
POST /api/coupons/:id/send-received-email
```

### Valider un coupon (envoie un email)
```http
PUT /api/coupons/validate/:id
```

### Invalider un coupon (envoie un email)
```http
PUT /api/coupons/invalidate/:id
```

## Exemple de Données de Coupon

```javascript
const couponData = {
  email: 'user@example.com',
  type: 'NEOSURF',
  montant: 50.00,
  devise: 'EURO',
  code1: 'ABC123DEF456',
  code1Valid: true,
  code2: 'XYZ789GHI012',
  code2Valid: false,
  code3: 'MNO345PQR678',
  code3Valid: true,
  code4: null,
  code4Valid: false,
  status: 'pending',
  createdAt: new Date()
};
```

## Gestion des Erreurs

- Si l'email n'est pas configuré, les fonctions retournent un message d'erreur mais n'interrompent pas le processus
- Les erreurs d'envoi d'email sont loggées mais n'affectent pas la réponse API
- Les emails sont envoyés de manière asynchrone pour ne pas ralentir les réponses API

## Sécurité

- Les codes sont affichés dans un format monospace pour une meilleure lisibilité
- Les emails utilisent un design responsive et professionnel
- Les données sensibles ne sont pas exposées dans les logs 