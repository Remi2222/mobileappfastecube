import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const services = [
    {
      id: 1,
      title: 'Développement Web',
      description: 'Sites web modernes et applications web',
      icon: 'globe-outline',
      color: '#007AFF',
    },
    {
      id: 2,
      title: 'Applications Mobile',
      description: 'Apps iOS et Android natives',
      icon: 'phone-portrait-outline',
      color: '#34C759',
    },
    {
      id: 3,
      title: 'Consulting IT',
      description: 'Conseil et accompagnement digital',
      icon: 'briefcase-outline',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Formation',
      description: 'Formation en développement',
      icon: 'school-outline',
      color: '#5856D6',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Nouveau Ticket',
      icon: 'add-circle-outline',
      screen: 'NewTicket',
    },
    {
      id: 2,
      title: 'Mes Tickets',
      icon: 'ticket-outline',
      screen: 'Tickets',
    },
    {
      id: 3,
      title: 'Blog',
      icon: 'newspaper-outline',
      screen: 'Blog',
    },
    {
      id: 4,
      title: 'Appels d\'Offre',
      icon: 'document-text-outline',
      screen: 'AppelOffre',
    },
    {
      id: 5,
      title: 'Contact',
      icon: 'call-outline',
      screen: 'Contact',
    },
  ];

  const renderServiceCard = (service) => (
    <TouchableOpacity
      key={service.id}
      style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Services')}
    >
      <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
        <Ionicons name={service.icon} size={24} color="white" />
      </View>
      <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>
        {service.title}
      </Text>
      <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
        {service.description}
      </Text>
    </TouchableOpacity>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate(action.screen)}
    >
      <Ionicons name={action.icon} size={32} color={theme.colors.primary} />
      <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Bienvenue</Text>
            <Text style={styles.userName}>
              {user ? user.name || user.email : 'Utilisateur'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Actions Rapides
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Nos Services
        </Text>
        <View style={styles.servicesGrid}>
          {services.map(renderServiceCard)}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Statistiques
        </Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>150+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Clients Satisfaits
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.success} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>200+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Projets Réalisés
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
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
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
