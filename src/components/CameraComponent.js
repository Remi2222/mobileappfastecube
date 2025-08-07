import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Image,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

const CameraComponent = ({ 
  onPhotoTaken, 
  onQRScanned, 
  onFaceDetected, 
  mode = 'photo', // 'photo', 'qr', 'face', 'document'
  showAnnotations = false,
  onClose 
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [location, setLocation] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [gestureDetected, setGestureDetected] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [documentType, setDocumentType] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const cameraRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        
        setHasPermission(status === 'granted' && mediaStatus.status === 'granted');
        
        if (locationStatus.status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        }

        // Set camera constants after permissions are granted
        if (status === 'granted' && Camera.Constants) {
          setCameraType(Camera.Constants.Type.back);
          setFlashMode(Camera.Constants.FlashMode.off);
          setCameraReady(true);
        } else if (status === 'granted') {
          // Fallback if Camera.Constants is not available
          setCameraType('back');
          setFlashMode('off');
          setCameraReady(true);
        }
      } catch (error) {
        console.log('Camera permission error:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isScanning && mode === 'face') {
      // Animation de scan pour la reconnaissance faciale
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de pulsation pour les gestes
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning, mode]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: true,
        });

        // Ajouter les métadonnées de géolocalisation
        const photoWithMetadata = {
          ...photo,
          location: location,
          timestamp: new Date().toISOString(),
          annotations: annotations,
          documentType: documentType,
        };

        setCapturedImage(photoWithMetadata);
        onPhotoTaken?.(photoWithMetadata);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      } finally {
        setIsRecording(false);
      }
    }
  };

  const handleFaceDetection = async () => {
    setIsScanning(true);
    setFaceDetected(false);
    setGestureDetected(false);
    setScanProgress(0);
    
    // Simulation de reconnaissance faciale avec gestes avancés
    const steps = [
      { progress: 25, message: 'Détection du visage...' },
      { progress: 50, message: 'Analyse des traits...' },
      { progress: 75, message: 'Vérification des gestes...' },
      { progress: 100, message: 'Authentification réussie!' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(steps[i].progress);
      
      if (i === 2) {
        setGestureDetected(true);
      }
    }

    setIsScanning(false);
    setFaceDetected(true);
    onFaceDetected?.({ 
      success: true, 
      user: 'Utilisateur détecté',
      confidence: 0.95,
      gestures: ['blink', 'smile']
    });
  };

  const handleQRScan = async () => {
    setIsScanning(true);
    setQrData(null);
    setScanProgress(0);
    
    // Simulation de scan QR avec progression
    const scanSteps = [
      { progress: 30, message: 'Recherche du code QR...' },
      { progress: 60, message: 'Décodage en cours...' },
      { progress: 100, message: 'QR Code détecté!' }
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setScanProgress(scanSteps[i].progress);
    }

    setIsScanning(false);
    const mockQRData = {
      type: 'ticket',
      id: 'TKT-2024-001',
      data: 'Ticket information...',
      timestamp: new Date().toISOString(),
      location: location
    };
    setQrData(mockQRData);
    onQRScanned?.(mockQRData);
  };

  const detectDocumentType = (imageData) => {
    // Simulation de détection automatique du type de document
    const documentTypes = ['invoice', 'contract', 'id_card', 'receipt'];
    const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    setDocumentType(randomType);
    return randomType;
  };

  const addAnnotation = (x, y, text) => {
    const newAnnotation = {
      id: Date.now(),
      x,
      y,
      text,
      timestamp: new Date().toISOString(),
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const saveToGallery = async () => {
    if (capturedImage) {
      try {
        await MediaLibrary.saveToLibraryAsync(capturedImage.uri);
        Alert.alert('Succès', 'Photo sauvegardée dans la galerie');
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de sauvegarder la photo');
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setAnnotations([]);
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
          
          {/* Annotations sur la preview */}
          {showAnnotations && annotations.map((annotation) => (
            <View
              key={annotation.id}
              style={[
                styles.annotation,
                {
                  left: annotation.x,
                  top: annotation.y,
                },
              ]}
            >
              <Text style={styles.annotationText}>{annotation.text}</Text>
            </View>
          ))}

          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.previewButtonText}>Reprendre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.previewButton} onPress={saveToGallery}>
              <Ionicons name="save" size={24} color="white" />
              <Text style={styles.previewButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.previewButton} onPress={onClose}>
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.previewButtonText}>Utiliser</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : cameraReady && hasPermission ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants && Camera.Constants.Type ? Camera.Constants.Type[cameraType] || Camera.Constants.Type.back : cameraType}
          flashMode={Camera.Constants && Camera.Constants.FlashMode ? Camera.Constants.FlashMode[flashMode] || Camera.Constants.FlashMode.off : flashMode}
          onBarCodeScanned={mode === 'qr' ? handleQRScan : undefined}
        >
          {/* Overlay pour les modes spéciaux */}
          {mode === 'face' && (
            <View style={styles.faceOverlay}>
              <View style={styles.faceFrame}>
                {isScanning && (
                  <>
                    <Animated.View 
                      style={[
                        styles.scanningAnimation,
                        {
                          transform: [{
                            translateY: scanAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 200],
                            }),
                          }],
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['transparent', '#007AFF', 'transparent']}
                        style={styles.scanningLine}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                    </Animated.View>
                    
                    {/* Barre de progression */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${scanProgress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{scanProgress}%</Text>
                    </View>

                    {/* Indicateur de geste */}
                    {gestureDetected && (
                      <Animated.View 
                        style={[
                          styles.gestureIndicator,
                          {
                            transform: [{ scale: pulseAnimation }],
                          },
                        ]}
                      >
                        <Ionicons name="eye" size={40} color="#34C759" />
                        <Text style={styles.gestureText}>Geste détecté !</Text>
                      </Animated.View>
                    )}
                  </>
                )}
                {faceDetected && (
                  <View style={styles.faceDetected}>
                    <Ionicons name="checkmark-circle" size={60} color="#34C759" />
                    <Text style={styles.faceDetectedText}>Visage détecté !</Text>
                    <Text style={styles.confidenceText}>Confiance: 95%</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {mode === 'qr' && (
            <View style={styles.qrOverlay}>
              <View style={styles.qrFrame}>
                {isScanning && (
                  <>
                    <Animated.View 
                      style={[
                        styles.qrScanningAnimation,
                        {
                          transform: [{
                            translateY: scanAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 200],
                            }),
                          }],
                        },
                      ]}
                    >
                      <View style={styles.qrScanningLine} />
                    </Animated.View>
                    
                    {/* Barre de progression QR */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${scanProgress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{scanProgress}%</Text>
                    </View>
                  </>
                )}
                {qrData && (
                  <View style={styles.qrDetected}>
                    <Ionicons name="checkmark-circle" size={60} color="#34C759" />
                    <Text style={styles.qrDetectedText}>QR Code détecté !</Text>
                    <Text style={styles.qrDataText}>{qrData.type}: {qrData.id}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {mode === 'document' && (
            <View style={styles.documentOverlay}>
              <View style={styles.documentFrame}>
                {isScanning && (
                  <View style={styles.documentScanning}>
                    <Animated.View 
                      style={[
                        styles.documentScanLine,
                        {
                          transform: [{
                            translateY: scanAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 300],
                            }),
                          }],
                        },
                      ]}
                    />
                    <Text style={styles.documentScanText}>Scan du document...</Text>
                  </View>
                )}
                {documentType && (
                  <View style={styles.documentDetected}>
                    <Ionicons name="document-text" size={40} color="#34C759" />
                    <Text style={styles.documentTypeText}>Type: {documentType}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Contrôles de la caméra */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                if (Camera.Constants && Camera.Constants.Type) {
                  setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                } else {
                  setCameraType(cameraType === 'back' ? 'front' : 'back');
                }
              }}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={mode === 'face' ? handleFaceDetection : takePicture}
              disabled={isRecording}
            >
              {isRecording ? (
                <View style={styles.recordingIndicator} />
              ) : (
                <Ionicons 
                  name={mode === 'face' ? 'eye' : 'camera'} 
                  size={32} 
                  color="white" 
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                if (Camera.Constants && Camera.Constants.FlashMode) {
                  setFlashMode(
                    flashMode === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  );
                } else {
                  setFlashMode(flashMode === 'off' ? 'on' : 'off');
                }
              }}
            >
              <Ionicons 
                name={flashMode === 'off' ? 'flash-off' : 'flash'} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              {mode === 'face' && 'Clignez des yeux pour vous authentifier'}
              {mode === 'qr' && 'Pointez la caméra vers le code QR'}
              {mode === 'document' && 'Photographiez le document'}
              {mode === 'photo' && 'Appuyez pour prendre une photo'}
            </Text>
          </View>

          {/* Bouton de fermeture */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </Camera>
      ) : (
        <View style={styles.container}>
          <Text style={styles.permissionText}>
            {hasPermission === null ? 'Demande d\'autorisation...' : 'Pas d\'accès à la caméra'}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onClose}>
            <Text style={styles.permissionButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  faceOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    overflow: 'hidden',
  },
  scanningLine: {
    width: '100%',
    height: 2,
    position: 'absolute',
    top: '50%',
  },
  faceDetected: {
    alignItems: 'center',
  },
  faceDetectedText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  confidenceText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  qrOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrScanningAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  qrScanningLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: '50%',
  },
  qrDetected: {
    alignItems: 'center',
  },
  qrDetectedText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  qrDataText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  documentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  documentScanning: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentScanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: '50%',
  },
  documentScanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  documentDetected: {
    alignItems: 'center',
  },
  documentTypeText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  instructions: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  annotation: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 5,
    borderRadius: 5,
  },
  annotationText: {
    fontSize: 12,
    color: 'black',
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  previewButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  gestureIndicator: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  gestureText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});

export default CameraComponent;
