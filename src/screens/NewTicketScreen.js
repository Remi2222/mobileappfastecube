import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CameraComponent from '../components/CameraComponent';
import PhotoAnnotationComponent from '../components/PhotoAnnotationComponent';

const { width } = Dimensions.get('window');

const NewTicketScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'moyenne',
    category: 'technique',
    contactEmail: user?.email || '',
    contactPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoAnnotation, setShowPhotoAnnotation] = useState(false);
  const [attachedPhotos, setAttachedPhotos] = useState([]);
  const [cameraMode, setCameraMode] = useState('photo'); // 'photo', 'document', 'qr'
  const [scannedDocument, setScannedDocument] = useState(null);

  const priorities = [
    { value: 'basse', label: 'Basse', color: '#34C759' },
    { value: 'moyenne', label: 'Moyenne', color: '#FF9500' },
    { value: 'haute', label: 'Haute', color: '#FF3B30' },
    { value: 'critique', label: 'Critique', color: '#FF0000' }
  ];

  const categories = [
    { value: 'technique', label: 'Problème Technique' },
    { value: 'billing', label: 'Facturation' },
    { value: 'account', label: 'Compte Utilisateur' },
    { value: 'feature', label: 'Demande de Fonctionnalité' },
    { value: 'other', label: 'Autre' }
  ];

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePhotoTaken = (photoData) => {
    if (cameraMode === 'document') {
      setScannedDocument(photoData);
      // Simulation d'OCR
      Alert.alert(
        'Document Scanné',
        'Document détecté et analysé. Texte extrait automatiquement.',
        [
          {
            text: 'Ajouter au ticket',
            onPress: () => {
              setAttachedPhotos([...attachedPhotos, photoData]);
              setShowCamera(false);
            }
          },
          {
            text: 'Annoter',
            onPress: () => {
              setShowPhotoAnnotation(true);
              setShowCamera(false);
            }
          }
        ]
      );
    } else {
      setAttachedPhotos([...attachedPhotos, photoData]);
      setShowCamera(false);
    }
  };

  const handlePhotoAnnotated = (annotatedPhoto) => {
    setAttachedPhotos([...attachedPhotos, annotatedPhoto]);
    setShowPhotoAnnotation(false);
  };

  const handleQRScanned = (qrData) => {
    Alert.alert(
      'QR Code Détecté',
      `Type: ${qrData.type}\nID: ${qrData.id}`,
      [
        {
          text: 'Ajouter au ticket',
          onPress: () => {
            // Ajouter les informations du QR au ticket
            handleChange('description', formData.description + `\n\nQR Code détecté: ${qrData.type} - ${qrData.id}`);
            setShowCamera(false);
          }
        },
        {
          text: 'Ignorer',
          style: 'cancel',
          onPress: () => setShowCamera(false)
        }
      ]
    );
  };

  const removePhoto = (index) => {
    const newPhotos = attachedPhotos.filter((_, i) => i !== index);
    setAttachedPhotos(newPhotos);
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de création de ticket avec photos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ticketData = {
        ...formData,
        photos: attachedPhotos,
        scannedDocument: scannedDocument,
        createdAt: new Date().toISOString(),
      };
      
      Alert.alert(
        'Succès',
        'Votre ticket a été créé avec succès. Notre équipe vous répondra dans les plus brefs délais.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Tickets')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const found = priorities.find(p => p.value === priority);
    return found ? found.color : '#007AFF';
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.modalItem, { backgroundColor: theme.colors.background }]}
      onPress={() => {
        handleChange('category', item.value);
        setShowCategoryModal(false);
      }}
    >
      <Text style={[styles.modalItemText, { color: theme.colors.text }]}>
        {item.label}
      </Text>
      {formData.category === item.value && (
        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderPriorityItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.modalItem, { backgroundColor: theme.colors.background }]}
      onPress={() => {
        handleChange('priority', item.value);
        setShowPriorityModal(false);
      }}
    >
      <View style={styles.priorityItemContent}>
        <View style={[styles.priorityIndicator, { backgroundColor: item.color }]} />
        <Text style={[styles.modalItemText, { color: theme.colors.text }]}>
          {item.label}
        </Text>
      </View>
      {formData.priority === item.value && (
        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#007AFF', '#5856D6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Ionicons name="ticket-outline" size={40} color="white" />
            <Text style={styles.headerTitle}>Nouveau Ticket</Text>
            <Text style={styles.headerSubtitle}>
              Créez un nouveau ticket de support
            </Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Sujet du ticket *
            </Text>
            <View style={[styles.inputContainer, { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background
            }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Décrivez brièvement votre problème"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.subject}
                onChangeText={(value) => handleChange('subject', value)}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Description détaillée *
            </Text>
            <View style={[styles.textAreaContainer, { 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background
            }]}>
              <TextInput
                style={[styles.textArea, { color: theme.colors.text }]}
                placeholder="Décrivez en détail votre problème, les étapes pour le reproduire, et tout autre information utile..."
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.description}
                onChangeText={(value) => handleChange('description', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Category and Priority */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Catégorie
              </Text>
              <TouchableOpacity
                style={[styles.selectContainer, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background
                }]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.selectInput, { color: theme.colors.text }]}>
                  {categories.find(cat => cat.value === formData.category)?.label || ''}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Priorité
              </Text>
              <TouchableOpacity
                style={[styles.selectContainer, { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background
                }]}
                onPress={() => setShowPriorityModal(true)}
              >
                <View style={styles.prioritySelectContent}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(formData.priority) }]} />
                  <Text style={[styles.selectInput, { color: theme.colors.text }]}>
                    {priorities.find(p => p.value === formData.priority)?.label || ''}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email de contact
              </Text>
              <View style={[styles.inputContainer, { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="votre@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.contactEmail}
                  onChangeText={(value) => handleChange('contactEmail', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Téléphone (optionnel)
              </Text>
              <View style={[styles.inputContainer, { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background
              }]}>
                <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="+33 6 12 34 56 78"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.contactPhone}
                  onChangeText={(value) => handleChange('contactPhone', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Photo Attachments */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Photos et Documents
            </Text>
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={[styles.photoAction, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setCameraMode('photo');
                  setShowCamera(true);
                }}
              >
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.photoActionText}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoAction, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setCameraMode('document');
                  setShowCamera(true);
                }}
              >
                <Ionicons name="document" size={20} color="white" />
                <Text style={styles.photoActionText}>Scanner</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoAction, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setCameraMode('qr');
                  setShowCamera(true);
                }}
              >
                <Ionicons name="qr-code" size={20} color="white" />
                <Text style={styles.photoActionText}>QR Code</Text>
              </TouchableOpacity>
            </View>

            {/* Attached Photos */}
            {attachedPhotos.length > 0 && (
              <View style={styles.attachedPhotos}>
                <Text style={[styles.attachedPhotosTitle, { color: theme.colors.text }]}>
                  Photos jointes ({attachedPhotos.length})
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {attachedPhotos.map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removePhoto(index)}
                      >
                        <Ionicons name="close-circle" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Warning */}
          <View style={[styles.warningContainer, { backgroundColor: '#FFF3CD', borderColor: '#FFEAA7' }]}>
            <Ionicons name="warning-outline" size={24} color="#856404" />
            <View style={styles.warningContent}>
              <Text style={[styles.warningTitle, { color: '#856404' }]}>
                Information importante
              </Text>
              <Text style={[styles.warningText, { color: '#856404' }]}>
                Pour les problèmes urgents ou critiques, veuillez nous contacter directement par téléphone au +33 1 23 45 67 89.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.colors.primary }]}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.primary }]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.spinner} />
                  <Text style={styles.submitButtonText}>Création...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  Créer le Ticket
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Sélectionner une catégorie
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Priority Modal */}
      <Modal
        visible={showPriorityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Sélectionner une priorité
              </Text>
              <TouchableOpacity onPress={() => setShowPriorityModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={priorities}
              renderItem={renderPriorityItem}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode={cameraMode}
          onPhotoTaken={handlePhotoTaken}
          onQRScanned={handleQRScanned}
          onClose={() => setShowCamera(false)}
          showAnnotations={true}
        />
      </Modal>

      {/* Photo Annotation Modal */}
      <Modal
        visible={showPhotoAnnotation}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <PhotoAnnotationComponent
          onPhotoAnnotated={handlePhotoAnnotated}
          onClose={() => setShowPhotoAnnotation(false)}
          initialPhoto={scannedDocument}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  selectInput: {
    flex: 1,
    fontSize: 16,
  },
  prioritySelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  photoAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  photoActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  attachedPhotos: {
    marginTop: 16,
  },
  attachedPhotosTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  photoItem: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  warningContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    borderRadius: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 16,
  },
  priorityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default NewTicketScreen;
