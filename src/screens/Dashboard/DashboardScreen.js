import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tickets: 12,
    resolved: 8,
    pending: 4,
    blogPosts: 25,
    notifications: 3,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un rafraîchissement
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'Nouveau Ticket',
      icon: 'add-circle-outline',
      color: '#007AFF',
      screen: 'NewTicket',
    },
    {
      id: 2,
      title: 'Mes Tickets',
      icon: 'ticket-outline',
      color: '#34C759',
      screen: 'Tickets',
    },
    {
      id: 3,
      title: 'Blog',
      icon: 'newspaper-outline',
      color: '#FF9500',
      screen: 'Blog',
    },
    {
      id: 4,
      title: 'Chatbot',
      icon: 'chatbubble-outline',
      color: '#5856D6',
      screen: 'Chatbot',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'ticket',
      title: 'Ticket #1234 résolu',
      description: 'Problème de connexion résolu',
      time: 'Il y a 2 heures',
      icon: 'checkmark-circle',
      color: '#34C759',
    },
    {
      id: 2,
      type: 'blog',
      title: 'Nouvel article publié',
      description: 'Les tendances du développement web 2024',
      time: 'Il y a 1 jour',
      icon: 'newspaper',
      color: '#FF9500',
    },
    {
      id: 3,
      type: 'notification',
      title: 'Nouvelle notification',
      description: 'Mise à jour disponible',
      time: 'Il y a 3 heures',
      icon: 'notifications',
      color: '#007AFF',
    },
  ];

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate(action.screen)}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon} size={24} color="white" />
      </View>
      <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  const renderActivity = (activity) => (
    <View key={activity.id} style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
        <Ionicons name={activity.icon} size={20} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
          {activity.title}
        </Text>
        <Text style={[styles.activityDescription, { color: theme.colors.textSecondary }]}>
          {activity.description}
        </Text>
        <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
          {activity.time}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header avec gradient */}
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>Bonjour,</Text>
              <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications" size={24} color="white" />
            {stats.notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{stats.notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="ticket" size={24} color="#007AFF" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {stats.tickets}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Tickets
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {stats.resolved}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Résolus
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="time" size={24} color="#FF9500" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {stats.pending}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            En attente
          </Text>
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Actions Rapides
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      {/* Activités récentes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Activités Récentes
        </Text>
        <View style={styles.activitiesList}>
          {recentActivities.map(renderActivity)}
        </View>
      </View>

      {/* Espace en bas */}
      <View style={{ height: 20 }} />
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
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
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
});

export default DashboardScreen;
