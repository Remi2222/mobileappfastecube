import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const AboutScreen = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      id: 1,
      name: 'Ahmed Ben Ali',
      role: 'CEO & Fondateur',
      description: 'Expert en développement web avec 10+ ans d\'expérience',
      icon: 'person-circle-outline',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Lead Developer',
      description: 'Spécialiste React Native et développement mobile',
      icon: 'code-slash-outline',
    },
    {
      id: 3,
      name: 'Mohammed El Amri',
      role: 'UI/UX Designer',
      description: 'Créateur d\'interfaces modernes et intuitives',
      icon: 'color-palette-outline',
    },
  ];

  const stats = [
    { number: '150+', label: 'Projets Réalisés' },
    { number: '50+', label: 'Clients Satisfaits' },
    { number: '5+', label: 'Années d\'Expérience' },
    { number: '24/7', label: 'Support Client' },
  ];

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
          <Ionicons name="cube" size={60} color="white" />
          <Text style={styles.companyName}>FASTCUBE</Text>
          <Text style={styles.tagline}>Votre partenaire digital de confiance</Text>
        </View>
      </LinearGradient>

      {/* Mission Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Notre Mission
        </Text>
        <Text style={[styles.missionText, { color: theme.colors.textSecondary }]}>
          Chez FASTCUBE, nous transformons vos idées en solutions digitales innovantes. 
          Notre équipe d'experts combine créativité et technologie pour créer des 
          applications web et mobiles qui propulsent votre entreprise vers le succès.
        </Text>
      </View>

      {/* Stats Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Nos Chiffres
        </Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stat.number}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Team Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Notre Équipe
        </Text>
        {teamMembers.map((member) => (
          <View key={member.id} style={styles.teamMember}>
            <View style={[styles.memberIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name={member.icon} size={24} color="white" />
            </View>
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: theme.colors.text }]}>
                {member.name}
              </Text>
              <Text style={[styles.memberRole, { color: theme.colors.primary }]}>
                {member.role}
              </Text>
              <Text style={[styles.memberDescription, { color: theme.colors.textSecondary }]}>
                {member.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Values Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Nos Valeurs
        </Text>
        <View style={styles.valuesContainer}>
          <View style={styles.valueItem}>
            <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.valueTitle, { color: theme.colors.text }]}>Innovation</Text>
            <Text style={[styles.valueDescription, { color: theme.colors.textSecondary }]}>
              Nous repoussons les limites de la technologie
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.valueTitle, { color: theme.colors.text }]}>Qualité</Text>
            <Text style={[styles.valueDescription, { color: theme.colors.textSecondary }]}>
              Excellence dans chaque ligne de code
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.valueTitle, { color: theme.colors.text }]}>Collaboration</Text>
            <Text style={[styles.valueDescription, { color: theme.colors.textSecondary }]}>
              Travailler ensemble pour votre succès
            </Text>
          </View>
        </View>
      </View>

      {/* Contact CTA */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.ctaTitle, { color: theme.colors.text }]}>
          Prêt à Démarrer Votre Projet ?
        </Text>
        <Text style={[styles.ctaText, { color: theme.colors.textSecondary }]}>
          Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé.
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <LinearGradient
            colors={['#007AFF', '#5856D6']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaButtonText}>Nous Contacter</Text>
          </LinearGradient>
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
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  companyName: {
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
  section: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  teamMember: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  memberIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  valuesContainer: {
    gap: 16,
  },
  valueItem: {
    alignItems: 'center',
    padding: 16,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AboutScreen;
