import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import CameraComponent from '../../components/CameraComponent';

const { width, height } = Dimensions.get('window');

const TicketScannerScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanMode, setScanMode] = useState('qr'); // 'qr', 'generate', 'history'
  const [generatedTickets, setGeneratedTickets] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isScanning) {
      // Animation de scan
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

      // Animation de pulsation
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
  }, [isScanning]);

  const handleStartScan = () => {
    setScanMode('qr');
    setShowCamera(true);
  };

  const handleQRScanned = (qrData) => {
    setShowCamera(false);
    setIsScanning(false);
    
    const mockScannedData = {
      ticketId: qrData.id || 'TKT-2024-001',
      title: 'Problème de connexion',
      description: 'Impossible de se connecter à l\'application',
      priority: 'High',
      status: 'Open',
      createdAt: '2024-01-15',
      location: qrData.location,
      scannedBy: user?.email || 'Utilisateur',
      scannedAt: new Date().toISOString(),
    };
    
    setScannedData(mockScannedData);
    setScanHistory(prev => [mockScannedData, ...prev.slice(0, 9)]);
    setShowModal(true);
  };

  const handleGenerateTicket = () => {
    setScanMode('generate');
    const newTicket = {
      ticketId: `TKT-${Date.now()}`,
      title: 'Nouveau ticket généré',
      description: 'Ticket créé via scanner',
      priority: 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString(),
      generatedBy: user?.email || 'Utilisateur',
      qrCode: `https://fastcube.app/ticket/${Date.now()}`,
    };
    
    setGeneratedTickets(prev => [newTicket, ...prev.slice(0, 9)]);
    setScannedData(newTicket);
    setShowModal(true);
  };

  const handleViewTicket = () => {
    setShowModal(false);
    navigation.navigate('TicketDetail', { ticketId: scannedData.ticketId });
  };

  const handleCreateNewTicket = () => {
    setShowModal(false);
    navigation.navigate('NewTicket');
  };

  const handleShareTicket = () => {
    Alert.alert(
      'Partager le ticket',
      `Ticket ${scannedData.ticketId} partagé avec succès !`,
      [{ text: 'OK' }]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#FF9500';
      case 'In Progress': return '#007AFF';
      case 'Resolved': return '#34C759';
      case 'Closed': return '#8E8E93';
      default: return '#007AFF';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner de Tickets</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        {!isScanning ? (
          <View style={styles.scannerPlaceholder}>
            <View style={[styles.scannerFrame, { borderColor: theme.colors.primary }]}>
              <Ionicons name="scan" size={80} color={theme.colors.primary} />
              <Text style={[styles.scannerText, { color: theme.colors.text }]}>
                Positionnez le code QR du ticket dans le cadre
              </Text>
            </View>
            
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleStartScan}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.quickActionText}>Scanner QR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleGenerateTicket}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.quickActionText}>Générer Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.scanningContainer}>
            <Animated.View 
              style={[
                styles.scanningFrame, 
                { 
                  borderColor: theme.colors.primary,
                  transform: [{ scale: pulseAnimation }]
                }
              ]}
            >
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
                <View style={[styles.scanningLine, { backgroundColor: theme.colors.primary }]} />
              </Animated.View>
            </Animated.View>
            <Text style={[styles.scanningText, { color: theme.colors.text }]}>
              Scan en cours...
            </Text>
          </View>
        )}
      </View>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <View style={[styles.historyContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.historyTitle, { color: theme.colors.text }]}>
            Historique des scans
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {scanHistory.slice(0, 5).map((ticket, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.historyItem, { backgroundColor: theme.colors.background }]}
                onPress={() => {
                  setScannedData(ticket);
                  setShowModal(true);
                }}
              >
                <Ionicons name="ticket" size={20} color={theme.colors.primary} />
                <Text style={[styles.historyItemText, { color: theme.colors.text }]}>
                  {ticket.ticketId}
                </Text>
                <Text style={[styles.historyItemDate, { color: theme.colors.textSecondary }]}>
                  {new Date(ticket.scannedAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Instructions */}
      <View style={[styles.instructionsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
          Fonctionnalités du scanner
        </Text>
        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <Ionicons name="qr-code" size={20} color={theme.colors.primary} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Scan de codes QR pour accéder aux tickets
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Génération de nouveaux tickets
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Géolocalisation automatique
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="share" size={20} color={theme.colors.primary} />
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              Partage de tickets
            </Text>
          </View>
        </View>
      </View>

      {/* Modal pour les résultats du scan */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Ticket Scanné
            </Text>
            
            {scannedData && (
              <View style={styles.ticketInfo}>
                <View style={styles.ticketHeader}>
                  <Text style={[styles.ticketId, { color: theme.colors.text }]}>
                    {scannedData.ticketId}
                  </Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(scannedData.priority) }]}>
                    <Text style={styles.priorityText}>{scannedData.priority}</Text>
                  </View>
                </View>
                
                <Text style={[styles.ticketTitle, { color: theme.colors.text }]}>
                  {scannedData.title}
                </Text>
                
                <Text style={[styles.ticketDescription, { color: theme.colors.textSecondary }]}>
                  {scannedData.description}
                </Text>
                
                <View style={styles.ticketMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                      {new Date(scannedData.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {scannedData.location && (
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                        {scannedData.location.coords.latitude.toFixed(4)}, {scannedData.location.coords.longitude.toFixed(4)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleViewTicket}
              >
                <Ionicons name="eye" size={20} color="white" />
                <Text style={styles.modalButtonText}>Voir le ticket</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleShareTicket}
              >
                <Ionicons name="share" size={20} color="white" />
                <Text style={styles.modalButtonText}>Partager</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.background }]}
                onPress={handleCreateNewTicket}
              >
                <Ionicons name="add" size={20} color={theme.colors.primary} />
                <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>Nouveau ticket</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
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
          mode="qr"
          onQRScanned={handleQRScanned}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerPlaceholder: {
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  scannerText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanningContainer: {
    alignItems: 'center',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  scanningAnimation: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningLine: {
    width: '80%',
    height: 2,
    borderRadius: 1,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructionsContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketInfo: {
    marginBottom: 24,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDate: {
    fontSize: 12,
  },
  modalActions: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  historyContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItemText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  historyItemDate: {
    fontSize: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default TicketScannerScreen;
