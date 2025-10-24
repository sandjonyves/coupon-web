# API Documentation pour Application Mobile - Plateform-Test.cm

## Base URL
```
https://plateform-test.cm/api
```

## Endpoints Disponibles

### 1. Récupérer tous les coupons
```http
GET /api/coupons
```
**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "NEOSURF",
      "montant": "10.00",
      "devise": "EURO",
      "code1": "ABC123",
      "code1Valid": true,
      "code2": "DEF456",
      "code2Valid": false,
      "email": "user@example.com",
      "status": "pending",
      "createdAt": "2025-01-27T10:00:00.000Z"
    }
  ]
}
```

### 2. Récupérer les coupons en attente
```http
GET /api/coupons/pending
```

### 3. Récupérer un coupon par ID
```http
GET /api/coupons/:id
```

### 4. Créer un nouveau coupon
```http
POST /api/coupons
Content-Type: application/json

{
  "type": "NEOSURF",
  "montant": "10.00",
  "devise": "EURO",
  "codes": ["ABC123", "DEF456"],
  "email": "user@example.com"
}
```

### 5. Valider un code spécifique
```http
POST /api/coupons/code/validate/:id
Content-Type: application/json

{
  "codeName": "code1"
}
```
**Réponse:**
```json
{
  "success": true,
  "message": "code1 validé avec succès",
  "data": {
    "couponId": 1,
    "codeName": "code1",
    "isValid": true,
    "coupon": { ... }
  }
}
```

### 6. Rejeter un code spécifique
```http
POST /api/coupons/code/invalidate/:id
Content-Type: application/json

{
  "codeName": "code2"
}
```
**Réponse:**
```json
{
  "success": true,
  "message": "code2 marqué comme invalide avec succès",
  "data": {
    "couponId": 1,
    "codeName": "code2",
    "isValid": false,
    "coupon": { ... }
  }
}
```

### 7. Valider tout le coupon (status = "verified")
```http
PUT /api/coupons/validate/:id
```

### 8. Invalider tout le coupon (status = "invalid")
```http
PUT /api/coupons/invalidate/:id
```

### 9. Envoyer un email de confirmation
```http
POST /api/coupons/:id/send-received-email
```

## Codes de Statut des Coupons
- `pending` : En attente de traitement
- `verified` : Coupon validé
- `invalid` : Coupon invalide

## Codes de Validation
- `code1Valid` : true/false
- `code2Valid` : true/false  
- `code3Valid` : true/false
- `code4Valid` : true/false

## Types de Coupons Supportés
- NEOSURF
- PCS
- TRANSCASH
- PAYSAFECARD
- GOOGLE PLAY
- STEAM
- FLEXEPIN
- CASHLIB
- NETFLIX
- AMAZON

## Devises Supportées
- EURO
- Dollar
- Dollard (Franc Suisse)

## Exemple d'Utilisation pour Application Mobile

```javascript
// Valider le code 1 d'un coupon
const validateCode = async (couponId, codeName) => {
  try {
    const response = await fetch(`https://plateform-test.cm/api/coupons/code/validate/${couponId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codeName: codeName })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Code validé:', data.message);
      return data.data;
    } else {
      console.error('Erreur:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return null;
  }
};

// Rejeter le code 2 d'un coupon
const rejectCode = async (couponId, codeName) => {
  try {
    const response = await fetch(`https://plateform-test.cm/api/coupons/code/invalidate/${couponId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codeName: codeName })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Code rejeté:', data.message);
      return data.data;
    } else {
      console.error('Erreur:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return null;
  }
};

// Utilisation
await validateCode(1, 'code1');  // Valider le code 1
await rejectCode(1, 'code2');    // Rejeter le code 2
```

## Codes d'Erreur HTTP
- `200` : Succès
- `400` : Requête invalide (paramètres manquants)
- `404` : Coupon non trouvé
- `500` : Erreur serveur
