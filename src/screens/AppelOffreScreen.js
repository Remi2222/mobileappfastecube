import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const AppelOffreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Mock data for tenders
  const mockTenders = [
    {
      id: 1,
      reference: 'ADO-2025-001',
      title: 'Développement d\'une plateforme de cybersécurité',
      category: 'IT',
      description: 'Création d\'une solution complète de monitoring et protection contre les cybermenaces',
      publishedDate: '2025-01-15',
      deadline: '2025-02-28',
      status: 'En cours',
      budget: '50,000 - 80,000 MAD',
      requirements: ['CV technique', 'Devis détaillé', 'Attestation d\'assurance', 'Références clients'],
      criteria: ['Expertise cybersécurité', 'Expérience similaire', 'Prix compétitif', 'Délai de livraison'],
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+33 1 23 45 67 89'
    },
    {
      id: 2,
      reference: 'ADO-2025-002',
      title: 'Fourniture d\'équipements réseau',
      category: 'Fourniture',
      description: 'Acquisition de switches, routeurs et équipements de sécurité réseau',
      publishedDate: '2025-01-10',
      deadline: '2025-02-15',
      status: 'En cours',
      budget: '25,000 - 40,000 MAD',
      requirements: ['Catalogue produits', 'Devis technique', 'Garantie constructeur', 'Certifications'],
      criteria: ['Qualité des équipements', 'Prix', 'Garantie', 'Support technique'],
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+33 1 23 45 67 89'
    },
    {
      id: 3,
      reference: 'ADO-2025-003',
      title: 'Application mobile e-commerce',
      category: 'Développement',
      description: 'Développement d\'une application mobile pour plateforme e-commerce',
      publishedDate: '2025-01-05',
      deadline: '2025-03-15',
      status: 'En cours',
      budget: '80,000 - 120,000 MAD',
      requirements: ['Portfolio', 'Devis détaillé', 'Planning', 'Références'],
      criteria: ['Expérience mobile', 'Qualité du code', 'Prix', 'Délai'],
      contactEmail: 'tenders@fastcube.com',
      contactPhone: '+33 1 23 45 67 89'
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'IT', label: 'IT' },
    { value: 'Fourniture', label: 'Fourniture' },
    { value: 'Développement', label: 'Développement' },
    { value: 'Consulting', label: 'Consulting' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTenders(mockTenders);
      setFilteredTenders(mockTenders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterTenders();
  }, [searchTerm, selectedCategory, tenders]);

  const filterTenders = () => {
    let filtered = tenders;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }

    setFilteredTenders(filtered);
  };

  const handleTenderPress = (tender) => {
    setSelectedTender(tender);
    setShowModal(true);
  };

  const handleSubmitProposal = () => {
    Alert.alert(
      'Soumission de proposition',
      'Fonctionnalité en cours de développement. Veuillez contacter directement ' + selectedTender.contactEmail,
      [
        {
          text: 'OK',
          onPress: () => setShowModal(false)
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours':
        return '#007AFF';
      case 'Clôturé':
        return '#8E8E93';
      case 'En attente':
        return '#FF9500';
      default:
        return '#007AFF';
    }
  };

  const renderTenderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tenderCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleTenderPress(item)}
    >
      <View style={styles.tenderHeader}>
        <View style={styles.tenderRef}>
          <Text style={[styles.tenderRefText, { color: theme.colors.primary }]}>
            {item.reference}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={[styles.tenderTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>

      <Text style={[styles.tenderDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>

      <View style={styles.tenderMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            Publié le {new Date(item.publishedDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            Limite : {new Date(item.deadline).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="business-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {item.category}
          </Text>
        </View>
      </View>

      <View style={styles.tenderFooter}>
        <Text style={[styles.budgetText, { color: theme.colors.textSecondary }]}>
          Budget estimé : <Text style={[styles.budgetAmount, { color: theme.colors.text }]}>{item.budget}</Text>
        </Text>
        <TouchableOpacity style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.detailsButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Chargement des appels d'offre...
          </Text>
        </View>
      </View>
    );
  }

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
          
          <View style={styles.headerTitleContainer}>
            <Ionicons name="document-text-outline" size={32} color="white" />
            <Text style={styles.headerTitle}>Appels d'Offre</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Rechercher un appel d'offre..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          
          <View style={[styles.categoryFilter, { backgroundColor: theme.colors.background }]}>
            <TextInput
              style={[styles.categoryInput, { color: theme.colors.text }]}
              value={categories.find(cat => cat.value === selectedCategory)?.label || ''}
              editable={false}
            />
            <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <FlatList
        data={filteredTenders}
        renderItem={renderTenderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.tendersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Aucun appel d'offre trouvé
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Essayez de modifier vos critères de recherche.
            </Text>
          </View>
        }
      />

      {/* Tender Details Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            {selectedTender && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                    Détails de l'appel d'offre
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.tenderDetails}>
                  <Text style={[styles.detailTitle, { color: theme.colors.text }]}>
                    {selectedTender.title}
                  </Text>

                  <View style={styles.detailInfo}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Référence : <Text style={[styles.detailValue, { color: theme.colors.text }]}>{selectedTender.reference}</Text>
                    </Text>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Catégorie : <Text style={[styles.detailValue, { color: theme.colors.text }]}>{selectedTender.category}</Text>
                    </Text>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Budget : <Text style={[styles.detailValue, { color: theme.colors.text }]}>{selectedTender.budget}</Text>
                    </Text>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Statut : <Text style={[styles.detailValue, { color: theme.colors.text }]}>{selectedTender.status}</Text>
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                      Documents requis
                    </Text>
                    {selectedTender.requirements.map((req, index) => (
                      <View key={index} style={styles.requirementItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                        <Text style={[styles.requirementText, { color: theme.colors.text }]}>
                          {req}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                      Critères de sélection
                    </Text>
                    {selectedTender.criteria.map((criteria, index) => (
                      <View key={index} style={styles.requirementItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                        <Text style={[styles.requirementText, { color: theme.colors.text }]}>
                          {criteria}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.contactSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                      Contact
                    </Text>
                    <View style={styles.contactItem}>
                      <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.contactText, { color: theme.colors.text }]}>
                        {selectedTender.contactEmail}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.contactText, { color: theme.colors.text }]}>
                        {selectedTender.contactPhone}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleSubmitProposal}
                  >
                    <Text style={styles.submitButtonText}>Soumettre une proposition</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
    borderRadius: 20,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    minWidth: 120,
  },
  categoryInput: {
    flex: 1,
    fontSize: 16,
  },
  tendersList: {
    padding: 20,
  },
  tenderCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tenderRef: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tenderRefText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tenderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tenderDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tenderMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 8,
  },
  tenderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 12,
  },
  budgetAmount: {
    fontWeight: '600',
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: height * 0.9,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  tenderDetails: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailInfo: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  modalButtons: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppelOffreScreen;
