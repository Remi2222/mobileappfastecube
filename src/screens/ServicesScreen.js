import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const ServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const services = [
    {
      id: 1,
      title: 'Développement Web',
      description: 'Création de sites web modernes, applications web et e-commerce avec les dernières technologies.',
      icon: 'globe-outline',
      color: '#007AFF',
      features: ['React/Next.js', 'Node.js', 'E-commerce', 'SEO'],
    },
    {
      id: 2,
      title: 'Applications Mobile',
      description: 'Développement d\'applications mobiles natives iOS et Android avec React Native et Flutter.',
      icon: 'phone-portrait-outline',
      color: '#34C759',
      features: ['React Native', 'Flutter', 'iOS', 'Android'],
    },
    {
      id: 3,
      title: 'Consulting IT',
      description: 'Conseil en transformation digitale, audit technique et accompagnement stratégique.',
      icon: 'briefcase-outline',
      color: '#FF9500',
      features: ['Audit', 'Stratégie', 'Transformation', 'Accompagnement'],
    },
    {
      id: 4,
      title: 'Formation',
      description: 'Formation en développement web et mobile pour équipes et particuliers.',
      icon: 'school-outline',
      color: '#5856D6',
      features: ['Web', 'Mobile', 'DevOps', 'Agile'],
    },
  ];

  const renderServiceCard = (service) => (
    <View
      key={service.id}
      style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
        <Ionicons name={service.icon} size={32} color="white" />
      </View>
      <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>
        {service.title}
      </Text>
      <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
        {service.description}
      </Text>
      <View style={styles.featuresContainer}>
        {service.features.map((feature, index) => (
          <View key={index} style={[styles.featureTag, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Nos Services
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Découvrez notre expertise
        </Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map(renderServiceCard)}
      </View>

      <View style={styles.contactSection}>
        <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
          Besoin d'un devis ?
        </Text>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.contactButtonText}>Nous contacter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactSection: {
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServicesScreen;
