import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const TicketsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading tickets
    const mockTickets = [
      {
        id: 1,
        title: 'Problème de connexion',
        description: 'Impossible de se connecter à l\'application',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: 2,
        title: 'Demande de fonctionnalité',
        description: 'Ajout d\'une nouvelle fonctionnalité',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
      },
      {
        id: 3,
        title: 'Bug dans l\'interface',
        description: 'Problème d\'affichage sur mobile',
        status: 'closed',
        priority: 'low',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-08',
      },
    ];
    
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#FF9500';
      case 'in_progress':
        return '#007AFF';
      case 'closed':
        return '#34C759';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return priority;
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={[styles.ticketCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
    >
      <View style={styles.ticketHeader}>
        <Text style={[styles.ticketTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={[styles.ticketDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>
      
      <View style={styles.ticketFooter}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{getPriorityText(item.priority)}</Text>
        </View>
        <Text style={[styles.ticketDate, { color: theme.colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Chargement des tickets...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Mes Tickets
        </Text>
        <TouchableOpacity
          style={[styles.newTicketButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('NewTicket')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.newTicketButtonText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.ticketsList}
        showsVerticalScrollIndicator={false}
      />
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
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  newTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newTicketButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  ticketsList: {
    padding: 20,
  },
  ticketCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDate: {
    fontSize: 12,
  },
});

export default TicketsScreen;
