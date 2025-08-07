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
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CameraComponent from './CameraComponent';

const { width, height } = Dimensions.get('window');

const PhotoAnnotationComponent = ({ 
  onPhotoAnnotated, 
  onClose, 
  initialPhoto = null 
}) => {
  const [photo, setPhoto] = useState(initialPhoto);
  const [annotations, setAnnotations] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [location, setLocation] = useState(null);
  const [annotationText, setAnnotationText] = useState('');

  const photoRef = useRef(null);

  React.useEffect(() => {
    if (!initialPhoto) {
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

  const handlePhotoTaken = (photoData) => {
    setPhoto(photoData);
    setShowCamera(false);
    
    // Ajouter automatiquement les métadonnées de géolocalisation
    if (photoData.location) {
      const locationAnnotation = {
        id: Date.now(),
        x: 50,
        y: 50,
        text: `📍 Localisation: ${photoData.location.coords.latitude.toFixed(4)}, ${photoData.location.coords.longitude.toFixed(4)}`,
        type: 'location',
        timestamp: new Date().toISOString(),
      };
      setAnnotations([locationAnnotation]);
    }
  };

  const handlePhotoPress = (event) => {
    if (!photo) return;

    const { locationX, locationY } = event.nativeEvent;
    setCurrentAnnotation({
      x: locationX,
      y: locationY,
    });
    setShowAnnotationModal(true);
  };

  const addAnnotation = () => {
    if (!annotationText.trim() || !currentAnnotation) return;

    const newAnnotation = {
      id: Date.now(),
      x: currentAnnotation.x,
      y: currentAnnotation.y,
      text: annotationText,
      type: 'manual',
      timestamp: new Date().toISOString(),
    };

    setAnnotations([...annotations, newAnnotation]);
    setAnnotationText('');
    setCurrentAnnotation(null);
    setShowAnnotationModal(false);
  };

  const removeAnnotation = (annotationId) => {
    setAnnotations(annotations.filter(ann => ann.id !== annotationId));
  };

  const saveAnnotatedPhoto = () => {
    if (!photo) {
      Alert.alert('Erreur', 'Aucune photo à sauvegarder');
      return;
    }

    const annotatedPhotoData = {
      ...photo,
      annotations: annotations,
      location: location,
      timestamp: new Date().toISOString(),
    };

    onPhotoAnnotated?.(annotatedPhotoData);
    onClose?.();
  };

  const takeNewPhoto = () => {
    setShowCamera(true);
  };

  const getLocationText = () => {
    if (!location) return 'Géolocalisation non disponible';
    
    return `📍 ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Annotation de Photo</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveAnnotatedPhoto}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Photo Area */}
      <View style={styles.photoContainer}>
        {photo ? (
          <TouchableOpacity 
            style={styles.photoWrapper}
            onPress={handlePhotoPress}
            activeOpacity={0.9}
          >
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            
            {/* Annotations overlay */}
            {annotations.map((annotation) => (
              <View
                key={annotation.id}
                style={[
                  styles.annotation,
                  {
                    left: annotation.x - 10,
                    top: annotation.y - 10,
                  },
                ]}
              >
                <View style={styles.annotationContent}>
                  <Text style={styles.annotationText}>{annotation.text}</Text>
                  <TouchableOpacity
                    style={styles.removeAnnotation}
                    onPress={() => removeAnnotation(annotation.id)}
                  >
                    <Ionicons name="close-circle" size={16} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </TouchableOpacity>
        ) : (
          <View style={styles.noPhotoContainer}>
            <Ionicons name="camera" size={80} color="#ccc" />
            <Text style={styles.noPhotoText}>Aucune photo</Text>
            <TouchableOpacity style={styles.takePhotoButton} onPress={takeNewPhoto}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.takePhotoButtonText}>Prendre une photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={takeNewPhoto}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.controlButtonText}>Nouvelle photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => setShowAnnotationModal(true)}
          disabled={!photo}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.controlButtonText}>Ajouter annotation</Text>
        </TouchableOpacity>

        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.locationText}>{getLocationText()}</Text>
        </View>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode="photo"
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
          showAnnotations={true}
        />
      </Modal>

      {/* Annotation Modal */}
      <Modal
        visible={showAnnotationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une annotation</Text>
            
            <TextInput
              style={styles.annotationInput}
              placeholder="Entrez votre annotation..."
              value={annotationText}
              onChangeText={setAnnotationText}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAnnotationModal(false);
                  setAnnotationText('');
                  setCurrentAnnotation(null);
                }}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={addAnnotation}
              >
                <Text style={styles.modalButtonTextPrimary}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  noPhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noPhotoText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 30,
  },
  takePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  takePhotoButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  annotation: {
    position: 'absolute',
    zIndex: 10,
  },
  annotationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  annotationText: {
    fontSize: 12,
    color: 'black',
    flex: 1,
  },
  removeAnnotation: {
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  annotationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modalButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontWeight: '600',
  },
});

export default PhotoAnnotationComponent;
