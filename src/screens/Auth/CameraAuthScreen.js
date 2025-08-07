import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const CameraAuthScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const { theme } = useTheme();
  const { login } = useAuth();

  const handleFaceRecognition = async () => {
    setIsScanning(true);
    
    // Simulation de reconnaissance faciale
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'Reconnaissance Faciale',
        'Fonctionnalité en cours de développement. Utilisez la connexion par email pour le moment.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    }, 2000);
  };

  const handleFingerprintAuth = () => {
    Alert.alert(
      'Empreinte Digitale',
      'Fonctionnalité en cours de développement. Utilisez la connexion par email pour le moment.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Ionicons name="cube" size={80} color="white" />
          <Text style={styles.logoText}>FASTCUBE</Text>
          <Text style={styles.tagline}>Authentification Sécurisée</Text>
        </View>
      </LinearGradient>

      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Choisissez votre méthode d'authentification
        </Text>

        <View style={styles.authOptions}>
          {/* Reconnaissance Faciale */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={handleFaceRecognition}
            disabled={isScanning}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons 
                name={isScanning ? "scan-circle" : "camera"} 
                size={32} 
                color="white" 
              />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Reconnaissance Faciale
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Scannez votre visage pour vous connecter
            </Text>
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <Text style={[styles.scanningText, { color: theme.colors.primary }]}>
                  Scan en cours...
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Empreinte Digitale */}
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: theme.colors.background }]}
            onPress={handleFingerprintAuth}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="finger-print" size={32} color="white" />
            </View>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Empreinte Digitale
            </Text>
            <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
              Utilisez votre empreinte pour vous connecter
            </Text>
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
              Connectez-vous avec email et mot de passe
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
  },
  scanningIndicator: {
    marginTop: 12,
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 14,
    fontWeight: '600',
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
});

export default CameraAuthScreen;
