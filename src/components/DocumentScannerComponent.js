import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CameraComponent from './CameraComponent';

const { width, height } = Dimensions.get('window');

const DocumentScannerComponent = ({ 
  onDocumentScanned, 
  onClose, 
  initialDocument = null 
}) => {
  const [document, setDocument] = useState(initialDocument);
  const [extractedText, setExtractedText] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [location, setLocation] = useState(null);
  const [documentType, setDocumentType] = useState('unknown');

  React.useEffect(() => {
    if (!initialDocument) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      console.log('Erreur de géolocalisation:', error);
    }
  };

  const handleDocumentCaptured = async (photoData) => {
    setDocument(photoData);
    setShowCamera(false);
    setIsProcessing(true);

    // Simulation d'OCR et d'analyse de document
    setTimeout(() => {
      const mockExtractedText = simulateOCR(photoData);
      setExtractedText(mockExtractedText);
      
      // Détection automatique du type de document
      const detectedType = detectDocumentType(mockExtractedText);
      setDocumentType(detectedType);
      
      setIsProcessing(false);
    }, 3000);
  };

  const simulateOCR = (photoData) => {
    // Simulation d'extraction de texte basée sur le type de document
    const mockTexts = {
      invoice: `FACTURE N° INV-2024-001
Date: 15/01/2024
Client: Entreprise ABC
Adresse: 123 Rue de la Paix, 75001 Paris
SIRET: 12345678901234

Détail des prestations:
- Développement application mobile: 800.00 €
- Design UI/UX: 300.00 €
- Tests et déploiement: 150.00 €

Sous-total: 1,250.00 €
TVA (20%): 250.00 €
Total TTC: 1,500.00 €

Conditions de paiement: 30 jours
IBAN: FR76 1234 5678 9012 3456 7890 123`,
      
      receipt: `RECU DE PAIEMENT
Date: 15/01/2024
Heure: 14:30:25
Transaction: #TXN-123456
Terminal: POS-001
Opérateur: Jean Dupont

Articles:
- Café expresso: 2.50 €
- Croissant: 1.20 €
- Pain au chocolat: 1.80 €
- Thé vert: 3.00 €

Sous-total: 8.50 €
TVA: 1.70 €
Total: 10.20 €

Méthode: Carte bancaire
Carte: **** **** **** 1234
Autorisation: APPROVED

Merci de votre achat !`,
      
      contract: `CONTRAT DE SERVICE
Entre: FASTCUBE SARL
Siège social: 456 Avenue des Technologies, 75002 Paris
SIRET: 98765432109876
Représentée par: Marie Martin, Directrice Générale

Et: Client XYZ
Adresse: 789 Boulevard de l'Innovation, 75003 Paris
Représenté par: Pierre Durand, Directeur Technique

Date: 15/01/2024

Article 1 - Objet
Le présent contrat a pour objet la fourniture de services de développement informatique.

Article 2 - Durée
Le contrat est conclu pour une durée de 12 mois à compter de la date de signature.

Article 3 - Prix
Le montant total des prestations s'élève à 25,000.00 € HT.`,
      
      id_card: `CARTE NATIONALE D'IDENTITÉ
République Française

Nom: DUPONT
Prénoms: Jean Pierre
Sexe: M
Date de naissance: 15/03/1985
Lieu de naissance: PARIS (75)
Adresse: 123 RUE DE LA PAIX
75001 PARIS

Numéro: 1234567890123
Date de délivrance: 15/01/2020
Date d'expiration: 15/01/2030

Autorité de délivrance: MAIRIE DE PARIS`,
      
      unknown: `DOCUMENT NUMÉRISÉ
Date de scan: ${new Date().toLocaleDateString()}
Heure: ${new Date().toLocaleTimeString()}

Contenu détecté:
- Texte non structuré
- Images et graphiques
- Informations diverses

Recommandation: Vérification manuelle requise`
    };

    // Détection automatique du type basée sur le contenu simulé
    const detectedType = detectDocumentType(mockTexts.invoice);
    setDocumentType(detectedType);
    
    return mockTexts[detectedType] || mockTexts.unknown;
  };

  const detectDocumentType = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('facture') || lowerText.includes('invoice') || lowerText.includes('montant') || lowerText.includes('€')) {
      return 'invoice';
    } else if (lowerText.includes('reçu') || lowerText.includes('receipt') || lowerText.includes('transaction') || lowerText.includes('terminal')) {
      return 'receipt';
    } else if (lowerText.includes('contrat') || lowerText.includes('contract') || lowerText.includes('article') || lowerText.includes('durée')) {
      return 'contract';
    } else if (lowerText.includes('carte') || lowerText.includes('identité') || lowerText.includes('naissance') || lowerText.includes('république')) {
      return 'id_card';
    } else {
      return 'unknown';
    }
  };

  const getDocumentTypeIcon = () => {
    switch (documentType) {
      case 'invoice':
        return 'document-text';
      case 'receipt':
        return 'receipt';
      case 'contract':
        return 'document';
      case 'id_card':
        return 'card';
      default:
        return 'document-outline';
    }
  };

  const getDocumentTypeColor = () => {
    switch (documentType) {
      case 'invoice':
        return '#FF9500';
      case 'receipt':
        return '#34C759';
      case 'contract':
        return '#007AFF';
      case 'id_card':
        return '#5856D6';
      default:
        return '#8E8E93';
    }
  };

  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case 'invoice':
        return 'Facture';
      case 'receipt':
        return 'Reçu';
      case 'contract':
        return 'Contrat';
      case 'id_card':
        return 'Pièce d\'identité';
      default:
        return 'Document';
    }
  };

  const saveDocument = () => {
    if (!document) {
      Alert.alert('Erreur', 'Aucun document à sauvegarder');
      return;
    }

    const documentData = {
      ...document,
      extractedText: extractedText,
      documentType: documentType,
      location: location,
      timestamp: new Date().toISOString(),
    };

    onDocumentScanned?.(documentData);
    onClose?.();
  };

  const retakeDocument = () => {
    setDocument(null);
    setExtractedText('');
    setDocumentType('unknown');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scanner de Document</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Document Area */}
      <View style={styles.documentContainer}>
        {document ? (
          <View style={styles.documentPreview}>
            <Image source={{ uri: document.uri }} style={styles.documentImage} />
            
            {/* Document Type Badge */}
            <View style={[styles.documentTypeBadge, { backgroundColor: getDocumentTypeColor() }]}>
              <Ionicons name={getDocumentTypeIcon()} size={16} color="white" />
              <Text style={styles.documentTypeText}>{getDocumentTypeLabel()}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDocumentContainer}>
            <Ionicons name="document-outline" size={80} color="#ccc" />
            <Text style={styles.noDocumentText}>Aucun document</Text>
            <TouchableOpacity style={styles.scanDocumentButton} onPress={() => setShowCamera(true)}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.scanDocumentButtonText}>Scanner un document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Extracted Text */}
      {extractedText && (
        <View style={styles.extractedTextContainer}>
          <View style={styles.extractedTextHeader}>
            <Ionicons name="text" size={20} color="#007AFF" />
            <Text style={styles.extractedTextTitle}>Texte extrait</Text>
          </View>
          <ScrollView style={styles.extractedTextScroll}>
            <Text style={styles.extractedText}>{extractedText}</Text>
          </ScrollView>
        </View>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <View style={styles.processingSpinner} />
          <Text style={styles.processingText}>Analyse du document en cours...</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowCamera(true)}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.controlButtonText}>Nouveau scan</Text>
        </TouchableOpacity>

        {document && (
          <TouchableOpacity style={styles.controlButton} onPress={retakeDocument}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
            <Text style={styles.controlButtonText}>Reprendre</Text>
          </TouchableOpacity>
        )}

        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.locationText}>
            {location ? `📍 ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'Géolocalisation non disponible'}
          </Text>
        </View>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode="document"
          onPhotoTaken={handleDocumentCaptured}
          onClose={() => setShowCamera(false)}
          showAnnotations={false}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  documentPreview: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  documentImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  documentTypeBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  documentTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  noDocumentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDocumentText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 30,
  },
  scanDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanDocumentButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  extractedTextContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  extractedTextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  extractedTextTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  extractedTextScroll: {
    flex: 1,
  },
  extractedText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  processingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 12,
  },
  processingSpinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
    borderRadius: 20,
    marginBottom: 12,
  },
  processingText: {
    color: 'white',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlButtonText: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default DocumentScannerComponent;
