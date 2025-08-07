import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CameraComponent from '../../components/CameraComponent';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const BiometricAuthScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [authMode, setAuthMode] = useState('face'); // 'face', 'qr', 'fingerprint'
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);
  const [gestureDetected, setGestureDetected] = useState(false);
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFaceDetection = async (result) => {
    if (result.success) {
      setIsAuthenticating(true);
      setAuthStep(1);
      
      // Simulation de vérification des gestes
      setTimeout(() => {
        setGestureDetected(true);
        setAuthStep(2);
        
        // Simulation de connexion réussie
        setTimeout(() => {
          setIsAuthenticating(false);
          setShowCamera(false);
          Alert.alert(
            'Authentification Réussie',
            'Bienvenue ! Vous êtes maintenant connecté.',
            [
              {
                text: 'OK',
                onPress: () => navigation.replace('MainApp')
              }
            ]
          );
        }, 1500);
      }, 2000);
    }
  };

  const handleQRScan = async (qrData) => {
    if (qrData) {
      setIsAuthenticating(true);
      
      // Simulation de traitement du QR
      setTimeout(() => {
        setIsAuthenticating(false);
        setShowCamera(false);
        Alert.alert(
          'QR Code Détecté',
          `Ticket: ${qrData.id}\nType: ${qrData.type}`,
          [
            {
              text: 'Voir le ticket',
              onPress: () => navigation.navigate('TicketDetail', { ticketId: qrData.id })
            },
            {
              text: 'Fermer',
              style: 'cancel'
            }
          ]
        );
      }, 1000);
    }
  };

  const handleFingerprintAuth = () => {
    setIsAuthenticating(true);
    
    // Simulation d'authentification par empreinte
    setTimeout(() => {
      setIsAuthenticating(false);
      Alert.alert(
        'Authentification Réussie',
        'Empreinte digitale reconnue !',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('MainApp')
          }
        ]
      );
    }, 2000);
  };

  const startFaceAuth = () => {
    setAuthMode('face');
    setAuthStep(0);
    setGestureDetected(false);
    setShowCamera(true);
  };

  const startQRAuth = () => {
    setAuthMode('qr');
    setShowCamera(true);
  };

  const getAuthStepText = () => {
    switch (authStep) {
      case 0:
        return 'Positionnez votre visage dans le cadre';
      case 1:
        return 'Clignez des yeux pour confirmer';
      case 2:
        return 'Authentification en cours...';
      default:
        return '';
    }
  };

  const getAuthStepIcon = () => {
    switch (authStep) {
      case 0:
        return 'eye-outline';
      case 1:
        return 'eye';
      case 2:
        return 'checkmark-circle';
      default:
        return 'eye-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            { opacity: fadeAnim }
          ]}
        >
          <Ionicons name="cube" size={80} color="white" />
          <Text style={styles.logoText}>FASTCUBE</Text>
          <Text style={styles.tagline}>Authentification Biométrique</Text>
        </Animated.View>
      </LinearGradient>

      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Choisissez votre méthode d'authentification
        </Text>

        <View style={styles.authOptions}>
          {/* Reconnaissance Faciale Avancée */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={startFaceAuth}
            disabled={isAuthenticating}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={32} color="white" />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Reconnaissance Faciale
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Scan du visage + détection de gestes
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Reconnaissance faciale
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Détection de clignements
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Sécurité renforcée
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Scan QR Sécurisé */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={startQRAuth}
            disabled={isAuthenticating}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="qr-code" size={32} color="white" />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Scan QR Sécurisé
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Authentification via code QR
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Scan instantané
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Accès aux tickets
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Sécurité maximale
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Empreinte Digitale */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={handleFingerprintAuth}
            disabled={isAuthenticating}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="finger-print" size={32} color="white" />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Empreinte Digitale
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Authentification par empreinte
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Reconnaissance rapide
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Sécurité biométrique
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  Accès instantané
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Connexion Classique */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={() => navigation.navigate('Login')}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="mail" size={32} color="white" />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Connexion Email
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Méthode traditionnelle
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
            Retour
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de la caméra */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          mode={authMode}
          onFaceDetected={handleFaceDetection}
          onQRScanned={handleQRScan}
          onClose={() => setShowCamera(false)}
        />
      </Modal>

      {/* Overlay d'authentification */}
      {isAuthenticating && (
        <Modal
          visible={isAuthenticating}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.authOverlay}>
            <View style={[styles.authModal, { backgroundColor: theme.colors.surface }]}>
              <Animated.View
                style={[
                  styles.authIcon,
                  {
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <Ionicons 
                  name={getAuthStepIcon()} 
                  size={60} 
                  color={theme.colors.primary} 
                />
              </Animated.View>
              
              <Text style={[styles.authText, { color: theme.colors.text }]}>
                {getAuthStepText()}
              </Text>
              
              {gestureDetected && (
                <View style={styles.gestureDetected}>
                  <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  <Text style={[styles.gestureText, { color: '#34C759' }]}>
                    Geste détecté !
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  authOptions: {
    gap: 16,
  },
  authOption: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  authOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authModal: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 300,
  },
  authIcon: {
    marginBottom: 20,
  },
  authText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  gestureDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  gestureText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BiometricAuthScreen;
